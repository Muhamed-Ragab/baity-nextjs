'use client';

import {
  addToast,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@/components/heroui';
import { getDashboardOrders, updateOrder } from '@/services/order';
import type { Order } from '@/types/order';
import { getCurrency } from '@/utils/price';
import { useRequest } from 'ahooks';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiCheck, FiEye, FiFilter, FiX } from 'react-icons/fi';

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'approved':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ChiefOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  const { page: pageParam = '1' } = useParams() as { page: string };
  const page = Number.parseInt(pageParam, 10);

  const limit = 10;
  const { loading, data: orders = [] } = useRequest(() => getDashboardOrders({ page, limit }));
  const { loading: updateLoading, run: runUpdateOrder } = useRequest(updateOrder);
  const hasNextPage = orders.length === limit;

  const handleApproveOrder = (orderId: string) => {
    runUpdateOrder(orderId, { status: 'approved' });
    addToast({
      title: 'Order approved',
      description: 'The order has been approved',
      status: 'success',
    });
  };

  const handleCancelOrder = (orderId: string) => {
    runUpdateOrder(orderId, { status: 'cancelled' });
    addToast({
      title: 'Order cancelled',
      description: 'The order has been cancelled',
      status: 'danger',
    });
  };

  if (loading) {
    return (
      <div className='flex justify-center py-12'>
        <Spinner size='lg' />
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (
      searchQuery &&
      !order.product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 font-bold text-3xl'>My Orders</h1>

      <Card className='mb-8'>
        <CardBody className='p-4'>
          <div className='flex flex-col items-center gap-4 sm:flex-row'>
            <Input
              placeholder='Search by product or customer...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<span className='text-gray-400'>🔍</span>}
              className='flex-1'
            />

            <Dropdown>
              <DropdownTrigger>
                <Button variant='flat' startContent={<FiFilter />}>
                  {statusFilter === 'all'
                    ? 'All Status'
                    : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Status filter'
                onAction={(key) => setStatusFilter(key as string)}
              >
                <DropdownItem key='all'>All Status</DropdownItem>
                <DropdownItem key='approved'>Approved</DropdownItem>
                <DropdownItem key='paid'>Paid</DropdownItem>
                <DropdownItem key='pending'>Pending</DropdownItem>
                <DropdownItem key='cancelled'>Cancelled</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <div className='flex justify-center py-12'>
          <Spinner size='lg' />
        </div>
      ) : (
        <>
          {filteredOrders.length === 0 ? (
            <div className='py-12 text-center'>
              <p className='text-gray-500'>No orders found</p>
            </div>
          ) : (
            <Card>
              <CardBody>
                <Table aria-label='Orders table'>
                  <TableHeader>
                    <TableColumn>ORDER ID</TableColumn>
                    <TableColumn>CUSTOMER</TableColumn>
                    <TableColumn>PRODUCT</TableColumn>
                    <TableColumn>QUANTITY</TableColumn>
                    <TableColumn>TOTAL</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>DATE</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell>{order.user.name}</TableCell>
                        <TableCell>{order.product.name}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{getCurrency(order.total)}</TableCell>
                        <TableCell>
                          <span
                            className={`rounded-full px-2 py-1 text-xs capitalize ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className='flex gap-2'>
                            <Button
                              as={Link}
                              href={`/chief/orders/${order.id}`}
                              isIconOnly
                              variant='light'
                              aria-label='View order details'
                            >
                              <FiEye />
                            </Button>
                            {order.status === 'pending' && (
                              <>
                                <Button
                                  isIconOnly
                                  color='success'
                                  variant='flat'
                                  aria-label='Approve order'
                                  onPress={() => handleApproveOrder(order.id)}
                                  isDisabled={updateLoading}
                                  isLoading={updateLoading}
                                >
                                  <FiCheck />
                                </Button>
                                <Button
                                  isIconOnly
                                  color='danger'
                                  variant='flat'
                                  aria-label='Cancel order'
                                  onPress={() => handleCancelOrder(order.id)}
                                  isDisabled={updateLoading}
                                  isLoading={updateLoading}
                                >
                                  <FiX />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className='mt-6 flex justify-center'>
                  <Pagination
                    total={hasNextPage ? page + 1 : page}
                    initialPage={page}
                    onChange={(page) => {
                      router.push(`?page=${page}`);
                    }}
                    showControls
                  />
                </div>
              </CardBody>
            </Card>
          )}
        </>
      )}
    </main>
  );
}
