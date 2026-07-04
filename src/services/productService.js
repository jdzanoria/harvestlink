import { STORAGE_KEYS } from '../utils/constants';
import { createId, migrateLegacyProducts, readStorage, writeStorage } from './storageService';

export function getProducts() {
  migrateLegacyProducts();
  return readStorage(STORAGE_KEYS.products, []);
}

export function saveProducts(products) {
  return writeStorage(STORAGE_KEYS.products, products);
}

export function getProductById(id) {
  return getProducts().find((product) => product.id === id) || null;
}

export function getActiveProducts() {
  return getProducts().filter((product) => product.status === 'active' && Number(product.quantity) > 0);
}

export function getProductsByFarmer(farmerId) {
  return getProducts().filter((product) => product.farmerId === farmerId);
}

export function createProduct(values, farmer) {
  const now = new Date().toISOString();
  const product = {
    id: createId('prod'),
    farmerId: farmer.id,
    farmerName: farmer.name,
    name: values.name.trim(),
    category: values.category,
    price: Number(values.price),
    unit: values.unit,
    quantity: Number(values.quantity),
    location: values.location.trim(),
    description: values.description.trim(),
    image: values.image || '',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };

  saveProducts([product, ...getProducts()]);
  return product;
}

export function updateProduct(id, values) {
  const products = getProducts();
  const updatedProducts = products.map((product) => {
    if (product.id !== id) return product;
    const quantity = Number(values.quantity);
    return {
      ...product,
      ...values,
      price: Number(values.price),
      quantity,
      status: values.status || (quantity > 0 ? product.status : 'inactive'),
      updatedAt: new Date().toISOString(),
    };
  });

  saveProducts(updatedProducts);
  return updatedProducts.find((product) => product.id === id) || null;
}

export function deleteProduct(id) {
  saveProducts(getProducts().filter((product) => product.id !== id));
}

export function setProductStatus(id, status) {
  return updateProduct(id, { ...getProductById(id), status });
}

export function reduceProductQuantity(id, quantity) {
  const product = getProductById(id);
  if (!product) throw new Error('Product was not found.');

  const nextQuantity = Number(product.quantity) - Number(quantity);
  if (nextQuantity < 0) throw new Error('Requested quantity exceeds available stock.');

  return updateProduct(id, {
    ...product,
    quantity: nextQuantity,
    status: nextQuantity > 0 ? product.status : 'inactive',
  });
}
