import { relations } from 'drizzle-orm';
import { user } from './auth';
import { feedback } from './feedback';
import { order } from './order';
import { product } from './product';

export const userRelations = relations(user, ({ many }) => ({
  products: many(product),
  orders: many(order),
  feedbacks: many(feedback),
}));

export const productRelations = relations(product, ({ many, one }) => ({
  orders: many(order),
  user: one(user, {
    fields: [product.userId],
    references: [user.id],
  }),
  feedbacks: many(feedback),
}));

export const orderRelations = relations(order, ({ one }) => ({
  product: one(product, {
    fields: [order.productId],
    references: [product.id],
  }),
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  product: one(product, {
    fields: [feedback.productId],
    references: [product.id],
  }),
  user: one(user, {
    fields: [feedback.userId],
    references: [user.id],
  }),
}));
