import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Context, Next } from 'hono';
import * as jose from 'jose';

export type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_JWT_SECRET: string;
  DATABASE_URL: string;
};

export type Variables = {
  supabase: SupabaseClient;
  user: { id: string };
};

export const authMiddleware = async (c: Context<{ Bindings: Bindings, Variables: Variables }>, next: Next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'Missing Authorization header' }, 401);
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return c.json({ error: 'Invalid Authorization header format' }, 401);
  }

  try {
    const secret = new TextEncoder().encode(c.env.SUPABASE_JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    if (!payload.sub) throw new Error('Missing sub claim');

    c.set('user', { id: payload.sub });

    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    c.set('supabase', supabase);
    await next();
  } catch (e: any) {
    return c.json({ error: 'Unauthorized', details: e.message }, 401);
  }
};
