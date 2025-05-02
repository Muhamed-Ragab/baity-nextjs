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
import type { Product } from '@/types/product';
import { getCurrency } from '@/utils/price';

const columns = [
  { name: 'Product ID', uid: 'id' },
  { name: 'Name', uid: 'name' },
  { name: 'Price', uid: 'price' },
  { name: 'Status', uid: 'status' },
];

interface ProductsTableProps {
  products: Product[];
  statusOptions: { label: string; value: string }[];
  onStatusChange: (productId: Product['id'], newStatus: Product['status']) => void;
  loading: boolean;
}

export default function ProductsTable({
  products,
  statusOptions,
  onStatusChange,
  loading,
}: ProductsTableProps) {
  return (
    <Table aria-label='Products Table' isStriped className='rounded-xl shadow'>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent='No products found' items={products} isLoading={loading}>
        {(product) => (
          <TableRow key={product.id}>
            <TableCell>{product.id}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{getCurrency(product.price)}</TableCell>
            <TableCell>
              <Select
                placeholder='Select status'
                selectedKeys={new Set([product.status])}
                value={product.status}
                onChange={(e) => onStatusChange(product.id, e.target.value as Product['status'])}
                className='min-w-[120px]'
                aria-label='Product status'
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
