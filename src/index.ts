import { Hono } from 'hono'
import plantsRouter from './routes/plants.routes'
import { db } from './db/drizzle';
import { Variables } from './common/workers';

const app = new Hono<{
  Bindings: Env;
  Variables: Variables;
}>()
  
app.use(async (c, next) => {
  c.set("db", db(c.env.PLANT_TRACKER_DB));
  await next();
})

app.route('/api/v1/plants', plantsRouter)

export default app
