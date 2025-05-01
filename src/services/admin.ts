'use server';

import { db } from '@/db';
import { order, product } from '@/db/schema';
import type { Order } from '@/types/order';
import type { Product } from '@/types/product';
import { tryCatch } from '@/utils/tryCatch';
import { eq } from 'drizzle-orm';
import { getAuth } from './user';

export const getAdminOrders = async () => {
  const [authError, user] = await tryCatch(getAuth());

  if (authError || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const [err, orders] = await tryCatch(
    db.query.order.findMany({
      with: {
        user: true,
        product: true,
      },
      orderBy: (order, { desc }) => [desc(order.createdAt)],
    }),
  );

  if (err) {
    throw err;
  }

  return orders;
};

export const updateOrderStatusAction = async ({
  orderId,
  status,
}: { orderId: Order['id']; status: Order['status'] }) => {
  const [authError, user] = await tryCatch(getAuth());

  if (authError || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const [err, updatedOrder] = await tryCatch(
    db.update(order).set({ status }).where(eq(order.id, orderId)).returning(),
  );

  if (err) {
    throw err;
  }

  return updatedOrder;
};

export const getAdminProducts = async () => {
  const [authError, user] = await tryCatch(getAuth());

  if (authError || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const [err, products] = await tryCatch(
    db.query.product.findMany({
      orderBy: (product, { desc }) => [desc(product.createdAt)],
      with: {
        orders: true,
      },
    }),
  );

  if (err) throw err;

  return products;
};

export const updateProductStatusAction = async ({
  productId,
  status,
}: { productId: Product['id']; status: Product['status'] }) => {
  const [authError, user] = await tryCatch(getAuth());

  if (authError || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const [err, updatedProduct] = await tryCatch(
    db.update(product).set({ status }).where(eq(product.id, productId)).returning(),
  );

  if (err) throw err;

  return updatedProduct;
};
