// ==================== inventory.js ====================
import databaseService from '../firebase/database';

const inventoryAPI = {
  // Get inventory
  getInventory: async (filters = {}) => {
    try {
      return await databaseService.query('products', {
        orderBy: { type: 'child', key: 'inventory' },
        ...filters
      });
    } catch (error) {
      console.error('Error getting inventory:', error);
      throw error;
    }
  },

  // Update inventory
  updateInventory: async (productId, quantity, reason, notes = '') => {
    try {
      // Create inventory transaction record
      const transaction = {
        productId,
        previousQuantity: 0, // Should be fetched from product
        newQuantity: quantity,
        reason,
        notes,
        createdAt: new Date().toISOString()
      };

      // Get current inventory
      const productResult = await databaseService.read(`products/${productId}`);
      if (productResult.success && productResult.data) {
        transaction.previousQuantity = productResult.data.inventory || 0;
      }

      // Update product inventory
      await databaseService.update(`products/${productId}`, {
        inventory: quantity
      });

      // Log transaction
      await databaseService.create('inventoryTransactions', transaction);

      return { success: true, data: transaction };
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  },

  // Get low stock items
  getLowStockItems: async (threshold = 10) => {
    try {
      const result = await databaseService.query('products', {
        orderBy: { type: 'child', key: 'inventory' },
        endAt: threshold
      });

      if (result.success) {
        return {
          success: true,
          data: result.data ? Object.values(result.data) : []
        };
      }
      return result;
    } catch (error) {
      console.error('Error getting low stock items:', error);
      throw error;
    }
  },

  // Get out of stock items
  getOutOfStockItems: async () => {
    try {
      return await databaseService.query('products', {
        orderBy: { type: 'child', key: 'inventory' },
        equalTo: 0
      });
    } catch (error) {
      console.error('Error getting out of stock items:', error);
      throw error;
    }
  },

  // Get inventory transactions
  getInventoryTransactions: async (productId = null) => {
    try {
      if (productId) {
        return await databaseService.query('inventoryTransactions', {
          orderBy: { type: 'child', key: 'productId' },
          equalTo: productId
        });
      }
      return await databaseService.query('inventoryTransactions', {
        orderBy: { type: 'child', key: 'createdAt' }
      });
    } catch (error) {
      console.error('Error getting inventory transactions:', error);
      throw error;
    }
  },

  // Bulk update inventory
  bulkUpdateInventory: async (updates) => {
    try {
      const updatePromises = updates.map(({ productId, quantity, reason, notes }) =>
        inventoryAPI.updateInventory(productId, quantity, reason, notes)
      );
      
      const results = await Promise.all(updatePromises);
      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('Error bulk updating inventory:', error);
      throw error;
    }
  }
};

export default inventoryAPI;