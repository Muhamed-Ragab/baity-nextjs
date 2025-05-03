'use client';

import { CardPrice } from '@/app/(main-pages)/components/ProductCard/CardPrise';
import { Spotlight } from '@/app/(main-pages)/components/motion/spotlight';
import type { getNewArrival } from '@/services/product';
import { Button, Card, CardBody, Image } from '@heroui/react';
import Link from 'next/link';

type NewArrivalProps = Awaited<ReturnType<typeof getNewArrival>>[number];

export const NewArrivalCard = ({ id, name, price, images }: NewArrivalProps) => {
  return (
    <div className='relative overflow-hidden rounded-xl p-px duration-500'>
      <Spotlight className='from-blue-600 via-blue-500 to-blue-400 blur-2xl' size={250} />
      <Card className='group border-none pt-1 pb-2' radius='md'>
        <CardBody className='flex aspect-[2/3] h-full flex-col gap-4 p-2'>
          <figure className='relative size-full overflow-hidden'>
            <Link href={`/products/${id}`}>
              <Image
                className='aspect-square size-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105'
                src={images?.[0] ?? ''}
                alt={name}
                loading='lazy'
                width={200}
                height={200}
              />
            </Link>
            <figcaption className='px-1.5 pt-3'>
              <Link href='product-details'>
                <h4 className='line-clamp-3 font-semibold text-sm duration-250 hover:opacity-60'>
                  {name}
                </h4>
              </Link>
              <CardPrice total={price} />
            </figcaption>
          </figure>

          <Button
            className='bg-gradient-to-tr from-customBlue to-customLightBlue text-white shadow-sm'
            fullWidth
            as={Link}
            href={`/products/${id}`}
          >
            View
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};
