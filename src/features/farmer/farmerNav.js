import { ClipboardList, LayoutDashboard, PackagePlus, Store } from 'lucide-react';

export const farmerNavItems = [
  { to: '/farmer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/farmer-products', label: 'Products', icon: Store },
  { to: '/farmer-requests', label: 'Requests', icon: ClipboardList },
  { to: '/marketplace', label: 'Marketplace', icon: PackagePlus },
];
