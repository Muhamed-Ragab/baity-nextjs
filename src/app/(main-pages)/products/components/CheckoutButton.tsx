'use client';

import type { RadioProps } from '@/components/heroui';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Radio,
  RadioGroup,
  Textarea,
  addToast,
  cn,
  useDisclosure,
} from '@/components/heroui';
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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

  // const handleBuyProduct = async () => {
  //   const { message, success } = await checkoutActionAsync(order);

  //   if (!success) {
  //     addToast({ title: message, color: 'danger' });
  //     return;
  //   }

  //   addToast({ title: message, color: 'success' });
  //   redirect('/checkout/success');
  // };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Checkout</ModalHeader>
              <ModalBody>
                <RadioGroup
                  description='Select payment method'
                  orientation='horizontal'
                  label='Payment Method'
                  defaultValue={'cash'}
                >
                  <CustomRadio description='' value='cash'>
                    Cash on Delivery
                  </CustomRadio>
                  <CustomRadio description='' value='visa'>
                    Pay Now
                  </CustomRadio>
                </RadioGroup>
                <NumberInput
                  label='quantity'
                  minValue={1}
                  maxValue={10}
                  isRequired
                  className='mb-4'
                />
                <Input
                  label='address'
                  placeholder='e.g., 123 Main St, Minya, Egypt'
                  isRequired
                  className='mb-4'
                />
                <Textarea label='Note' placeholder='Add your note' />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button color='primary' onPress={onClose}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Button
        color={chef?.online ? 'primary' : 'danger'}
        variant={chef?.online ? 'solid' : 'flat'}
        fullWidth
        onPress={onOpen}
        isDisabled={checkoutLoading || !chef?.online}
        isLoading={checkoutLoading}
      >
        {chef?.online ? t('buy-button') : t('buy-button-offline')}
      </Button>
    </>
  );
}

export const CustomRadio = (props: RadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          'inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between',
          'flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
          'data-[selected=true]:border-primary',
        ),
      }}
    >
      {children}
    </Radio>
  );
};
