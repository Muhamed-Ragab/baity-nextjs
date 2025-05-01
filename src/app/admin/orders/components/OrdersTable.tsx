'use client';

import {
  Button,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@/components/heroui';
import type { getAdminOrders } from '@/services/admin';
import type { Order } from '@/types/order';
import { getCurrency } from '@/utils/price';
import { startTransition } from 'react';

const columns = [
  { name: 'Order ID', uid: 'id' },
  { name: 'User', uid: 'user' },
  { name: 'Product', uid: 'product' },
  { name: 'Qty', uid: 'quantity' },
  { name: 'Total', uid: 'total' },
  { name: 'Status', uid: 'status' },
];

interface OrdersTableProps {
  orders: Awaited<ReturnType<typeof getAdminOrders>>;
  statusOptions: { label: string; value: string }[];
  onStatusChange: (orderId: Order['id'], newStatus: Order['status']) => void;
  loading: boolean;
}

export default function OrdersTable({
  orders,
  statusOptions,
  onStatusChange,
  loading,
}: OrdersTableProps) {
  return (
    <Table aria-label='Orders Table' isStriped className='rounded-xl shadow'>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent='No orders found' items={orders} isLoading={loading}>
        {(order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.user.name}</TableCell>
            <TableCell>{order.product.name}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>{getCurrency(order.total)}</TableCell>
            <TableCell>
              <Select
                placeholder='Select status'
                selectedKeys={new Set([order.status])}
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])}
                className='min-w-[120px]'
                aria-label='Order status'
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
