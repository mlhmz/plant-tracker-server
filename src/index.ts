import { Hono } from 'hono'
import plantsRouter from './routes/plants.routes'

const app = new Hono<{ Bindings: Env }>()

app.route('/api/v1/plants', plantsRouter)

export default app
