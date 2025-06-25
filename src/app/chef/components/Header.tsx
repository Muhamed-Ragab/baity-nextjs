'use client';

import { Button, addToast } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { cn } from '@/lib/utils';
import { getAuth, updateUser } from '@/services/user';
import { useRequest } from 'ahooks';
import Link from 'next/link';
import { setLocale } from '@/services/locale';
import { useLocale } from 'next-intl';
import { IoLanguageSharp } from 'react-icons/io5';

export default function Header() {
  const t = useTranslations('chefs-profile');
  const { loading: authLoading, data: auth, refreshAsync } = useRequest(getAuth);
  const { loading: updateUserLoading, runAsync: updateUserAsync } = useRequest(updateUser, {
    manual: true,
    onSuccess: async () => await refreshAsync(),
    onError: () =>
      addToast({
        title: t('messages.error'),
        description: t('messages.error-description'),
        color: 'danger',
      }),
  });

  const handleUpdateUserStatus = async () => {
    await updateUserAsync({ online: !auth?.online });
  };
  const locale = useLocale();

  return (
    <header className='bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <h1 className='font-bold text-2xl text-gray-900'>{t('title')}</h1>
          <div className='flex items-center gap-2'>
            <Button
              variant='faded'
              color='primary'
              size='md'
              onPress={async () => {
                // 'use server';
                await setLocale(locale === 'en' ? 'ar' : 'en');
              }}
            >
              <IoLanguageSharp size={19} />
              <p className='uppercase font-semibold'>{locale}</p>
            </Button>

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
              {auth?.online ? t('online') : t('offline')}
            </Button>

            <Button variant='light' as={Link} href='/contact'>
              {t('contact-us')}
            </Button>

            <Link href='/profile' className='ml-4 flex items-center'>
              <img
                className='h-8 w-8 rounded-full'
                src={auth?.image ?? '/default-avatar.png'}
                alt='chef'
                draggable='false'
              />
              <span className='ml-2 font-medium text-gray-700 text-sm'>{auth?.name ?? 'chef'}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
