import { SignOut } from '@/components/shared/SignOut';
import { Button } from '@/components/ui/button';
import { getAuth } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from './components/Header';

export default async function ChefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authError, user] = await tryCatch(getAuth());

  if (authError || user.role !== 'chef') {
    redirect('/');
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='flex flex-1'>
        {/* chef Sidebar */}
        <aside className='w-64 bg-gray-800 p-4 text-white'>
          <div className='mb-8 font-bold text-xl'>Navigation</div>
          <nav className='space-y-2'>
            <Link href='/chef' className='block rounded px-4 py-2 hover:bg-gray-700'>
              Dashboard
            </Link>
            <Link href='/chef/orders' className='block rounded px-4 py-2 hover:bg-gray-700'>
              Orders
            </Link>
            <Link href='/chef/products' className='block rounded px-4 py-2 hover:bg-gray-700'>
              Products
            </Link>
            <SignOut />
          </nav>
        </aside>

        {/* Main Content */}
        <div className='flex-1 space-y-16 overflow-auto px-8 pb-8'>
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
}
