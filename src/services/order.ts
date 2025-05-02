'use server';

import { db } from '@/db';
import { order, product } from '@/db/schema';
import type { NewOrder, Order } from '@/types/order';
import { and, eq } from 'drizzle-orm';
import { getAuth } from './user';
import { tryCatch } from '@/utils/tryCatch';

export const createOrder = async (orderData: NewOrder) => {
  const orders = await db.insert(order).values(orderData).returning();

  return orders[0];
};

export const getOrderById = async (id: string, isChief = false) => {
  const auth = await getAuth();

  const result = await db.query.order.findFirst({
    ...(auth.role !== 'admin' && {
      where: isChief ? eq(order.id, id) : and(eq(order.id, id), eq(order.userId, auth.id)),
    }),
    with: {
      user: true,
      product: {
        with: { user: true },
      },
    },
  });

  if (!result) return null;

  const isOwner = result.product.userId === auth.id;

  if (!isOwner && isChief) {
    return null;
  }

  return result;
};

export const getOrders = async (
  { page = 1, limit = 10, paid = false }: { page?: number; limit?: number; paid?: boolean } = {
    page: 1,
    limit: 10,
    paid: false,
  },
) => {
  const auth = await getAuth();

  const orders = await db.query.order.findMany({
    with: {
      user: true,
      product: {
        with: { user: true },
      },
    },
    where: eq(order.userId, auth.id),
  });

  const offset = (page - 1) * limit;
  const paginatedOrders = orders.slice(offset, offset + limit);

  if (paid) {
    return paginatedOrders.filter((order) => order.status === 'paid');
  }

  return paginatedOrders;
};

export const getDashboardOrders = async (
  { page = 1, limit = 10 }: { page?: number; limit?: number } = { page: 1, limit: 10 },
) => {
  const auth = await getAuth();

  const products = await db.query.product.findMany({
    with: {
      user: true,
      orders: {
        with: {
          user: true,
          product: true,
        },
      },
    },
    where: eq(product.userId, auth.id),
  });

  const orders = products.flatMap((product) => product.orders);

  const offset = (page - 1) * limit;
  const paginatedOrders = orders.slice(offset, offset + limit);

  return paginatedOrders;
};

export const getChiefOrders = async (
  { limit, offset }: { limit?: number; offset?: number } = { offset: 0 },
) => {
  const auth = await getAuth();

  const orders = await db.query.order.findMany({
    where: eq(order.userId, auth.id),
    limit,
    offset,
    with: {
      user: true,
      product: {
        with: { user: true },
      },
    },
  });

  const chiefOrders = orders.filter((order) => order.product.userId === auth.id);

  return {
    orders: chiefOrders,
    total: limit ? Math.ceil(chiefOrders.length / limit) : chiefOrders.length,
  };
};

export const getOrdersByProductId = async (productId: string) => {
  const orders = await db.query.order.findMany({
    where: (order, { eq }) => eq(order.productId, productId),
  });

  return orders;
};

export const updateOrder = async (id: string, orderData: Partial<Order>) => {
  const [getOrderError] = await tryCatch(getOrderById(id, true));

  if (getOrderError) throw getOrderError;

  const orders = await db
    .update(order)
    .set(orderData)
    .where(and(eq(order.id, id)))
    .returning();

  return orders[0];
};
