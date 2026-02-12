export const formatCurrency = (amount) => {
  return `₹${Number(amount).toFixed(2)}`;
};

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  return new Date(date).toLocaleDateString('en-US', defaultOptions);
};

export const getImageUrl = (image, baseUrl) => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  return `${baseUrl}/images/${image}`;
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const getOrderStatusColor = (status) => {
  const normalized = (status || '').toLowerCase();
  if (normalized.includes('delivered')) return 'success';
  if (normalized.includes('cancelled')) return 'error';
  if (normalized.includes('out for delivery')) return 'info';
  if (normalized.includes('confirmed')) return 'primary';
  return 'warning';
};

export const calculateItemTotal = (price, quantity) => {
  return Number(price) * Number(quantity);
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
