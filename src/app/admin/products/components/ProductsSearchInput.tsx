import { Input } from '@/components/heroui';

interface ProductsSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProductsSearchInput({ value, onChange }: ProductsSearchInputProps) {
  return (
    <Input
      placeholder='Search by product ID or name...'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-80'
      aria-label='Search products'
    />
  );
}
