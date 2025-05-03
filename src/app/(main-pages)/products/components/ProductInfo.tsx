'use client';

import { Input, NumberInput } from '@/components/heroui';
import type { getProductById } from '@/services/product';
import { getCurrency } from '@/utils/price';
import Link from 'next/link';
import { useState } from 'react';
import CheckoutButton from './CheckoutButton';

type ProductInfoProps = Awaited<ReturnType<typeof getProductById>> & {
  totalOrders: number;
};

const ProductInfo: React.FC<ProductInfoProps> = ({
  id,
  name,
  price,
  description,
  user,
  totalOrders,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');

  return (
    <section className='flex flex-1 flex-col justify-between'>
      <section className='mb-8'>
        <h1 className='mb-2 font-bold text-3xl'>{name}</h1>
        <p className='mb-4 font-bold text-2xl text-primary'>{getCurrency(price)}</p>
        {description && <p className='mb-6 text-gray-600'>{description}</p>}
      </section>
      {user && (
        <section className='mb-8'>
          <h2 className='mb-2 font-semibold text-lg'>Seller</h2>
          <Link href={`/chefs/${user.id}`} className='font-semibold text-primary underline'>
            {user.name}
          </Link>
          <p className='text-gray-500 text-sm'>
            Email: <span className='font-semibold'>{user.email}</span>
          </p>
        </section>
      )}
      <section className='mb-8'>
        <h2 className='mb-2 font-semibold text-lg'>Sales Info</h2>
        <p className='text-gray-500 text-sm'>
          Total Orders: <span className='font-semibold'>{totalOrders}</span>
        </p>
      </section>

      <NumberInput
        label='Quantity'
        minValue={1}
        maxValue={10}
        value={quantity}
        onValueChange={setQuantity}
        isRequired
        className='mb-4'
      />
      <Input
        label='Address'
        placeholder='e.g., 123 Main St, Minya, Egypt'
        value={address}
        onValueChange={setAddress}
        isRequired
        className='mb-4'
      />
      <CheckoutButton order={{ price, productId: id, quantity, address }} />
    </section>
  );
};

export default ProductInfo;

