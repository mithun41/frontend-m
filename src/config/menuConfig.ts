import { Home, Users, Settings, FileText, Image, LayoutGrid, Package, ShoppingBag, BarChart2, Mail } from 'lucide-react';

export interface MenuItem {
  key: string;
  title: string;
  path: string;
  icon?: any;
  roles: string[];
  subMenu?: MenuItem[];
}

export const menuConfig: MenuItem[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    icon: Home,
    roles: ['admin', 'customer'], // both can see dashboard
    subMenu: []
  },
  {
    key: 'categories',
    title: 'Categories',
    path: '/categories',
    icon: LayoutGrid,
    roles: ['admin'], // only admin
    subMenu: []
  },
  {
    key: 'banners',
    title: 'Banners',
    path: '/banners',
    icon: Image,
    roles: ['admin'], // only admin
    subMenu: []
  },
  {
    key: 'instagram-images',
    title: 'Instagram Images',
    path: '/instagram-images',
    icon: Image,
    roles: ['admin'], // only admin
    subMenu: []
  },
  {
    key: 'products',
    title: 'Products',
    path: '/products',
    icon: Package,
    roles: ['admin'], // only admin
    subMenu: []
  },
  {
    key: 'orders',
    title: 'Orders',
    path: '/orders',
    icon: ShoppingBag,
    roles: ['admin', 'customer'], // admin and customer
    subMenu: []
  },
  {
    key: 'users',
    title: 'Users',
    path: '/users',
    icon: Users,
    roles: ['admin'], // only admin
    subMenu: []
  },
  {
    key: 'sales-report',
    title: 'Sales Report',
    path: '/sales-report',
    icon: BarChart2,
    roles: ['admin'], // only admin
    subMenu: []
  },
  {
    key: 'settings',
    title: 'Settings',
    path: '/settings',
    icon: Settings,
    roles: ['admin'], // only admin
    subMenu: []
  },

  {
    key: 'reviews',
    title: 'Reviews',
    path: '/reviews',
    icon: FileText,
    roles: ['admin'], // only admin
    subMenu: []
  },
  {
    key: 'contacts',
    title: 'Contacts',
    path: '/contacts',
    icon: Mail,
    roles: ['admin'], // only admin
    subMenu: []
  }
];

export default menuConfig;
