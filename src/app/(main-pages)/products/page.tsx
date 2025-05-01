import { getProducts } from '@/services/product';
import Pagination from './components/Pagination';
import ProductCard from './components/ProductCard';

export default async function ProductsPage({
  searchParams,
}: { searchParams?: Promise<{ page?: string }> }) {
  const searchParamsData = await searchParams;
  const page = Number.parseInt(searchParamsData?.page || '1') || 1;
  const limit = 10;
  const products = await getProducts({ limit, page, status: 'active' });
  const hasNextPage = products.length === limit;

  return (
    <main className='container py-8'>
      <h1 className='mb-8 text-center font-bold text-4xl'>All Products</h1>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className='mt-8 flex justify-center'>
        <Pagination page={page} total={hasNextPage ? page + 1 : page} />
      </div>
    </main>
  );
}
