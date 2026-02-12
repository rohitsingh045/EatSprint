export const ORDER_STATUS = {
  PENDING: 'Food Processing',
  COD_PENDING: 'COD - Pending',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

export const PAYMENT_METHODS = {
  COD: 'cod',
  ONLINE: 'online'
};

export const FOOD_CATEGORIES = [
  'All',
  'Salad',
  'Rolls',
  'Deserts',
  'Sandwich',
  'Cake',
  'Pure Veg',
  'Pasta',
  'Noodles'
];

export const API_ENDPOINTS = {
  LOGIN: '/api/user/login',
  REGISTER: '/api/user/register',
  ADD_TO_CART: '/api/cart/add',
  REMOVE_FROM_CART: '/api/cart/remove',
  GET_CART: '/api/cart/get',
  PLACE_ORDER: '/api/order/place',
  VERIFY_ORDER: '/api/order/verify',
  USER_ORDERS: '/api/order/user-orders',
  CANCEL_ORDER: '/api/order/cancel',
  FOOD_LIST: '/api/food/list'
};

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9]{10}$/,
  minPasswordLength: 6,
  minNameLength: 2
};

export const DELIVERY_FEE = 0;
