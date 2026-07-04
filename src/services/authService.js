import { ADMIN_CREDENTIALS, ADMIN_USER, STORAGE_KEYS } from '../utils/constants';
import { createId, readStorage, removeStorage, writeStorage } from './storageService';

export function getUsers() {
  return readStorage(STORAGE_KEYS.users, []);
}

export function getCurrentUser() {
  return readStorage(STORAGE_KEYS.currentUser, null);
}

export function setCurrentUser(user) {
  const sessionUser = { ...user };
  delete sessionUser.password;
  return writeStorage(STORAGE_KEYS.currentUser, sessionUser);
}

export function clearCurrentUser() {
  removeStorage(STORAGE_KEYS.currentUser);
}

export function registerUser(values) {
  const email = values.email.trim().toLowerCase();
  const users = getUsers();

  if (users.some((user) => user.email === email)) {
    throw new Error('An account with this email already exists.');
  }

  const user = {
    id: createId('user'),
    name: values.name.trim(),
    email,
    password: values.password,
    role: values.role,
    createdAt: new Date().toISOString(),
  };

  writeStorage(STORAGE_KEYS.users, [user, ...users]);
  return setCurrentUser(user);
}

export function loginUser(emailValue, password) {
  const email = emailValue.trim().toLowerCase();

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return setCurrentUser(ADMIN_USER);
  }

  const user = getUsers().find((candidate) => candidate.email === email && candidate.password === password);
  if (!user) throw new Error('Login failed. Check your email and password.');

  return setCurrentUser(user);
}
