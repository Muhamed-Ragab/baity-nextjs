'use server';

import { z } from 'zod';

import { auth } from '@/lib/auth';
import { tryCatch } from '@/utils/tryCatch';

const ResetPasswordSchema = z
  .object({
    token: z.string({
      message: 'Token is required',
    }),
    password: z
      .string({
        message: 'Password is required',
      })
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z
      .string({
        message: 'Password is required',
      })
      .min(6, { message: 'Password must be at least 6 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const resetPasswordAction = async (data: unknown) => {
  const { success, data: validatedData, error } = ResetPasswordSchema.safeParse(data);

  if (!success) {
    return {
      success: false,
      data,
      error: error.flatten().fieldErrors,
    };
  }

  const [forgetPasswordError, forgetPasswordData] = await tryCatch(
    auth.api.resetPassword({
      body: {
        token: validatedData.token,
        newPassword: validatedData.password,
      },
    }),
  );

  if (forgetPasswordError) {
    return {
      success: false,
      data: null,
      error: {
        form: [forgetPasswordError.message],
      },
    };
  }

  return {
    success: true,
    data: forgetPasswordData,
    error: null,
  };
};
