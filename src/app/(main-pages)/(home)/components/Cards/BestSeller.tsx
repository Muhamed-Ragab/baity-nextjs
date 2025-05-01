'use client';

import { Spotlight } from '@/app/(main-pages)/components/motion/spotlight';
import type { getBestSellers } from '@/services/user';
import { Button, Card, CardBody, Image } from '@heroui/react';
import Link from 'next/link';
import { MdVerified } from 'react-icons/md';

type BestSellerProps = Awaited<ReturnType<typeof getBestSellers>>[number];

export const BestSellerCard = ({ id, image, name, emailVerified }: BestSellerProps) => {
  return (
    <div className='relative overflow-hidden rounded-xl p-px duration-500'>
      <Spotlight className='from-blue-600 via-blue-500 to-blue-400 blur-2xl' size={250} />
      <Card className='group border-none pt-1 pb-2' radius='md'>
        <CardBody className='flex aspect-[2/3] h-full flex-col gap-4 p-2'>
          <figure className='relative h-full w-full overflow-hidden'>
            <Link href={`/chiefs/${id}`}>
              <Image
                className='aspect-square size-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105'
                src={image ?? ''}
                alt={name}
                loading='lazy'
              />
            </Link>
            <figcaption className='px-1.5 pt-3'>
              <Link href={`/chiefs/${id}`} className='flex items-center gap-1'>
                <h4 className='line-clamp-2 flex-1 font-semibold text-sm duration-250 hover:opacity-60 sm:text-base'>
                  {name}
                </h4>
                {emailVerified && <MdVerified className='text-blue-600' />}
              </Link>
            </figcaption>
          </figure>

          <Button
            className='bg-gradient-to-tr from-customBlue to-customLightBlue text-white shadow-sm'
            fullWidth
            as={Link}
            href={`/chiefs/${id}`}
          >
            View
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};
