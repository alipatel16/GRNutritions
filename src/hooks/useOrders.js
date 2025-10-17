// ==================== useOrders.js ====================
import { useState, useEffect, useCallback } from 'react';
import databaseService from '../services/firebase/database';
import { useAuth } from '../context/AuthContext/AuthContext';
import toast from '../services/notification/toast';

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user orders
  const loadOrders = useCallback(async (filters = {}) => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      setError(null);
      
      // Ensure filters has proper structure
      const queryFilters = {
        limit: 50, // Default limit
        ...filters
      };
      
      const result = await databaseService.getUserOrders(user.uid, queryFilters);
      
      if (result.success) {
        setOrders(result.data || []);
      } else {
        setError('Failed to load orders');
        toast.error('Failed to load orders');
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      setError(err.message);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Load a specific order
  const loadOrder = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await databaseService.getOrderById(orderId);
      
      if (result.success && result.data) {
        setCurrentOrder(result.data);
        return { success: true, data: result.data };
      } else {
        setError('Order not found');
        return { success: false, error: 'Order not found' };
      }
    } catch (err) {
      console.error('Error loading order:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel an order
  const cancelOrder = useCallback(async (orderId, reason) => {
    try {
      setLoading(true);
      const result = await databaseService.updateOrderStatus(orderId, 'cancelled');
      
      if (result.success) {
        toast.success('Order cancelled successfully');
        loadOrders(); // Reload orders
        return { success: true };
      } else {
        toast.error('Failed to cancel order');
        return { success: false };
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error('Failed to cancel order');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loadOrders]);

  return {
    orders,
    currentOrder,
    loading,
    error,
    loadOrders,
    loadOrder,
    cancelOrder
  };
};

export default useOrders;