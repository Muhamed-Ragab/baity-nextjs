'use client';

import { Button, addToast } from '@/components/heroui';
import { authClient } from '@/lib/auth/client';
import { tryCatch } from '@/utils/tryCatch';
import { redirect } from 'next/navigation';
import { useState } from 'react';

export const SignOut = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signOut = async () => {
    setIsLoading(true);
    const [error] = await tryCatch(authClient.signOut());
    setIsLoading(false);

    if (error) {
      addToast({ title: 'Error signing out', color: 'danger' });
      return;
    }

    addToast({ title: 'Signed out successfully', color: 'success' });
    redirect('/');
  };

  return (
    <Button
      color='danger'
      variant='light'
      onPress={signOut}
      isLoading={isLoading}
      isDisabled={isLoading}
    >
      Sign Out
    </Button>
  );
};
