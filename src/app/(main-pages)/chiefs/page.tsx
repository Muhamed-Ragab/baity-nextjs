import { getChiefs } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import { notFound } from 'next/navigation';
import { ChiefCard } from './components/ChiefCard';
import { ChiefsPagination } from './components/ChiefsPagination';

export default async function ChiefsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: paramsPage } = await searchParams;

  const page = paramsPage ? Number.parseInt(paramsPage) : 1;
  const [error, data] = await tryCatch(getChiefs(page));

  if (error) {
    notFound();
  }

  if (!data || data.chiefs.length === 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <p className='text-center text-2xl text-muted-foreground'>No chiefs found</p>
      </div>
    );
  }

  const { chiefs, totalPages, currentPage } = data;

  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-center font-bold text-3xl'>Our Chiefs</h1>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {chiefs.map((chief) => (
          <ChiefCard key={chief.id} {...chief} />
        ))}
      </div>

      <ChiefsPagination totalPages={totalPages} currentPage={currentPage} />
    </main>
  );
}
