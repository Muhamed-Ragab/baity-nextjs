'use client';

import { cn } from '@/lib/utils';
import { getAuth, updateUser } from '@/services/user';
import { addToast, Button } from '@/components/heroui';
import { useRequest } from 'ahooks';
import Link from 'next/link';

export default function Header() {
  const { loading: authLoading, data: auth, refreshAsync } = useRequest(getAuth);
  const { loading: updateUserLoading, runAsync: updateUserAsync } = useRequest(updateUser, {
    manual: true,
    onSuccess: async () => await refreshAsync(),
    onError: () =>
      addToast({
        title: 'Error',
        description: 'Something went wrong',
        color: 'danger',
      }),
  });

  const handleUpdateUserStatus = async () => {
    await updateUserAsync({ online: !auth?.online });
  };

  return (
    <header className='bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <h1 className='font-bold text-2xl text-gray-900'>Baity chef Dashboard</h1>
          <div className='flex items-center'>
            <Button
              type='button'
              size='sm'
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1 font-medium text-sm',
                auth?.online ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
              )}
              onPress={handleUpdateUserStatus}
              isLoading={updateUserLoading || authLoading}
              isDisabled={updateUserLoading || authLoading}
            >
              <span
                className={cn(
                  'mr-1 h-2 w-2 rounded-full',
                  auth?.online ? 'bg-green-400' : 'bg-red-400',
                )}
              />
              {auth?.online ? 'Online' : 'Offline'}
            </Button>
            <Link href='/profile' className='ml-4 flex items-center'>
              <img
                className='h-8 w-8 rounded-full'
                src={auth?.image ?? '/default-avatar.png'}
                alt='chef'
                draggable='false'
              />
              <span className='ml-2 font-medium text-gray-700 text-sm'>
                {auth?.name ?? 'chef'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

