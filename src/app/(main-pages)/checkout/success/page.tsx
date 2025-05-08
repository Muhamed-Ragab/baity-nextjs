import { getTranslations } from '@/lib/translates';
import Link from 'next/link';
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const CheckoutSuccess = async () => {
  const t = await getTranslations('checkout');
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <div className='w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg'>
        <div className='mb-8'>
          <FaCheckCircle className='mx-auto text-6xl text-green-500' />
        </div>
        <h1 className='mb-4 font-bold text-3xl text-gray-900'> {t('success.title')}</h1>
        <p className='mb-8 text-gray-600'>{t('success.description')}</p>
        <div className='space-y-4'>
          <Link
            href='/orders'
            className='block w-full rounded-md bg-green-500 px-4 py-3 text-white transition-colors hover:bg-green-600'
          >
            {t('success.view-orders-button')}
          </Link>
          <Link
            href='/'
            className='block w-full rounded-md bg-gray-100 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200'
          >
            {t('common.continue-shopping-button')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
