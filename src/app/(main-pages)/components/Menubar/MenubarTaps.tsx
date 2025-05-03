import { getAuth } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import { Divider } from '@heroui/react';
import Link from 'next/link';

export async function MenubarTaps() {
  const [authError] = await tryCatch(getAuth());

  return (
    <div className='flex h-6 items-center space-x-4 text-small'>
      <Link
        href='/'
        color='foreground'
        className='cursor-pointer font-semibold text-black uppercase'
      >
        Home
      </Link>
      <Divider orientation='vertical' />
      <Link
        href='/chefs'
        color='foreground'
        className='cursor-pointer font-semibold text-black uppercase'
      >
        chefs
      </Link>
      <Divider orientation='vertical' />
      <Link
        href='/products/new-arrival'
        className='cursor-pointer font-semibold text-black uppercase'
      >
        new arrival
      </Link>
      <Divider orientation='vertical' />
      <Link href='/products' className='cursor-pointer font-semibold text-black uppercase'>
        all products
      </Link>
      <Divider orientation='vertical' />
      {authError ? (
        <Link href='/auth/login' className='cursor-pointer font-semibold text-black uppercase'>
          login
        </Link>
      ) : (
        <Link href='/orders' className='cursor-pointer font-semibold text-black uppercase'>
          orders
        </Link>
      )}
    </div>
  );
}

