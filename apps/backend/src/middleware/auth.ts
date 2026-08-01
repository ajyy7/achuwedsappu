import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import type { Context, Next } from 'hono';

export type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  DATABASE_URL: string;
};

export type Variables = {
  supabase: SupabaseClient;
  user: User;
};

export const authMiddleware = async (c: Context<{ Bindings: Bindings, Variables: Variables }>, next: Next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'Missing Authorization header' }, 401);
  }

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return c.json({ error: 'Unauthorized', details: error?.message }, 401);
  }

  c.set('user', user);
  c.set('supabase', supabase);
  await next();
};
