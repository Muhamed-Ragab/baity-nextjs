import { GoHeart } from 'react-icons/go';
import { IoHomeOutline } from 'react-icons/io5';
import { PiShoppingCartSimple } from 'react-icons/pi';
import { TbCategoryPlus } from 'react-icons/tb';
import { VscAccount } from 'react-icons/vsc';

export const items = [
  {
    Icon: IoHomeOutline,
    text: 'Home',
    path: '/',
  },
  {
    Icon: TbCategoryPlus,
    text: 'Categories',
    path: '/categories',
  },
  {
    Icon: GoHeart,
    text: 'Wishlist',
    path: '/wishlist',
  },
  {
    Icon: VscAccount,
    text: 'My Account',
    path: '/account',
  },
  {
    Icon: PiShoppingCartSimple,
    text: 'Cart',
    path: '/cart',
  },
];
