'use client';

import { Pagination } from '@heroui/react';
import { useRouter } from 'next/navigation';

interface ChiefsPaginationProps {
  totalPages: number;
  currentPage: number;
}

export const ChiefsPagination = ({ totalPages, currentPage }: ChiefsPaginationProps) => {
  const router = useRouter();

  return (
    <div className='mt-8 flex justify-center'>
      <Pagination
        total={totalPages}
        initialPage={currentPage}
        showControls
        onChange={(page) => {
          router.push(`?page=${page}`);
        }}
      />
    </div>
  );
};
