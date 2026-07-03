export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('harvestlink_users') || '[]');
  } catch (err) {
    return [];
  }
}

export function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('harvestlink_users', JSON.stringify(users));
}

export function findUser(email, password) {
  const normalized = (email || '').toLowerCase();
  const users = getUsers();
  return users.find((u) => u.email === normalized && u.password === password);
}

export function userExists(email) {
  const normalized = (email || '').toLowerCase();
  return getUsers().some((u) => u.email === normalized);
}
