'use server';

import { createOrder } from '@/services/order';
import { getAuth } from '@/services/user';
import { TAX_RATE, calculatePriceWithTax, calculateTax } from '@/utils/calcTax';
import { tryCatch } from '@/utils/tryCatch';
import { z } from 'zod';

const buyProductSchema = z.object({
  price: z.number(),
  productId: z.string(),
  quantity: z.number().positive().min(1).max(10).default(1),
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters long')
    .max(255, 'Address must be at most 255 characters long'),
});

export const checkoutAction = async (data: unknown) => {
  const [authError, auth] = await tryCatch(getAuth());

  if (authError) {
    return {
      success: false,
      message: authError.message,
    };
  }

  const result = buyProductSchema.safeParse(data);

  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0];

    return {
      success: false,
      message: firstError.join(', '),
    };
  }

  const { price, quantity, productId, address } = result.data;

  const [createOrderError] = await tryCatch(
    createOrder({
      productId,
      quantity,
      address,
      tax: calculateTax(price, TAX_RATE),
      total: calculatePriceWithTax(price, TAX_RATE),
      userId: auth.id,
    }),
  );

  if (createOrderError) {
    console.log(createOrderError);
    return {
      success: false,
      message: createOrderError.message,
    };
  }

  return {
    success: true,
    message: 'Checkout created',
  };
};
