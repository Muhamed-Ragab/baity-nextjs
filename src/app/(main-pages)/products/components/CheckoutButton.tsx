'use client';

import { Button, addToast } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
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
  const t = useTranslations('products');
  const { data: chef } = useRequest(getChefByProductId, {
    refreshDeps: [order.productId],
    refreshOnWindowFocus: true,
    defaultParams: [order.productId],
    onSuccess: (data) => {
      if (!data.online) {
        addToast({ title: t('chef-offline-toast'), color: 'danger' });
        return;
      }
    },
  });
  const { loading: checkoutLoading, runAsync: checkoutActionAsync } = useRequest(checkoutAction, {
    manual: true,
    onSuccess: (data) => {
      if (!data.success) {
        addToast({ title: data.message, color: 'danger' });
      }
    },
  });

  const handleBuyProduct = async () => {
    const { message, success } = await checkoutActionAsync(order);

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
      isDisabled={checkoutLoading || !chef?.online}
      isLoading={checkoutLoading}
    >
      {chef?.online ? t('buy-button') : t('buy-button-offline')}
    </Button>
  );
}
