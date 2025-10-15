// Re-export all as a single object for convenience
import productsAPI from './products';
import ordersAPI from './orders';
import usersAPI from './users';
import categoriesAPI from './categories';
import reviewsAPI from './reviews';
import inventoryAPI from './inventory';

// ==================== index.js (API services index) ====================
export { default as productsAPI } from './products';
export { default as ordersAPI } from './orders';
export { default as usersAPI } from './users';
export { default as categoriesAPI } from './categories';
export { default as reviewsAPI } from './reviews';
export { default as inventoryAPI } from './inventory';


export default {
  products: productsAPI,
  orders: ordersAPI,
  users: usersAPI,
  categories: categoriesAPI,
  reviews: reviewsAPI,
  inventory: inventoryAPI
};