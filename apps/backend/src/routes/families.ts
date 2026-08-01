import { Hono } from 'hono';
import { authMiddleware, Bindings, Variables } from '../middleware/auth';
import { createClient } from '@supabase/supabase-js';

const familiesRouter = new Hono<{ Bindings: Bindings, Variables: Variables }>();

familiesRouter.use('/*', authMiddleware);

const getSupabase = (c: any) => {
  return createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${c.req.header('Authorization')?.split(' ')[1]}` } }
  });
};

familiesRouter.get('/my-family', async (c) => {
  const user = c.get('user');
  const supabase = getSupabase(c);

  let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  // Auto-create profile and family if they don't exist
  if (!profile) {
    const { data: newFamily } = await supabase.from('families').insert({
      name: user.email?.split('@')[0] || "My Family",
    }).select().single();

    const { data: newProfile } = await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      phone: user.phone,
      family_id: newFamily.id,
      role: 'GUEST',
    }).select().single();

    profile = newProfile;
  }

  const { data: family } = await supabase.from('families').select('*').eq('id', profile.family_id).single();
  const { data: familyGuests } = await supabase.from('guests').select('*').eq('family_id', profile.family_id);

  // Convert snake_case back to camelCase for the frontend
  const camelCaseGuests = (familyGuests || []).map(g => ({
    id: g.id,
    familyId: g.family_id,
    firstName: g.first_name,
    lastName: g.last_name,
    isAttending: g.is_attending,
    dietaryRestrictions: g.dietary_restrictions,
    accommodationNeeded: g.accommodation_needed
  }));

  return c.json({
    family,
    guests: camelCaseGuests,
  });
});

familiesRouter.post('/guests', async (c) => {
  const user = c.get('user');
  const supabase = getSupabase(c);
  
  const { firstName, lastName } = await c.req.json();

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile || !profile.family_id) return c.json({ error: 'Unauthorized' }, 403);

  const { data: newGuest, error } = await supabase.from('guests').insert({
    family_id: profile.family_id,
    first_name: firstName,
    last_name: lastName,
  }).select().single();

  if (error) return c.json({ error: error.message }, 500);

  const camelGuest = {
    id: newGuest.id,
    familyId: newGuest.family_id,
    firstName: newGuest.first_name,
    lastName: newGuest.last_name,
    isAttending: newGuest.is_attending,
  };

  return c.json({ success: true, guest: camelGuest });
});

familiesRouter.post('/rsvp', async (c) => {
  const user = c.get('user');
  const supabase = getSupabase(c);
  
  const body = await c.req.json();
  const { guestId, isAttending, dietaryRestrictions, accommodationNeeded } = body;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: guest } = await supabase.from('guests').select('*').eq('id', guestId).single();

  if (!guest || guest.family_id !== profile?.family_id) {
    return c.json({ error: 'Unauthorized' }, 403);
  }

  await supabase.from('guests').update({
    is_attending: isAttending,
    dietary_restrictions: dietaryRestrictions,
    accommodation_needed: accommodationNeeded,
  }).eq('id', guestId);

  return c.json({ success: true });
});

// Admin endpoint to view all
familiesRouter.get('/all', async (c) => {
  const user = c.get('user');
  const supabase = getSupabase(c);

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (profile?.role !== 'ADMIN') {
    return c.json({ error: 'Unauthorized' }, 403);
  }

  const { data: allGuests } = await supabase.from('guests').select('*');
  const { data: allFamilies } = await supabase.from('families').select('*');
  
  return c.json({ guests: allGuests, families: allFamilies });
});

export default familiesRouter;
