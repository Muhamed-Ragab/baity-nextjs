'use server';

import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/safe-action';
import { tryCatch } from '@/utils/tryCatch';
import { RegisterSchema } from '@/validations/auth';
import { returnValidationErrors } from 'next-safe-action';
import { redirect } from 'next/navigation';

export const registerAction = actionClient
  .inputSchema(RegisterSchema)
  .metadata({ actionName: 'register' })
  .action(async ({ clientInput }) => {
    const [error] = await tryCatch(
      auth.api.signUpEmail({
        body: clientInput,
      })
    );

    if (error) {
      return returnValidationErrors(RegisterSchema, {
        _errors: [error.message],
      });
    }

    redirect('/');
  });
