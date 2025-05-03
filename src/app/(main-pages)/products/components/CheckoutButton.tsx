'use client';

import { Button, addToast } from '@/components/heroui';
import { getChefByProductId } from '@/services/user';
import { useRequest } from 'ahooks';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { checkoutAction } from '../action';

interface BuyProductProps {
  order: {
    price: number;
    productId: string;
    quantity: number;
    address: string;
  };
}

export default function CheckoutButton({ order }: BuyProductProps) {
  const { data: chef } = useRequest(getChefByProductId, {
    refreshDeps: [order.productId],
    refreshOnWindowFocus: true,
    defaultParams: [order.productId],
    onSuccess: (data) => {
      if (!data.online) {
        addToast({ title: 'chef is Offline', color: 'danger' });
        return;
      }
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleBuyProduct = async () => {
    if (!chef?.online) {
      addToast({ title: 'chef is Offline', color: 'danger' });
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
      color={chef?.online ? 'primary' : 'danger'}
      variant={chef?.online ? 'solid' : 'flat'}
      fullWidth
      onPress={handleBuyProduct}
      isDisabled={isLoading || !chef?.online}
      isLoading={isLoading}
    >
      {chef?.online ? 'Buy Now' : 'chef is Offline'}
    </Button>
  );
}
