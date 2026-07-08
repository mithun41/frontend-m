import { Home, Users, Settings, FileText, Image } from 'lucide-react';

export const menuConfig = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    icon: Home,
    roles: ['Admin', 'HR', 'Employee'],
    subMenu: []
  },
  {
    key: 'employees',
    title: 'Employees',
    path: '/employees',
    icon: Users,
    roles: ['Admin', 'HR'],
    subMenu: [
      { title: 'All Employees', path: '/employees/all', roles: ['Admin', 'HR'] },
      { title: 'Add Employee', path: '/employees/add', roles: ['Admin', 'HR'] }
    ]
  },
  {
    key: 'reports',
    title: 'Reports',
    path: '/reports',
    icon: FileText,
    roles: ['Admin', 'HR'],
    subMenu: []
  },
  {
    key: 'settings',
    title: 'Settings',
    path: '/settings',
    icon: Settings,
    roles: ['Admin'],
    subMenu: []
  },
  {
    key: 'ads',
    title: 'Banners',
    path: '/ads',
    icon: Image,
    roles: ['Admin', 'HR'],
    subMenu: []
  }
];

export default menuConfig;
