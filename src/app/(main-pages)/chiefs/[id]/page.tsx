import { Card } from '@/components/heroui';
import { CardBody } from '@/components/heroui';
import { Image } from '@/components/heroui';
import { getChiefById } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import { notFound } from 'next/navigation';
import { MdEmail, MdPhone, MdShoppingBag, MdVerified } from 'react-icons/md';
import { NewArrivalCard } from '../../(home)/components/Cards/NewArrival';

export default async function ChiefPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [error, data] = await tryCatch(getChiefById(id));

  if (error || !data) {
    notFound();
  }

  const { chief, rating, totalOrders } = data;

  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='grid gap-8 lg:grid-cols-[1fr_2fr]'>
        {/* Profile Section */}
        <div className='space-y-6'>
          <Card className='overflow-hidden'>
            <CardBody className='p-0'>
              <div className='relative h-48 bg-gradient-to-r from-customBlue to-customLightBlue'>
                <div className='-bottom-16 -translate-x-1/2 absolute left-1/2'>
                  <Image
                    src={chief.image ?? ''}
                    alt={chief.name}
                    className='h-32 w-32 rounded-full border-4 border-white object-cover'
                  />
                </div>
              </div>
              <div className='px-6 pt-20 pb-6 text-center'>
                <div className='mb-2 flex items-center justify-center gap-2'>
                  <h1 className='font-bold text-2xl'>{chief.name}</h1>
                  {chief.emailVerified && <MdVerified className='text-blue-500 text-xl' />}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className='space-y-4'>
              <h2 className='font-semibold text-xl'>Contact Information</h2>
              <div className='space-y-3'>
                <div className='flex items-center gap-3 text-muted-foreground'>
                  <MdEmail className='text-xl' />
                  <span>{chief.email}</span>
                </div>
                <div className='flex items-center gap-3 text-muted-foreground'>
                  <MdPhone className='text-xl' />
                  <span>{chief.phone}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className='space-y-4'>
              <h2 className='font-semibold text-xl'>Statistics</h2>
              <div className='grid grid-cols-3 items-center gap-4'>
                <div className='space-y-1 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-900'>
                  <MdShoppingBag className='mx-auto text-2xl text-blue-500' />
                  <p className='font-bold text-2xl'>{chief.products?.length ?? 0}</p>
                  <p className='text-muted-foreground text-sm'>Products</p>
                </div>
                <div className='space-y-1 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-900'>
                  <span className='mx-auto text-3xl text-blue-500'>★</span>
                  <p className='font-bold text-2xl'>{(rating ?? 0).toFixed(1) ?? 0}</p>
                  <p className='text-muted-foreground text-sm'>Rating</p>
                </div>
                <div className='space-y-1 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-900'>
                  <MdShoppingBag className='mx-auto text-2xl text-blue-500' />
                  <p className='font-bold text-2xl'>{totalOrders ?? 0}</p>
                  <p className='text-muted-foreground text-sm'>Total Orders</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Products Section */}
        <div className='space-y-6'>
          <h2 className='font-bold text-2xl'>Products</h2>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {chief.products?.map((product) => (
              <NewArrivalCard key={product.id} {...product} />
            ))}
            {chief.products?.length === 0 && (
              <p className='col-span-full text-center text-muted-foreground'>
                No products available
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
