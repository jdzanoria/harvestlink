export const STORAGE_KEYS = {
  users: 'harvestlink_users',
  products: 'harvestlink_products',
  requests: 'harvestlink_purchase_requests',
  currentUser: 'harvestlink_current_user',
  legacyProducts: 'harvestlinkProducts',
};

export const ADMIN_CREDENTIALS = {
  email: 'admin@harvestlink.com',
  password: 'admin',
};

export const ADMIN_USER = {
  id: 'admin',
  name: 'HarvestLink Admin',
  email: ADMIN_CREDENTIALS.email,
  role: 'admin',
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const PRODUCT_CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Root Crops',
  'Herbs',
  'Other',
];

export const PRODUCT_UNITS = ['kg', 'sack', 'bundle', 'piece'];

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'online', label: 'Online payment' },
];

export const ROLE_DASHBOARDS = {
  farmer: '/farmer-dashboard',
  buyer: '/buyer-dashboard',
  admin: '/admin-dashboard',
};
