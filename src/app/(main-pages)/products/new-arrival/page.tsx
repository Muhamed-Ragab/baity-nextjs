import { getNewArrival } from '@/services/product';
import ProductCard from '../components/ProductCard';

export default async function NewArrivalsPage() {
  const products = await getNewArrival();

  return (
    <main className='container py-8'>
      <h1 className='mb-8 text-center font-bold text-4xl'>New Arrivals</h1>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
