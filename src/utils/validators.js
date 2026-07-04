export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export function required(value) {
  return String(value ?? '').trim().length > 0;
}

export function toPositiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

export function validateAuthForm(values, mode) {
  const errors = {};
  if (mode === 'register' && !required(values.name)) errors.name = 'Enter your full name.';
  if (!required(values.email)) errors.email = 'Enter your email address.';
  else if (!isValidEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (!required(values.password)) errors.password = 'Enter your password.';
  if (mode === 'register' && !['farmer', 'buyer'].includes(values.role)) {
    errors.role = 'Choose an account type.';
  }
  return errors;
}

export function validateProductForm(values) {
  const errors = {};
  if (!required(values.name)) errors.name = 'Enter a product name.';
  if (!required(values.category)) errors.category = 'Choose a category.';
  if (toPositiveNumber(values.price) === null) errors.price = 'Enter a positive price.';
  if (!required(values.unit)) errors.unit = 'Choose a unit.';
  if (toPositiveNumber(values.quantity) === null) errors.quantity = 'Enter a positive quantity.';
  if (!required(values.location)) errors.location = 'Enter the product location.';
  if (!required(values.description)) errors.description = 'Add a short product description.';
  return errors;
}

export function validateRequestForm(values, product, currentUser) {
  const errors = {};
  const quantity = toPositiveNumber(values.quantity);

  if (quantity === null) errors.quantity = 'Enter a positive request quantity.';
  else if (product && quantity > Number(product.quantity)) {
    errors.quantity = `Only ${product.quantity} ${product.unit} available.`;
  }

  if (!required(values.paymentMethod)) errors.paymentMethod = 'Choose Cash or Online payment.';
  if (product && currentUser && product.farmerId === currentUser.id) {
    errors.form = 'You cannot request your own product.';
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
