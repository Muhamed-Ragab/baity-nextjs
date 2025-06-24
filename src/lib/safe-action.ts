import { getAuth } from '@/services/user';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

export const actionClient = createSafeActionClient({
  defineMetadataSchema: () =>
    z.object({
      actionName: z.string(),
    }),
});

export const authActionClient = actionClient
  .use(async ({ next }) => {
    const auth = await getAuth();

    return next({ ctx: { auth } });
  })
  .metadata({ actionName: 'auth' });
