import { Hono } from 'hono';
import { authMiddleware, Bindings, Variables } from '../middleware/auth';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

const familiesRouter = new Hono<{ Bindings: Bindings, Variables: Variables }>();

familiesRouter.use('/*', authMiddleware);

const getDb = (connectionString: string) => {
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema });
};

familiesRouter.get('/my-family', async (c) => {
  const user = c.get('user');
  const db = getDb(c.env.DATABASE_URL);

  let profileResult = await db.select().from(schema.profiles).where(eq(schema.profiles.id, user.id));
  let profile = profileResult[0];

  // Auto-create profile and family if they don't exist
  if (!profile) {
    const [newFamily] = await db.insert(schema.families).values({
      name: user.email?.split('@')[0] || "My Family",
    }).returning();

    const [newProfile] = await db.insert(schema.profiles).values({
      id: user.id,
      email: user.email,
      phone: user.phone,
      familyId: newFamily.id,
      role: 'GUEST',
    }).returning();

    profile = newProfile;
  }

  const familyResult = await db.select().from(schema.families).where(eq(schema.families.id, profile.familyId!));
  const family = familyResult[0];

  const familyGuests = await db.select().from(schema.guests).where(eq(schema.guests.familyId, profile.familyId!));

  return c.json({
    family,
    guests: familyGuests,
  });
});

familiesRouter.post('/guests', async (c) => {
  const user = c.get('user');
  const db = getDb(c.env.DATABASE_URL);
  
  const { firstName, lastName } = await c.req.json();

  const profileResult = await db.select().from(schema.profiles).where(eq(schema.profiles.id, user.id));
  const profile = profileResult[0];

  if (!profile || !profile.familyId) return c.json({ error: 'Unauthorized' }, 403);

  const [newGuest] = await db.insert(schema.guests).values({
    familyId: profile.familyId,
    firstName,
    lastName,
  }).returning();

  return c.json({ success: true, guest: newGuest });
});

familiesRouter.post('/rsvp', async (c) => {
  const user = c.get('user');
  const db = getDb(c.env.DATABASE_URL);
  
  const body = await c.req.json();
  const { guestId, isAttending, dietaryRestrictions, accommodationNeeded } = body;

  const profileResult = await db.select().from(schema.profiles).where(eq(schema.profiles.id, user.id));
  const profile = profileResult[0];

  const guestResult = await db.select().from(schema.guests).where(eq(schema.guests.id, guestId));
  const guest = guestResult[0];

  if (!guest || guest.familyId !== profile?.familyId) {
    return c.json({ error: 'Unauthorized' }, 403);
  }

  await db.update(schema.guests)
    .set({ isAttending, dietaryRestrictions, accommodationNeeded, updatedAt: new Date() })
    .where(eq(schema.guests.id, guestId));

  return c.json({ success: true });
});

// Admin endpoint to view all
familiesRouter.get('/all', async (c) => {
  const user = c.get('user');
  const db = getDb(c.env.DATABASE_URL);

  const profileResult = await db.select().from(schema.profiles).where(eq(schema.profiles.id, user.id));
  if (profileResult[0]?.role !== 'ADMIN') {
    return c.json({ error: 'Unauthorized' }, 403);
  }

  const allGuests = await db.select().from(schema.guests);
  const allFamilies = await db.select().from(schema.families);
  
  return c.json({ guests: allGuests, families: allFamilies });
});

export default familiesRouter;
