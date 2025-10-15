// ==================== Dashboard.jsx ====================
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import DashboardCards from './DashboardCards';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import databaseService from '../../../services/firebase/database';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      // Load statistics from database
      const [orders, products, users] = await Promise.all([
        databaseService.getOrders(),
        databaseService.getProducts(),
        databaseService.getUsers()
      ]);

      const totalRevenue = orders.data?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
      const pendingOrders = orders.data?.filter(o => o.status === 'pending').length || 0;
      const lowStockProducts = products.data?.filter(p => p.inventory < 10).length || 0;

      setStats({
        totalOrders: orders.data?.length || 0,
        totalRevenue,
        totalProducts: products.data?.length || 0,
        totalUsers: users.data?.length || 0,
        pendingOrders,
        lowStockProducts
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Admin Dashboard
      </Typography>
      <DashboardCards stats={stats} />
    </Box>
  );
};

export default Dashboard;