'use server';

import { db } from '@/db';
import { user } from '@/db/schema';
import { auth } from '@/lib/auth';
import type { NewUser } from '@/types/user';
import { tryCatch } from '@/utils/tryCatch';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export const getAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Unauthorized');
  }

  const dbUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, session.user.id),
  });

  if (!dbUser) {
    throw new Error('Unauthorized');
  }

  return dbUser;
};

export const updateUser = async (data: Partial<NewUser>) => {
  const auth = await getAuth();

  const [error] = await tryCatch(db.update(user).set(data).where(eq(user.id, auth.id)));

  if (error) {
    throw error;
  }

  return auth;
};

export const getUsers = async () => {
  const [authError, user] = await tryCatch(getAuth());

  if (authError || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const users = await db.query.user.findMany();

  return users;
};

export const getBestSellers = async (limit = 10) => {
  const users = await db.query.user.findMany({
    limit,
    columns: {
      id: true,
      name: true,
      emailVerified: true,
      image: true,
      stripeCustomerId: true,
      role: true,
      online: true,
    },
    with: {
      subscriptions: true,
      orders: {
        columns: {
          id: true,
          total: true,
          userId: true,
          status: true,
          createdAt: true,
        },
      },
    },
    where: (user, { and, eq }) => and(eq(user.role, 'chef'), eq(user.banned, false)),
  });

  const usersSortedByTotalAmount = users
    .map((user) => {
      const totalAmount = user.orders.reduce((acc, order) => acc + order.total, 0);
      return { ...user, totalAmount };
    })
    .sort((a, b) => b.totalAmount - a.totalAmount);

  const sortedBySubscriptionStatus = usersSortedByTotalAmount.sort((a, b) =>
    a.subscriptions?.status === b.subscriptions?.status
      ? 0
      : a.subscriptions?.status === 'active'
        ? -1
        : 1,
  );

  return sortedBySubscriptionStatus;
};

export const getChiefs = async (page = 1, limit = 12) => {
  const offset = (page - 1) * limit;

  const chefs = await db.query.user.findMany({
    limit,
    offset,
    orderBy: (user, { desc }) => [desc(user.createdAt)],
    where: (user, { and, eq }) => and(eq(user.role, 'chef'), eq(user.banned, false)),
  });

  return {
    chefs,
    totalPages: Math.ceil(chefs.length / limit),
    currentPage: page,
  };
};

export const getChiefById = async (id: string) => {
  const chef = await db.query.user.findFirst({
    where: (user, { and, eq }) => and(eq(user.id, id), eq(user.role, 'chef')),
    with: {
      products: {
        orderBy: (product, { desc }) => [desc(product.createdAt)],
        with: {
          user: true,
          orders: true,
          feedbacks: true,
        },
      },
    },
  });

  if (!chef) {
    throw new Error('chef not found');
  }

  const activeChiefProducts = chef.products.filter((product) => product.status === 'active');

  const paidOrders = activeChiefProducts.flatMap((product) =>
    product.orders.filter((order) => order.status === 'paid'),
  );

  const totalOrders = paidOrders.length;

  const rating =
    activeChiefProducts.reduce((acc, product) => {
      const productRating =
        product.feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) /
          product.feedbacks.length || 0;
      return acc + productRating;
    }, 0) / activeChiefProducts.length || 0;

  return {
    chef: { ...chef, products: activeChiefProducts },
    totalOrders,
    rating,
  };
};

export const getChiefByProductId = async (productId: string) => {
  const product = await db.query.product.findFirst({
    where: (product, { eq }) => eq(product.id, productId),
    with: {
      user: true,
    },
  });

  if (!product) {
    throw new Error('chef not found');
  }

  return product.user;
};

