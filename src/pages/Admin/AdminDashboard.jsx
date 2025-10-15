import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  People,
  Inventory,
  AttachMoney,
  Visibility,
  Edit,
  MoreVert
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Components
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';

// Utils
import { formatPrice, formatDate } from '../../utils/helpers/formatters';
import { getOrderStatus } from '../../utils/constants/orderStatus';
import { ROUTES } from '../../utils/constants/routes';

// Styled components
const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  position: 'relative',
  overflow: 'visible',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8]
  }
}));

const StatsIcon = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  position: 'absolute',
  top: -28,
  right: 20,
  boxShadow: theme.shadows[4]
}));

const TrendIndicator = styled(Box)(({ theme, trend }) => ({
  display: 'flex',
  alignItems: 'center',
  color: trend === 'up' ? theme.palette.success.main : theme.palette.error.main,
  fontSize: '0.875rem',
  fontWeight: 500
}));

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Local state
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      totalProducts: 0
    },
    recentOrders: [],
    topProducts: [],
    lowStockProducts: []
  });

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData({
        stats: {
          totalOrders: 1245,
          totalRevenue: 567890,
          totalCustomers: 2340,
          totalProducts: 156,
          ordersTrend: 'up',
          revenueTrend: 'up',
          customersTrend: 'up',
          productsTrend: 'down'
        },
        recentOrders: [
          {
            id: 'ORD-001',
            customerName: 'John Doe',
            status: 'pending',
            total: 2399,
            date: new Date(),
            items: 3
          },
          {
            id: 'ORD-002',
            customerName: 'Jane Smith',
            status: 'confirmed',
            total: 1299,
            date: new Date(Date.now() - 86400000),
            items: 2
          },
          {
            id: 'ORD-003',
            customerName: 'Mike Johnson',
            status: 'shipped',
            total: 3599,
            date: new Date(Date.now() - 172800000),
            items: 5
          }
        ],
        topProducts: [
          {
            id: 'PROD-001',
            name: 'Whey Protein Isolate',
            sales: 234,
            revenue: 156780
          },
          {
            id: 'PROD-002',
            name: 'Mass Gainer Pro',
            sales: 187,
            revenue: 98560
          }
        ],
        lowStockProducts: [
          {
            id: 'PROD-003',
            name: 'BCAA Energy Drink',
            stock: 5,
            threshold: 10
          },
          {
            id: 'PROD-004',
            name: 'Pre-Workout Formula',
            stock: 3,
            threshold: 15
          }
        ]
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Statistics cards data
  const statsCards = [
    {
      title: 'Total Orders',
      value: dashboardData.stats.totalOrders,
      trend: dashboardData.stats.ordersTrend,
      trendValue: '+12%',
      icon: ShoppingCart,
      color: theme.palette.primary.main,
      path: ROUTES.ADMIN_ORDERS
    },
    {
      title: 'Revenue',
      value: formatPrice(dashboardData.stats.totalRevenue),
      trend: dashboardData.stats.revenueTrend,
      trendValue: '+8.5%',
      icon: AttachMoney,
      color: theme.palette.success.main,
      path: ROUTES.ADMIN_ANALYTICS
    },
    {
      title: 'Customers',
      value: dashboardData.stats.totalCustomers,
      trend: dashboardData.stats.customersTrend,
      trendValue: '+15%',
      icon: People,
      color: theme.palette.info.main,
      path: ROUTES.ADMIN_USERS
    },
    {
      title: 'Products',
      value: dashboardData.stats.totalProducts,
      trend: dashboardData.stats.productsTrend,
      trendValue: '-2%',
      icon: Inventory,
      color: theme.palette.warning.main,
      path: ROUTES.ADMIN_PRODUCTS
    }
  ];

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your store.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard 
              onClick={() => navigate(stat.path)}
              sx={{ cursor: 'pointer' }}
            >
              <StatsIcon sx={{ bgcolor: stat.color }}>
                <stat.icon />
              </StatsIcon>
              <CardContent sx={{ pt: 4 }}>
                <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <TrendIndicator trend={stat.trend}>
                  {stat.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {stat.trendValue} from last month
                  </Typography>
                </TrendIndicator>
              </CardContent>
            </StatsCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Recent Orders
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(ROUTES.ADMIN_ORDERS)}
                >
                  View All
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recentOrders.map((order) => {
                      const statusConfig = getOrderStatus(order.status);
                      return (
                        <TableRow key={order.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {order.id}
                            </Typography>
                          </TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>
                            <Chip
                              label={statusConfig?.label || order.status}
                              size="small"
                              sx={{
                                bgcolor: statusConfig?.color + '20',
                                color: statusConfig?.color,
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell>{formatPrice(order.total)}</TableCell>
                          <TableCell>{formatDate(order.date)}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`${ROUTES.ADMIN_ORDERS}/${order.id}`)}
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar Cards */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Top Products */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Top Selling Products
                  </Typography>
                  {dashboardData.topProducts.map((product, index) => (
                    <Box
                      key={product.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                        borderBottom: index < dashboardData.topProducts.length - 1 ? 1 : 0,
                        borderColor: 'divider'
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.sales} units sold
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        {formatPrice(product.revenue)}
                      </Typography>
                    </Box>
                  ))}
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
                  >
                    View All Products
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Low Stock Alert */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom color="warning.main">
                    Low Stock Alert
                  </Typography>
                  {dashboardData.lowStockProducts.map((product, index) => (
                    <Box
                      key={product.id}
                      sx={{
                        py: 1,
                        borderBottom: index < dashboardData.lowStockProducts.length - 1 ? 1 : 0,
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {product.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                          Stock: {product.stock} units
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(product.stock / product.threshold) * 100}
                          sx={{ flex: 1, height: 4, borderRadius: 2 }}
                          color="warning"
                        />
                      </Box>
                    </Box>
                  ))}
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => navigate(ROUTES.ADMIN_INVENTORY)}
                  >
                    Manage Inventory
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;