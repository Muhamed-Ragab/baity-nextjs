'use client';

import { Button, addToast } from '@/components/heroui';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { checkoutAction } from '../action';

interface BuyProductProps {
  product: {
    price: number;
    productId: string;
    quantity?: number;
  };
}

export default function CheckoutButton({ product }: BuyProductProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyProduct = async () => {
    setIsLoading(true);

    const { message, success } = await checkoutAction(product);

    setIsLoading(false);

    if (!success) {
      addToast({ title: message, color: 'danger' });
      return;
    }

    addToast({ title: message, color: 'success' });
    redirect('/checkout/success');
  };

  return (
    <Button
      color='primary'
      fullWidth
      onPress={handleBuyProduct}
      isDisabled={isLoading}
      isLoading={isLoading}
    >
      Checkout
    </Button>
  );
}
