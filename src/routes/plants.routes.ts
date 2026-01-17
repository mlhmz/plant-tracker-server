import { Hono } from 'hono';
import { MutatePlant, plants } from '../db/schema/plant';
import { db } from '../db/drizzle';
import { eq } from 'drizzle-orm/sql';
import { ErrorCodes } from '../common/error-codes';
import { handleError } from '../common/error-handler';

const plantsRouter = new Hono<{ Bindings: Env }>();

plantsRouter.get('/', async (c) => {
  try {
    const result = await db(c.env).select().from(plants);
    return c.json(result);
  } catch (error) {
    return handleError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500);
  }
});

plantsRouter.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await db(c.env).select().from(plants).where(eq(plants.id, id)).limit(1);
    if (result.length === 0) {
      return handleError(c, ErrorCodes.PLANT_NOT_FOUND, 404);
    }
    return c.json(result[0]);
  } catch (error) {
    return handleError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500);
  }
});

plantsRouter.post('/', async (c) => {
  try {
    const plant = await c.req.json<MutatePlant>();
    const result = await db(c.env).insert(plants).values(plant).returning();
    return c.json(result, 201);
  } catch (error) {
    return handleError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500);
  }
});

plantsRouter.put('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const plant = await c.req.json<MutatePlant>();
    const result = await db(c.env).update(plants).set(plant).where(eq(plants.id, id)).returning();
    if (result.length === 0) {
      return handleError(c, ErrorCodes.PLANT_NOT_FOUND, 404);
    }
    return c.json(result[0]);
  } catch (error) {
    return handleError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500);
  }
});

plantsRouter.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await db(c.env).delete(plants).where(eq(plants.id, id)).returning();
    if (result.length === 0) {
      return handleError(c, ErrorCodes.PLANT_NOT_FOUND, 404);
    }
    return c.status(204);
  } catch (error) {
    return handleError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500);
  }
});

export default plantsRouter;