import { Temporal } from "@js-temporal/polyfill";
import { v4 as uuidv4 } from "@lukeed/uuid";
import { text } from "drizzle-orm/sqlite-core/columns/text";

const now = () => Temporal.Now.instant().toString();

const timestampDefaultNow = (columnName: string) => text(columnName).$defaultFn(() => now());

export const timestamps = {
  updated_at: timestampDefaultNow('updated_at').notNull().$onUpdateFn(() => now()),
  created_at: timestampDefaultNow('created_at').notNull(),
  deleted_at: text('deleted_at'),
}

export const uuid = (columnName: string) => text(columnName).$defaultFn(() => uuidv4())


