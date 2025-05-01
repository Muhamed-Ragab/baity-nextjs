'use client';

import type { getAdminOrders } from '@/services/admin';
import classnames from 'classnames';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface OrdersProps {
  orderData: { month: string; orders: number }[];
  orders: Awaited<ReturnType<typeof getAdminOrders>>;
}

const Orders: React.FC<OrdersProps> = ({ orderData, orders }) => {
  return (
    <div>
      <h2 className='mb-6 font-semibold text-gray-800 text-xl'>Orders</h2>

      <div className='mb-8 rounded-lg bg-white p-6 shadow-md'>
        <h3 className='mb-4 font-medium text-gray-900 text-lg'>Monthly Orders Trend</h3>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={orderData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='orders' fill='#3B82F6' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className='overflow-hidden rounded-lg bg-white shadow-md'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
              >
                Order ID
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
              >
                Date
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
              >
                Customer
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
              >
                Status
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className='whitespace-nowrap px-6 py-4'>
                  <div className='font-medium text-gray-900 text-sm'>#{order.id}</div>
                </td>
                <td className='whitespace-nowrap px-6 py-4'>
                  <div className='text-gray-500 text-sm'>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className='whitespace-nowrap px-6 py-4'>
                  <div className='text-gray-900 text-sm'>{order.user.name || 'N/A'}</div>
                </td>
                <td className='whitespace-nowrap px-6 py-4'>
                  <span
                    className={classnames(
                      'inline-flex rounded-full px-2 font-semibold text-xs leading-5',
                      {
                        'bg-green-100 text-green-800': order.status === 'paid',
                        'bg-yellow-100 text-yellow-800': order.status === 'pending',
                        'bg-gray-100 text-gray-800':
                          order.status !== 'paid' && order.status !== 'pending',
                      },
                    )}
                  >
                    {order.status}
                  </span>
                </td>
                <td className='whitespace-nowrap px-6 py-4 text-gray-500 text-sm'>
                  ${order.total?.toFixed(2) ?? '0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
