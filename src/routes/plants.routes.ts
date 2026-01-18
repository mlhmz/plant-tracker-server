import { eq } from 'drizzle-orm/sql';
import { Hono } from 'hono';
import { ErrorCodes } from '../common/error-codes';
import { handleError } from '../common/error-handler';
import { Variables } from '../common/workers';
import { MutatePlant, plants } from '../db/schema/plant';

const plantsRouter = new Hono<{ Bindings: Env, Variables: Variables }>();

plantsRouter.get('/', async (c) => {
  try {
    const result = await c.var.db.select().from(plants);
    return c.json(result);
  } catch (error) {
    return handleError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500, error);
  }
});

plantsRouter.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await c.var.db.select().from(plants).where(eq(plants.id, id)).limit(1);
    if (result.length === 0) {
      return handleError(c, ErrorCodes.PLANT_NOT_FOUND, 404);
    }
    return c.json(result[0]);
  } catch (error) {
    return handleError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500, error);
  }
});

plantsRouter.post('/', async (c) => {
  try {
    const plant = await c.req.json<MutatePlant>();
    const results = await c.var.db.insert(plants).values(plant).returning();

    if (results.length === 0) {
        return handleError(c, ErrorCodes.PLANT_COULDNT_BE_CREATED, 500);
    }

    const result = results[0];

    console.log(JSON.stringify({
        event: 'db_transaction',
        message: `Created a new plant with the id ${result.id}`,
        table: 'plants',
        metadata: { result },
        timestamp: new Date().toISOString(),
    }));

    return c.json(result, 201);
  } catch (error) {
    return handleError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500, error);
  }
});

plantsRouter.put('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const plant = await c.req.json<MutatePlant>();
    const result = await c.var.db.update(plants).set(plant).where(eq(plants.id, id)).returning();
    
    if (result.length === 0) {
      return handleError(c, ErrorCodes.PLANT_NOT_FOUND, 404);
    }

    console.log(JSON.stringify({
      event: 'db_transaction',
      message: `Updated the plant with the id ${result[0].id}`,
      table: 'plants',
      metadata: { result },
      timestamp: new Date().toISOString(),
    }));

    return c.json(result[0]);
  } catch (error) {
    return handleError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500, error);
  }
});

plantsRouter.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();

    const result = await c.var.db.delete(plants).where(eq(plants.id, id)).returning();

    console.log(JSON.stringify({
      event: 'db_transaction_result',
      message: `Deleted plant with ID ${id}`,
      table: 'plants',
      metadata: { result },
      timestamp: new Date().toISOString(),
    }));

    if (result.length === 0) {
      return handleError(c, ErrorCodes.PLANT_NOT_FOUND, 404);
    }
    return c.status(204);
  } catch (error) {
    return handleError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500, error);
  }
});

export default plantsRouter;