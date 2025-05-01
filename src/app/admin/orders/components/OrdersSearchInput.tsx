import { Input } from '@/components/heroui';

interface OrdersSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function OrdersSearchInput({ value, onChange }: OrdersSearchInputProps) {
  return (
    <Input
      placeholder='Search by order ID, user or product...'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-80'
      aria-label='Search orders'
    />
  );
}
