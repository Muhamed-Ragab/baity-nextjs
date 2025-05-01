import { Input } from '@/components/heroui';

interface UsersSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function UsersSearchInput({ value, onChange }: UsersSearchInputProps) {
  return (
    <Input
      placeholder='Search by user name or email...'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-80'
      aria-label='Search users'
    />
  );
}
