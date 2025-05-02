'use client';

import { Button, addToast } from '@/components/heroui';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { checkoutAction } from '../action';
import { useRequest } from 'ahooks';
import { getChiefByProductId } from '@/services/user';

interface BuyProductProps {
  order: {
    price: number;
    productId: string;
    quantity: number;
    address: string;
  };
}

export default function CheckoutButton({ order }: BuyProductProps) {
  const { data: chief } = useRequest(getChiefByProductId, {
    refreshDeps: [order.productId],
    refreshOnWindowFocus: true,
    defaultParams: [order.productId],
    onSuccess: (data) => {
      if (!data.online) {
        addToast({ title: 'Chief is Offline', color: 'danger' });
        return;
      }
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleBuyProduct = async () => {
    if (!chief?.online) {
      addToast({ title: 'Chief is Offline', color: 'danger' });
      return;
    }

    setIsLoading(true);

    const { message, success } = await checkoutAction(order);

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
      color={chief?.online ? 'primary' : 'danger'}
      variant={chief?.online ? 'solid' : 'flat'}
      fullWidth
      onPress={handleBuyProduct}
      isDisabled={isLoading || !chief?.online}
      isLoading={isLoading}
    >
      {chief?.online ? 'Buy Now' : 'Chief is Offline'}
    </Button>
  );
}
