import { STORAGE_KEYS } from '../utils/constants';
import { createId, readStorage, writeStorage } from './storageService';
import { getProductById, reduceProductQuantity } from './productService';

export function getRequests() {
  return readStorage(STORAGE_KEYS.requests, []);
}

export function saveRequests(requests) {
  return writeStorage(STORAGE_KEYS.requests, requests);
}

export function createPurchaseRequest(values, product, buyer) {
  const now = new Date().toISOString();
  const request = {
    id: createId('req'),
    productId: product.id,
    farmerId: product.farmerId,
    buyerId: buyer.id,
    buyerName: buyer.name,
    quantity: Number(values.quantity),
    message: values.message.trim(),
    paymentMethod: values.paymentMethod,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  saveRequests([request, ...getRequests()]);
  return request;
}

export function getRequestsByBuyer(buyerId) {
  return getRequests().filter((request) => request.buyerId === buyerId);
}

export function getRequestsByFarmer(farmerId) {
  return getRequests().filter((request) => request.farmerId === farmerId);
}

export function getRequestsForProduct(productId) {
  return getRequests().filter((request) => request.productId === productId);
}

export function updateRequestStatus(id, status) {
  const requests = getRequests();
  const target = requests.find((request) => request.id === id);
  if (!target) throw new Error('Purchase request was not found.');
  if (target.status !== 'pending') throw new Error('This request has already been reviewed.');

  if (status === 'confirmed') {
    const product = getProductById(target.productId);
    if (!product) throw new Error('Product was not found.');
    reduceProductQuantity(product.id, target.quantity);
  }

  const updatedRequests = requests.map((request) =>
    request.id === id ? { ...request, status, updatedAt: new Date().toISOString() } : request
  );
  saveRequests(updatedRequests);
  return updatedRequests.find((request) => request.id === id);
}
