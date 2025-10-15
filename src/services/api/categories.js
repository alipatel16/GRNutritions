// ==================== categories.js ====================
import databaseService from '../firebase/database';

const categoriesAPI = {
  // Get all categories
  getAllCategories: async () => {
    try {
      return await databaseService.query('categories', {
        orderBy: { type: 'child', key: 'displayOrder' }
      });
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (categoryId) => {
    try {
      return await databaseService.read(`categories/${categoryId}`);
    } catch (error) {
      console.error('Error getting category:', error);
      throw error;
    }
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    try {
      return await databaseService.query('categories', {
        orderBy: { type: 'child', key: 'slug' },
        equalTo: slug
      });
    } catch (error) {
      console.error('Error getting category by slug:', error);
      throw error;
    }
  },

  // Add category (Admin)
  addCategory: async (categoryData) => {
    try {
      return await databaseService.create('categories', categoryData);
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  // Update category (Admin)
  updateCategory: async (categoryId, updates) => {
    try {
      return await databaseService.update(`categories/${categoryId}`, updates);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category (Admin)
  deleteCategory: async (categoryId) => {
    try {
      return await databaseService.delete(`categories/${categoryId}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Get products in category
  getCategoryProducts: async (categoryId, limit = 20) => {
    try {
      return await databaseService.query('products', {
        orderBy: { type: 'child', key: 'category' },
        equalTo: categoryId,
        limitToFirst: limit
      });
    } catch (error) {
      console.error('Error getting category products:', error);
      throw error;
    }
  }
};

export default categoriesAPI;