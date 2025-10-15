// ==================== DashboardCards.jsx ====================
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import {
  ShoppingCart,
  AttachMoney,
  Inventory,
  People,
  Warning,
  PendingActions
} from '@mui/icons-material';
import { formatPrice } from '../../../utils/helpers/formatters';

const DashboardCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      color: '#3f51b5'
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: '#4caf50'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Inventory sx={{ fontSize: 40 }} />,
      color: '#ff9800'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#9c27b0'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: <PendingActions sx={{ fontSize: 40 }} />,
      color: '#f44336'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockProducts,
      icon: <Warning sx={{ fontSize: 40 }} />,
      color: '#ff5722'
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{ color: card.color }}>
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;