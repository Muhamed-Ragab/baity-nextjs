'use client';

import { getAuth } from '@/services/user';
import { useRequest } from 'ahooks';
import Link from 'next/link';

export default function Header() {
  const { data: auth } = useRequest(getAuth);

  return (
    <header className='bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <h1 className='font-bold text-2xl text-gray-900'>Baity Chief Dashboard</h1>
          <div className='flex items-center'>
            <span className='inline-flex items-center rounded-full bg-green-100 px-3 py-1 font-medium text-green-800 text-sm'>
              <span className='mr-1 h-2 w-2 rounded-full bg-green-400' />
              Online
            </span>
            <Link href='/profile' className='ml-4 flex items-center'>
              <img
                className='h-8 w-8 rounded-full'
                src={auth?.image ?? '/default-avatar.png'}
                alt='Chief'
                draggable='false'
              />
              <span className='ml-2 font-medium text-gray-700 text-sm'>
                {auth?.name ?? 'Chief'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
