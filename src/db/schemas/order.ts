import { randomUUID } from 'node:crypto';
import { TAX_RATE } from '@/utils/calcTax';
import { doublePrecision, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { product } from './product';

export const order = pgTable('order', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  productId: uuid('product_id')
    .notNull()
    .references(() => product.id),
  quantity: integer('quantity').notNull().default(1),
  total: doublePrecision('total').notNull(),
  tax: doublePrecision('tax').default(TAX_RATE).notNull(),
  status: text('status', { enum: ['pending', 'paid', 'cancelled', 'shipped'] })
    .notNull()
    .default('pending'), // e.g., pending, paid, cancelled, shipped
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
