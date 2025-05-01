'use client';

import { Button, Card, CardBody, Divider, Image } from '@/components/heroui';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiPackage, FiUser } from 'react-icons/fi';

// Mock data for demonstration
const MOCK_ORDER = {
  id: '1',
  customer: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    address: '123 Main St, Anytown, USA',
    phone: '+1 (555) 123-4567',
  },
  product: {
    id: '101',
    name: 'Chocolate Cake',
    price: 29.99,
    image: '/images/product1.jpg',
  },
  quantity: 2,
  total: 59.98,
  status: 'completed',
  date: new Date('2023-11-15'),
  paymentMethod: 'Credit Card',
  deliveryMethod: 'Standard Shipping',
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  // In a real implementation, you would fetch the specific order details here
  const order = MOCK_ORDER;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className='container mx-auto px-4 py-8'>
      <Button
        variant='light'
        startContent={<FiArrowLeft />}
        onPress={() => router.back()}
        className='mb-6'
      >
        Back to Orders
      </Button>

      <div className='mb-8 flex flex-col items-start justify-between md:flex-row md:items-center'>
        <div>
          <h1 className='mb-2 font-bold text-3xl'>Order #{id}</h1>
          <p className='text-gray-500'>
            Placed on {order.date.toLocaleDateString()} at {order.date.toLocaleTimeString()}
          </p>
        </div>
        <span
          className={`mt-4 rounded-full px-4 py-2 text-sm md:mt-0 ${getStatusColor(order.status)}`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='md:col-span-2'>
          <Card className='mb-6'>
            <CardBody>
              <h2 className='mb-4 flex items-center font-semibold text-xl'>
                <FiPackage className='mr-2' /> Order Details
              </h2>

              <div className='flex flex-col overflow-hidden rounded-lg border sm:flex-row'>
                <div className='h-32 w-full sm:w-32'>
                  <Image
                    src={order.product.image}
                    alt={order.product.name}
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='flex-1 p-4'>
                  <h3 className='font-medium text-lg'>{order.product.name}</h3>
                  <p className='mb-2 text-gray-500'>Quantity: {order.quantity}</p>
                  <p className='font-medium'>${order.product.price.toFixed(2)} each</p>
                </div>
              </div>

              <Divider className='my-6' />

              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span>${(order.total * 0.9).toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Tax</span>
                  <span>${(order.total * 0.1).toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Shipping</span>
                  <span>Free</span>
                </div>
                <Divider className='my-2' />
                <div className='flex justify-between font-bold text-lg'>
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card className='mb-6'>
            <CardBody>
              <h2 className='mb-4 flex items-center font-semibold text-xl'>
                <FiUser className='mr-2' /> Customer Information
              </h2>

              <div className='space-y-4'>
                <div>
                  <h3 className='text-gray-500 text-sm'>Name</h3>
                  <p>{order.customer.name}</p>
                </div>
                <div>
                  <h3 className='text-gray-500 text-sm'>Email</h3>
                  <p>{order.customer.email}</p>
                </div>
                <div>
                  <h3 className='text-gray-500 text-sm'>Phone</h3>
                  <p>{order.customer.phone}</p>
                </div>
                <div>
                  <h3 className='text-gray-500 text-sm'>Shipping Address</h3>
                  <p>{order.customer.address}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
