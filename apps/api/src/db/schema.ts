import { pgTable, uuid, text, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['ADMIN', 'GUEST']);

export const families = pgTable('families', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  passcode: text('passcode'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // References auth.users(id) from Supabase
  role: roleEnum('role').default('GUEST').notNull(),
  familyId: uuid('family_id').references(() => families.id),
  email: text('email'),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const guests = pgTable('guests', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').references(() => families.id).notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  isAttending: boolean('is_attending'),
  dietaryRestrictions: text('dietary_restrictions'),
  accommodationNeeded: boolean('accommodation_needed').default(false).notNull(),
  requiresTransportation: boolean('requires_transportation').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
