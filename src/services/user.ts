'use server';

import { stripeClient } from '@/config/stripe';
import { db } from '@/db';
import { auth } from '@/lib/auth';
import type { User } from '@/types/user';
import { tryCatch } from '@/utils/tryCatch';
import { and } from 'drizzle-orm';
import { headers } from 'next/headers';

export const getAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session.user as User;
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
    },
    with: {
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
    where: (user, { eq }) => and(eq(user.role, 'chief'), eq(user.banned, false)),
  });

  const usersSortedByTotalAmount = users
    .map((user) => {
      const totalAmount = user.orders.reduce((acc, order) => acc + order.total, 0);
      return { ...user, totalAmount };
    })
    .sort((a, b) => b.totalAmount - a.totalAmount);

  return usersSortedByTotalAmount;
};

export const getChiefs = async (page = 1, limit = 12) => {
  const offset = (page - 1) * limit;

  const chiefs = await db.query.user.findMany({
    limit,
    offset,
    orderBy: (user, { desc }) => [desc(user.createdAt)],
    where: (user, { and, eq }) => and(eq(user.role, 'chief'), eq(user.banned, false)),
  });

  return {
    chiefs,
    totalPages: Math.ceil(chiefs.length / limit),
    currentPage: page,
  };
};

export const getChiefById = async (id: string) => {
  const chief = await db.query.user.findFirst({
    where: (user, { and, eq }) => and(eq(user.id, id), eq(user.role, 'chief')),
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

  if (!chief) {
    throw new Error('Chief not found');
  }

  const activeChiefProducts = chief.products.filter((product) => product.status === 'active');

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
    chief: { ...chief, products: activeChiefProducts },
    totalOrders,
    rating,
  };
};
