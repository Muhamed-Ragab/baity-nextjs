import { getNewArrival, getProducts } from '@/services/product';
import { getBestSellers } from '@/services/user';
import { AllProductsCard } from './components/Cards/AllProducts';
import { BestSellerCard } from './components/Cards/BestSeller';
import { NewArrivalCard } from './components/Cards/NewArrival';
import { CardsContainer } from './components/CardsContainer';
import { Hero } from './components/Hero';

const Home = async () => {
  const [bestSellers, newArrival, allProducts] = await Promise.all([
    getBestSellers(),
    getNewArrival({ limit: 10 }),
    getProducts({ limit: 10 }),
  ]);

  return (
    <main className='space-y-16 py-4'>
      <Hero />
      <CardsContainer
        title='Best Sellers'
        data={bestSellers}
        Item={BestSellerCard}
        viewAllLink='/chiefs'
      />
      <CardsContainer
        title='New Arrival'
        data={newArrival}
        Item={NewArrivalCard}
        viewAllLink='/products/new-arrival'
      />
      <CardsContainer
        title='All Products'
        data={allProducts}
        Item={AllProductsCard}
        viewAllLink='/products'
      />
    </main>
  );
};

export default Home;
