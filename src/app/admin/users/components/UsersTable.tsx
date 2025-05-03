import {
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@/components/heroui';
import type { User } from '@/types/user';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onBanToggle: (userId: string, banned: boolean) => Promise<void>;
  onRoleChange: (userId: string, newRole: string) => Promise<void>;
}

const columns = [
  { name: 'User ID', uid: 'id' },
  { name: 'Name', uid: 'name' },
  { name: 'Email', uid: 'email' },
  { name: 'Status', uid: 'status' },
  { name: 'Actions', uid: 'actions' },
];

export default function UsersTable({ users, loading, onBanToggle, onRoleChange }: UsersTableProps) {
  return (
    <Table aria-label='Users Table' isStriped className='rounded-xl shadow'>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody emptyContent='No users found' items={users} isLoading={loading}>
        {(user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <RadioGroup defaultValue={user.banned ? '2' : '1'}>
                <div className='flex items-center gap-2'>
                  <Radio
                    value='1'
                    checked={!!user.banned}
                    onChange={async () => await onBanToggle(user.id, !user.banned)}
                  >
                    Active
                  </Radio>
                  <Radio
                    value='2'
                    checked={!user.banned}
                    onChange={async () => await onBanToggle(user.id, !user.banned)}
                  >
                    Inactive
                  </Radio>
                </div>
              </RadioGroup>
            </TableCell>
            <TableCell>
              <Select
                selectedKeys={new Set([user.role])}
                value={user.role}
                onChange={(e) => onRoleChange(user.id, e.target.value)}
                className='min-w-[120px]'
                aria-label='Change user role'
              >
                <SelectItem key='user'>User</SelectItem>
                <SelectItem key='admin'>Admin</SelectItem>
                <SelectItem key='chef'>chef</SelectItem>
                {/* Add more roles as needed */}
              </Select>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

