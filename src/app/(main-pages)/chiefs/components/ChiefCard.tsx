'use client';

import { Spotlight } from '@/app/(main-pages)/components/motion/spotlight';
import type { User } from '@/types/user';
import { Button, Card, CardBody, Image } from '@heroui/react';
import Link from 'next/link';
import { MdVerified } from 'react-icons/md';

export const ChiefCard = ({ id, name, image, emailVerified }: User) => {
  return (
    <div className='relative w-full overflow-hidden rounded-xl p-px duration-500'>
      <Spotlight className='from-blue-600 via-blue-500 to-blue-400 blur-2xl' size={250} />
      <Card className='group h-full border-none pt-1 pb-2' radius='md'>
        <CardBody className='flex h-full flex-col gap-4 p-2'>
          <figure className='relative h-full w-full overflow-hidden'>
            <Link href={`/users/${id}`}>
              <Image
                className='aspect-square size-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105'
                src={image ?? ''}
                alt={name}
                loading='lazy'
              />
            </Link>
            <figcaption className='px-1.5 pt-3'>
              <Link href={`/users/${id}`} className='flex items-center gap-1'>
                <h4 className='line-clamp-2 flex-1 font-semibold text-sm duration-250 hover:opacity-60 sm:text-base'>
                  {name}
                </h4>
                {emailVerified && <MdVerified className='text-blue-600' />}
              </Link>
            </figcaption>
          </figure>

          <Button
            className='mt-auto w-full bg-gradient-to-tr from-customBlue to-customLightBlue text-white shadow-sm'
            fullWidth
            as={Link}
            href={`/chiefs/${id}`}
          >
            View Profile
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};
