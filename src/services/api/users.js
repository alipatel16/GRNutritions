import databaseService from '../firebase/database';

const usersAPI = {
  // Create user profile
  createUserProfile: async (userId, userData) => {
    try {
      return await databaseService.update(`users/${userId}`, {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      return await databaseService.read(`users/${userId}`);
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    try {
      return await databaseService.update(`users/${userId}`, updates);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Get all users (Admin)
  getAllUsers: async () => {
    try {
      return await databaseService.query('users', {
        orderBy: { type: 'child', key: 'createdAt' }
      });
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  // Add address
  addAddress: async (userId, addressData) => {
    try {
      return await databaseService.create(`users/${userId}/addresses`, addressData);
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  },

  // Get user addresses
  getUserAddresses: async (userId) => {
    try {
      return await databaseService.read(`users/${userId}/addresses`);
    } catch (error) {
      console.error('Error getting addresses:', error);
      throw error;
    }
  },

  // Update address
  updateAddress: async (userId, addressId, updates) => {
    try {
      return await databaseService.update(`users/${userId}/addresses/${addressId}`, updates);
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  // Delete address
  deleteAddress: async (userId, addressId) => {
    try {
      return await databaseService.delete(`users/${userId}/addresses/${addressId}`);
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  // Set default address
  setDefaultAddress: async (userId, addressId) => {
    try {
      // First, get all addresses and unset default
      const result = await databaseService.read(`users/${userId}/addresses`);
      if (result.success && result.data) {
        const addresses = result.data;
        const updatePromises = Object.keys(addresses).map(id =>
          databaseService.update(`users/${userId}/addresses/${id}`, {
            isDefault: id === addressId
          })
        );
        await Promise.all(updatePromises);
      }
      return { success: true };
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async (userId) => {
    try {
      return await databaseService.query('orders', {
        orderBy: { type: 'child', key: 'userId' },
        equalTo: userId
      });
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  }
};

export default usersAPI;