'use client';

import { Button, addToast } from '@/components/heroui';
import { useRequest } from 'ahooks';
import { MdVerified } from 'react-icons/md';
import { sendVerificationEmail } from '../action';

export const VerifyEmail = ({ emailVerified }: { emailVerified: boolean }) => {
  const { loading, run } = useRequest(sendVerificationEmail, {
    manual: true,
    onSuccess: () => {
      addToast({ title: 'Email sent successfully', color: 'success' });
    },
    onError: (error) => {
      addToast({ title: 'Error sending email', description: error.message, color: 'danger' });
    },
  });

  return (
    <Button
      type='button'
      fullWidth
      variant={emailVerified ? 'flat' : 'solid'}
      color={emailVerified ? 'success' : 'secondary'}
      onPress={run}
      isDisabled={emailVerified || loading}
      isLoading={loading}
    >
      {emailVerified ? (
        <>
          Email verified <MdVerified />
        </>
      ) : (
        'Verify email'
      )}
    </Button>
  );
};
