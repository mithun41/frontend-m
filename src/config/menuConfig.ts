import { Home, Users, Settings, FileText, Image, LayoutGrid, Package } from 'lucide-react';

export const menuConfig = [
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
    key: 'products',
    title: 'Products',
    path: '/products',
    icon: Package,
    roles: ['admin'], // only admin
    subMenu: []
  },
  {
    key: 'employees',
    title: 'Employees',
    path: '/employees',
    icon: Users,
    roles: ['admin'], // only admin can see
    subMenu: [
      { title: 'All Employees', path: '/employees/all', roles: ['admin'] },
      { title: 'Add Employee', path: '/employees/add', roles: ['admin'] }
    ]
  },
  {
    key: 'reports',
    title: 'Reports',
    path: '/reports',
    icon: FileText,
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
    key: 'ads',
    title: 'Banners',
    path: '/ads',
    icon: Image,
    roles: ['admin'], // only admin
    subMenu: []
  }
];

export default menuConfig;
