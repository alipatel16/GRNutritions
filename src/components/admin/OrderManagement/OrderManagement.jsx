// ==================== OrderManagement.jsx ====================
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab
} from '@mui/material';
import OrderTable from './OrderTable';
import databaseService from '../../../services/firebase/database';
import { ORDER_STATUS } from '../../../utils/constants/orderStatus';
import toast from '../../../services/notification/toast';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const result = await databaseService.getOrders();
      if (result.success) {
        setOrders(result.data || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await databaseService.updateOrderStatus(orderId, newStatus);
      toast.messages.orderStatusUpdated();
      loadOrders();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filterOrders = (orders, filter) => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status === filter);
  };

  const filteredOrders = filterOrders(orders, activeTab);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Order Management
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="All Orders" value="all" />
        <Tab label="Pending" value={ORDER_STATUS.PENDING.id} />
        <Tab label="Processing" value={ORDER_STATUS.PROCESSING.id} />
        <Tab label="Shipped" value={ORDER_STATUS.SHIPPED.id} />
        <Tab label="Delivered" value={ORDER_STATUS.DELIVERED.id} />
        <Tab label="Cancelled" value={ORDER_STATUS.CANCELLED.id} />
      </Tabs>

      <OrderTable
        orders={filteredOrders}
        loading={loading}
        onStatusUpdate={handleStatusUpdate}
      />
    </Box>
  );
};

export default OrderManagement;