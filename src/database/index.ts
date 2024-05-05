import { drizzle } from '@xata.io/drizzle';
import { eq } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
// Generated with CLI
import { getXataClient } from '../xata';

const xata = getXataClient();

const tableName = pgTable('tableName', {
  id: text('id').primaryKey(),
});

const db = drizzle(xata);

const record = await db
  .select()
  .from(tableName)
  .where(eq(tableName.id, 'rec_xyz'))
  .execute();
console.log(record);
