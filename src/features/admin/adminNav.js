import { BarChart3, FileText, LayoutDashboard, ShoppingBag, Users } from 'lucide-react';

export const adminNavItems = [
  { to: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin-users', label: 'Users', icon: Users },
  { to: '/admin-products', label: 'Products', icon: ShoppingBag },
  { to: '/admin-requests', label: 'Requests', icon: BarChart3 },
  { to: '/admin-reports', label: 'Reports', icon: FileText },
];
