// ==================== orders.js ====================
import databaseService from '../firebase/database';
import { ORDER_STATUS } from '../../utils/constants/orderStatus';

const ordersAPI = {
  // Create order
  createOrder: async (orderData) => {
    try {
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const newOrder = {
        ...orderData,
        orderNumber,
        status: ORDER_STATUS.PENDING.id,
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return await databaseService.create('orders', newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      return await databaseService.read(`orders/${orderId}`);
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async (userId, filters = {}) => {
    try {
      return await databaseService.query('orders', {
        orderBy: { type: 'child', key: 'userId' },
        equalTo: userId,
        ...filters
      });
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  },

  // Get all orders (Admin)
  getAllOrders: async (filters = {}) => {
    try {
      return await databaseService.query('orders', {
        orderBy: { type: 'child', key: 'createdAt' },
        ...filters
      });
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status, notes = '') => {
    try {
      return await databaseService.update(`orders/${orderId}`, {
        status,
        statusHistory: {
          status,
          timestamp: new Date().toISOString(),
          notes
        }
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId, reason) => {
    try {
      return await databaseService.update(`orders/${orderId}`, {
        status: ORDER_STATUS.CANCELLED.id,
        cancellationReason: reason,
        cancelledAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },

  // Update payment status
  updatePaymentStatus: async (orderId, paymentStatus, paymentDetails = {}) => {
    try {
      return await databaseService.update(`orders/${orderId}`, {
        paymentStatus,
        paymentDetails,
        paidAt: paymentStatus === 'paid' ? new Date().toISOString() : null
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Add tracking information
  addTrackingInfo: async (orderId, trackingNumber, carrier) => {
    try {
      return await databaseService.update(`orders/${orderId}`, {
        trackingNumber,
        carrier,
        status: ORDER_STATUS.SHIPPED.id,
        shippedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding tracking info:', error);
      throw error;
    }
  },

  // Get orders by status
  getOrdersByStatus: async (status) => {
    try {
      return await databaseService.query('orders', {
        orderBy: { type: 'child', key: 'status' },
        equalTo: status
      });
    } catch (error) {
      console.error('Error getting orders by status:', error);
      throw error;
    }
  },

  // Get order statistics
  getOrderStatistics: async (startDate = null, endDate = null) => {
    try {
      const result = await databaseService.query('orders', {
        orderBy: { type: 'child', key: 'createdAt' }
      });

      if (!result.success) return { success: false, data: null };

      const orders = result.data || [];
      const filteredOrders = startDate && endDate
        ? orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= startDate && orderDate <= endDate;
          })
        : orders;

      const stats = {
        totalOrders: filteredOrders.length,
        totalRevenue: filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        averageOrderValue: filteredOrders.length > 0
          ? filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) / filteredOrders.length
          : 0,
        ordersByStatus: {},
        topProducts: {}
      };

      // Count orders by status
      filteredOrders.forEach(order => {
        stats.ordersByStatus[order.status] = (stats.ordersByStatus[order.status] || 0) + 1;
      });

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting order statistics:', error);
      throw error;
    }
  }
};

export default ordersAPI;