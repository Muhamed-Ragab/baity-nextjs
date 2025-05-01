import { createAuthClient } from 'better-auth/client';
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins';

import { env } from '@/config/env';

import type { auth } from '.';

export const authClient = createAuthClient({
  baseURL: env.BASE_URL || env.NEXT_PUBLIC_BASE_URL,
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});
