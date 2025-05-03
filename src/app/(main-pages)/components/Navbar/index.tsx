import { Button } from '@/components/heroui';
import { getAuth } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import Link from 'next/link';
import { MdOutlineShoppingBag } from 'react-icons/md';
import MainPagesMobileSheet from './MainPagesMobileSheet';
import Image from 'next/image';

export const Navbar = async () => {
  const [authError, user] = await tryCatch(getAuth());

  return (
    <nav className='container flex items-center justify-between gap-8 pt-3'>
      <Link href='/' className='w-36'>
        <Image alt='baity logo' src='/logo.png' priority width={60} height={60} />
      </Link>

      <div className='flex items-center gap-4'>
        <div className='sm:hidden'>
          <MainPagesMobileSheet isLoggedIn={!authError} />
        </div>

        {authError || !user ? (
          <Link href='/auth/login' className='max-sm:hidden'>
            <Button
              variant='flat'
              className='bg-gradient-to-tr from-customBlue to-customLightBlue font-semibold text-white shadow-lg'
            >
              Login
            </Button>
          </Link>
        ) : (
          <>
            <Link href='/orders' className='max-sm:hidden'>
              <MdOutlineShoppingBag size={24} />
            </Link>
            <Link href='/profile' className='max-sm:hidden'>
              <Image
                src={user.image || '/default-avatar.png'}
                alt={user.name || 'User'}
                width={40}
                height={40}
                fetchPriority='high'
                className='h-10 max-h-10 min-h-10 w-10 min-w-10 max-w-10 rounded-full border-2 border-primary object-cover shadow'
              />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
