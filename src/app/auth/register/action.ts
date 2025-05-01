'use server';

import { auth } from '@/lib/auth';
import { tryCatch } from '@/utils/tryCatch';
import { RegisterSchema } from '@/validations/auth';

export const registerAction = async (data: unknown) => {
  const result = RegisterSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      data: null,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const validatedData = result.data;

  const [error] = await tryCatch(
    auth.api.signUpEmail({
      body: validatedData,
    }),
  );

  if (error) {
    return {
      success: false,
      data: null,
      errors: {
        form: [error.message],
      },
    };
  }

  return {
    success: true,
    data: validatedData,
    errors: null,
  };
};
