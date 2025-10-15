// ==================== products.js ====================
import databaseService from '../firebase/database';

const productsAPI = {
  // Get all products
  getAllProducts: async (filters = {}) => {
    try {
      return await databaseService.getProducts(filters);
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      return await databaseService.getProductById(productId);
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId, limit = 20) => {
    try {
      return await databaseService.getProductsByCategory(categoryId, limit);
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (searchTerm) => {
    try {
      return await databaseService.searchProducts(searchTerm);
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    try {
      return await databaseService.query('products', {
        orderBy: { type: 'child', key: 'featured' },
        equalTo: true,
        limitToFirst: limit
      });
    } catch (error) {
      console.error('Error getting featured products:', error);
      throw error;
    }
  },

  // Get new arrivals
  getNewArrivals: async (limit = 8) => {
    try {
      return await databaseService.query('products', {
        orderBy: { type: 'child', key: 'createdAt' },
        limitToLast: limit
      });
    } catch (error) {
      console.error('Error getting new arrivals:', error);
      throw error;
    }
  },

  // Get best sellers
  getBestSellers: async (limit = 8) => {
    try {
      return await databaseService.query('products', {
        orderBy: { type: 'child', key: 'salesCount' },
        limitToLast: limit
      });
    } catch (error) {
      console.error('Error getting best sellers:', error);
      throw error;
    }
  },

  // Add product (Admin)
  addProduct: async (productData) => {
    try {
      return await databaseService.create('products', productData);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update product (Admin)
  updateProduct: async (productId, updates) => {
    try {
      return await databaseService.update(`products/${productId}`, updates);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product (Admin)
  deleteProduct: async (productId) => {
    try {
      return await databaseService.delete(`products/${productId}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Update product inventory
  updateInventory: async (productId, quantity) => {
    try {
      return await databaseService.update(`products/${productId}`, {
        inventory: quantity
      });
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  }
};

export default productsAPI;