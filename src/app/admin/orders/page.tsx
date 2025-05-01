'use client';

import { Spinner, addToast } from '@/components/heroui';
import { getAdminOrders, updateOrderStatusAction } from '@/services/admin';
import type { Order } from '@/types/order';
import { tryCatch } from '@/utils/tryCatch';
import { useRequest } from 'ahooks';
import { useMemo, useState } from 'react';
import { startTransition } from 'react';
import OrdersPagination from './components/OrdersPagination';
import OrdersSearchInput from './components/OrdersSearchInput';
import OrdersTable from './components/OrdersTable';

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function AdminOrdersPage() {
  const { loading, data, refresh } = useRequest(getAdminOrders);
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const orders = data || [];

  const filteredOrders = useMemo(() => {
    if (!search) return orders;

    return orders.filter(
      (order) =>
        order.user.name.toLowerCase().includes(search.toLowerCase()) ||
        order.product.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [orders, search]);

  const rowsPerPage = 10;
  const pages = Math.ceil(filteredOrders.length / rowsPerPage);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [filteredOrders, page]);

  const handleStatusChange = async (orderId: Order['id'], newStatus: Order['status']) => {
    const [err] = await tryCatch(updateOrderStatusAction({ orderId, status: newStatus }));

    if (err) {
      addToast({ title: err.message || 'Failed to update', color: 'danger' });
      return;
    }

    startTransition(() => {
      refresh();
    });

    addToast({ title: 'Status updated', color: 'success' });
  };

  const onChangeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className='py-10 text-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-6xl'>
      <h1 className='mb-8 font-bold text-3xl'>Manage Orders</h1>
      <div className='mb-4 flex items-center gap-4'>
        <OrdersSearchInput value={search} onChange={onChangeSearch} />
      </div>
      <OrdersTable
        orders={paginatedOrders}
        statusOptions={statusOptions}
        onStatusChange={handleStatusChange}
        loading={loading}
      />
      <OrdersPagination page={page} total={pages} onChange={setPage} />
    </div>
  );
}
