'use server';

import { env } from '@/config/env';
import { stripeClient } from '@/config/stripe';
import { db } from '@/db';
import { product } from '@/db/schemas/product';
import type { NewProduct, Product } from '@/types/product';
import { calculateTax } from '@/utils/calcTax';
import { tryCatch } from '@/utils/tryCatch';
import { and, eq } from 'drizzle-orm';
import { getAuth } from './user';

export const createCheckout = async (priceId: string, quantity = 1) => {
  const price = await stripeClient.prices.retrieve(priceId);

  const baseAmount = price?.unit_amount ?? 0;

  const taxAmount = calculateTax(baseAmount);

  const session = await stripeClient.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity,
      },
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: 'Tax (15%)',
          },
          unit_amount: taxAmount,
          tax_behavior: 'inclusive',
        },
        quantity,
      },
    ],
    mode: 'payment',
    success_url: `${env.BASE_URL}/checkout/success`,
    cancel_url: `${env.BASE_URL}/checkout/cancelled`,
    shipping_address_collection: {
      allowed_countries: ['EG'],
    },
    billing_address_collection: 'required',
    metadata: {
      quantity,
      tax_amount: taxAmount,
    },
    currency: 'egp',
  });

  return session;
};

export const createProduct = async (data: NewProduct) => {
  const [createProductError, createdProduct] = await tryCatch(
    db.insert(product).values(data).returning(),
  );

  if (createProductError) throw createProductError;

  return createdProduct[0];
};

export const createPrice = async (
  productId: string,
  unitAmount: number,
  currency = 'egp',
  metadata = {},
) => {
  const taxAmount = calculateTax(unitAmount);

  return await stripeClient.prices.create({
    product: productId,
    unit_amount: unitAmount,
    currency,
    metadata: { ...metadata, tax_amount: taxAmount },
  });
};

export const getDashboardProducts = async () => {
  const auth = await getAuth();

  if (auth.role !== 'admin') {
    return await db.query.product.findMany({
      where: eq(product.userId, auth.id),
      with: {
        user: true,
        orders: true,
        feedbacks: {
          with: { user: true },
        },
      },
    });
  }

  return await db.query.product.findMany({
    with: {
      user: true,
      orders: true,
      feedbacks: {
        with: { user: true },
      },
    },
  });
};

export const getProductsByUserId = async (userId: string) => {
  return await db.query.product.findMany({
    where: eq(product.userId, userId),
    with: {
      orders: true,
    },
  });
};

export const getProducts = async ({
  limit = 10,
  page = 1,
  status = 'all',
}: { limit?: number; page?: number; status?: Product['status'] | 'all' }) => {
  const dbProduct = await db.query.product.findMany({
    with: {
      orders: true,
      user: true,
    },
    orderBy: (product, { desc }) => [desc(product.createdAt)],
    ...(status !== 'all' && { where: eq(product.status, status) }),
  });

  const unbannedchiefProducts = dbProduct.filter(
    (product) => product.user.role === 'chief' && !product.user.banned,
  );

  const offset = (page - 1) * limit;
  const products = unbannedchiefProducts.slice(offset, offset + limit);

  return products;
};

export const getProductById = async (id: string) => {
  const [productError, result] = await tryCatch(
    db.query.product.findFirst({
      with: {
        user: true,
        orders: true,
        feedbacks: {
          with: { user: true },
        },
      },
      where: eq(product.id, id),
    }),
  );

  if (productError) throw productError;
  if (!result) throw new Error('Product not found');

  const paidOrders = result.orders.filter((order) => order.status === 'paid');

  return { ...result, orders: paidOrders };
};

export const getNewArrival = async (
  { limit, offset }: { limit?: number; offset?: number } = { limit: undefined, offset: 0 },
) => {
  const products = await db.query.product.findMany({
    limit,
    offset,
    with: {
      user: true,
    },
    orderBy: (order, { desc }) => desc(order.createdAt),
    where: (product, { and, gt }) =>
      and(
        gt(product.createdAt, new Date(new Date().setMonth(new Date().getMonth() - 1))),
        eq(product.status, 'active'),
      ),
  });

  const unbannedUsersProducts = products.filter((product) => !product.user.banned);

  return unbannedUsersProducts;
};

export const updateProductStatus = async (id: string, status: Product['status']) => {
  const auth = await getAuth();

  // Soft delete: set status to 'deleted'
  const [productError, result] = await tryCatch(
    db
      .update(product)
      .set({ status })
      .where(
        auth.role !== 'admin'
          ? and(eq(product.id, id), eq(product.userId, auth.id))
          : eq(product.id, id),
      )
      .returning(),
  );

  if (productError) throw productError;
  if (!result) throw new Error('Product not found');

  return result[0];
};

export const updateProductById = async (id: string, data: Partial<NewProduct>) => {
  const auth = await getAuth();
  const { name, description, price, images } = data;

  const [productError, result] = await tryCatch(
    db
      .update(product)
      .set({ name, description, price, images: images ?? [] })
      .where(
        auth.role !== 'admin'
          ? and(eq(product.id, id), eq(product.userId, auth.id))
          : eq(product.id, id),
      )
      .returning(),
  );

  if (productError) throw productError;
  if (!result) throw new Error('Product not found');

  return result[0];
};
