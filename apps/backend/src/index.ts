import { Hono } from 'hono';
import { cors } from 'hono/cors';
import familiesRouter from './routes/families';
import { Bindings, Variables } from './middleware/auth';

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

// Enable CORS for the Next.js frontend
app.use('/*', cors({
  origin: '*', // We can restrict this to the frontend URL in production
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.get('/', (c) => {
  return c.text('Wedding API is running!');
});

app.route('/api/families', familiesRouter);

app.onError((err, c) => {
  console.error(err);
  return c.json({
    error: err.message,
    stack: err.stack
  }, 500);
});

export default app;
