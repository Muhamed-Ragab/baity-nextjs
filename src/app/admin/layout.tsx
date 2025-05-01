import { SignOut } from '@/components/shared/SignOut';
import { getAuth } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from './components/Header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authError, user] = await tryCatch(getAuth());

  if (authError || user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className='flex min-h-screen'>
      {/* Admin Sidebar */}
      <aside className='w-64 bg-gray-800 p-4 text-white'>
        <nav className='space-y-2'>
          <Link href='/admin' className='block rounded px-4 py-2 hover:bg-gray-700'>
            Dashboard
          </Link>
          <Link href='/admin/users' className='block rounded px-4 py-2 hover:bg-gray-700'>
            Users
          </Link>
          <Link href='/admin/orders' className='block rounded px-4 py-2 hover:bg-gray-700'>
            Orders
          </Link>
          <Link href='/admin/products' className='block rounded px-4 py-2 hover:bg-gray-700'>
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
  );
}
