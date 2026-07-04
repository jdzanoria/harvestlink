import { STORAGE_KEYS } from '../utils/constants';

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function readStorage(key, fallback = []) {
  return safeParse(localStorage.getItem(key), fallback);
}

export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function removeStorage(key) {
  localStorage.removeItem(key);
}

export function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function migrateLegacyProducts() {
  const existingProducts = readStorage(STORAGE_KEYS.products, []);
  const legacyProducts = readStorage(STORAGE_KEYS.legacyProducts, null);

  if (existingProducts.length || !Array.isArray(legacyProducts) || legacyProducts.length === 0) {
    return existingProducts;
  }

  const users = readStorage(STORAGE_KEYS.users, []);
  const migrated = legacyProducts.map((product) => {
    const owner = users.find((user) => user.email === product.ownerEmail);
    const farmerId = owner?.id || product.ownerEmail || createId('farmer');
    const farmerName = owner?.name || product.ownerName || product.ownerEmail || 'Local farmer';

    return {
      id: String(product.id || createId('prod')),
      farmerId,
      farmerName,
      name: product.name || 'Untitled produce',
      category: product.category || 'Other',
      price: Number(product.price) || 0,
      unit: String(product.unit || 'kg').replace(/ *\(.*\)/, '').toLowerCase(),
      quantity: Number(product.quantity) || 0,
      location: product.location || 'Cebu',
      description: product.description || 'Fresh local produce available from a Cebu farmer.',
      image: product.imageUrl || '',
      status: Number(product.quantity) > 0 ? 'active' : 'inactive',
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.createdAt || new Date().toISOString(),
    };
  });

  writeStorage(STORAGE_KEYS.products, migrated);
  return migrated;
}
