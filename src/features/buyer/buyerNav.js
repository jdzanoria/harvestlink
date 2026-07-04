import { History, LayoutDashboard, ShoppingBag, Store } from 'lucide-react';

export const buyerNavItems = [
  { to: '/buyer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/marketplace', label: 'Marketplace', icon: Store },
  { to: '/buyer-requests', label: 'Requests', icon: History },
  { to: '/products/featured', label: 'Browse', icon: ShoppingBag },
];
