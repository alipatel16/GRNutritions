// ==================== OrderHistory.jsx ====================
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab
} from '@mui/material';
import OrderCard from './OrderCard';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import { useOrders } from '../../../hooks/useOrders';
import { ORDER_STATUS } from '../../../utils/constants/orderStatus';

const OrderHistory = () => {
  const { orders, loading, loadOrders, cancelOrder } = useOrders();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filterOrders = (orders, filter) => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status === filter);
  };

  const filteredOrders = filterOrders(orders, activeTab);

  if (loading) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Order History
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="All Orders" value="all" />
        <Tab label="Pending" value={ORDER_STATUS.PENDING.id} />
        <Tab label="Processing" value={ORDER_STATUS.PROCESSING.id} />
        <Tab label="Shipped" value={ORDER_STATUS.SHIPPED.id} />
        <Tab label="Delivered" value={ORDER_STATUS.DELIVERED.id} />
        <Tab label="Cancelled" value={ORDER_STATUS.CANCELLED.id} />
      </Tabs>

      {filteredOrders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No orders found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 'all'
              ? "You haven't placed any orders yet"
              : `No ${activeTab} orders`}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={cancelOrder}
            />
          ))}
        </Box>
      )}
    </Card>
  );
};

export default OrderHistory;