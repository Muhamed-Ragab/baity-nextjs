'use client';

import { Button } from '@/components/heroui';
import { FcGoogle } from 'react-icons/fc';

import { loginWithGoogle } from '../action';

export const OAuth = () => {
  return (
    <div className='mb-2 flex flex-col items-center gap-4 md:mb-3'>
      <Button
        className='w-full border-small bg-white font-semibold'
        startContent={<FcGoogle className='text-2xl' />}
        size='lg'
        onPress={loginWithGoogle}
      >
        Login with Google
      </Button>
    </div>
  );
};
