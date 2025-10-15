// ==================== useInventory.js ====================
import { useState, useCallback } from 'react';
import databaseService from '../services/firebase/database';
import toast from '../services/notification/toast';

export const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load inventory
  const loadInventory = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await databaseService.getInventory(filters);
      
      if (result.success) {
        setInventory(result.data || []);
      } else {
        setError('Failed to load inventory');
      }
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update inventory
  const updateInventory = useCallback(async (productId, quantity, reason, notes) => {
    try {
      setLoading(true);
      const result = await databaseService.updateInventory(productId, quantity, reason, notes);
      
      if (result.success) {
        toast.success('Inventory updated');
        loadInventory(); // Reload inventory
        return { success: true };
      } else {
        toast.error('Failed to update inventory');
        return { success: false };
      }
    } catch (err) {
      console.error('Error updating inventory:', err);
      toast.error('Failed to update inventory');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loadInventory]);

  // Check low stock items
  const getLowStockItems = useCallback(async (threshold = 10) => {
    try {
      const result = await databaseService.getLowStockItems(threshold);
      return result.data || [];
    } catch (err) {
      console.error('Error getting low stock items:', err);
      return [];
    }
  }, []);

  return {
    inventory,
    loading,
    error,
    loadInventory,
    updateInventory,
    getLowStockItems
  };
};
