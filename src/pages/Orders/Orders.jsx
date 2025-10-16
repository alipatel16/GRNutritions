import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Alert,
  Tabs,
  Tab,
  Paper,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  ShoppingBag,
  Visibility,
  Receipt,
  Search as SearchIcon,
  FilterList,
  LocalShipping,
  CheckCircle,
  Cancel,
  Pending
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { formatPrice, formatDateTime } from '../../utils/helpers/formatters';
import { getOrderStatus } from '../../utils/constants/orderStatus';
import { ROUTES } from '../../utils/constants/routes';

const OrdersContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8)
}));

const OrderCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)'
  }
}));

const StatusChip = styled(Chip)(({ theme, statuscolor }) => ({
  fontWeight: 600,
  backgroundColor: statuscolor ? `${statuscolor}20` : undefined,
  color: statuscolor || undefined
}));

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, loading, error, loadOrders } = useOrders();
  
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (user) {
      loadOrders(user.uid);
    }
  }, [user, loadOrders]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, activeTab]);

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status based on active tab
    if (activeTab === 1) {
      filtered = filtered.filter(order => order.status === 'pending' || order.status === 'confirmed');
    } else if (activeTab === 2) {
      filtered = filtered.filter(order => order.status === 'shipped' || order.status === 'out_for_delivery');
    } else if (activeTab === 3) {
      filtered = filtered.filter(order => order.status === 'delivered');
    } else if (activeTab === 4) {
      filtered = filtered.filter(order => order.status === 'cancelled' || order.status === 'refunded');
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.items?.some(item => item.name.toLowerCase().includes(query))
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredOrders(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewOrder = (orderId) => {
    navigate(`${ROUTES.ORDERS}/${orderId}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle />;
      case 'cancelled':
      case 'refunded':
        return <Cancel />;
      case 'shipped':
      case 'out_for_delivery':
        return <LocalShipping />;
      default:
        return <Pending />;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your orders..." />;
  }

  return (
    <OrdersContainer maxWidth="lg">
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          My Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage your orders
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search orders by ID or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                size="small"
              >
                More Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs for Order Status */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`All (${orders.length})`} />
          <Tab label="Processing" />
          <Tab label="Shipped" />
          <Tab label="Delivered" />
          <Tab label="Cancelled" />
        </Tabs>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {searchQuery ? 'No orders found' : 'No orders yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchQuery 
              ? 'Try adjusting your search or filters' 
              : 'Start shopping to see your orders here'
            }
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              onClick={() => navigate(ROUTES.PRODUCTS)}
              sx={{ mt: 2 }}
            >
              Start Shopping
            </Button>
          )}
        </Paper>
      ) : (
        <Box>
          {filteredOrders.map((order) => {
            const statusConfig = getOrderStatus(order.status);
            
            return (
              <OrderCard key={order.id}>
                <CardContent>
                  {/* Order Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Order #{order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placed on {formatDateTime(order.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <StatusChip
                        icon={getStatusIcon(order.status)}
                        label={statusConfig?.label || order.status}
                        statuscolor={statusConfig?.color}
                        size="small"
                      />
                      <Typography variant="h6" fontWeight={600} sx={{ mt: 1 }}>
                        {formatPrice(order.totalAmount)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Order Items */}
                  <List disablePadding>
                    {order.items?.slice(0, 2).map((item, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemAvatar>
                          <Avatar
                            src={item.image}
                            alt={item.name}
                            variant="rounded"
                            sx={{ width: 56, height: 56 }}
                          >
                            {item.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.name}
                          secondary={`Qty: ${item.quantity} × ${formatPrice(item.price)}`}
                        />
                      </ListItem>
                    ))}
                  </List>

                  {order.items?.length > 2 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      +{order.items.length - 2} more item(s)
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewOrder(order.id)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Receipt />}
                    >
                      Download Invoice
                    </Button>
                    {order.status === 'delivered' && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`${ROUTES.PRODUCTS}/${order.items[0].productId}`)}
                      >
                        Buy Again
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </OrderCard>
            );
          })}
        </Box>
      )}

      {/* Summary Box */}
      {filteredOrders.length > 0 && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Total Orders
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {orders.length}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Total Spent
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {formatPrice(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Delivered Orders
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {orders.filter(o => o.status === 'delivered').length}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </OrdersContainer>
  );
};

export default Orders;