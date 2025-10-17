// ==================== Orders.jsx ====================
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
      // Call loadOrders without passing user.uid (it's already in the hook)
      loadOrders();
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
        order.id?.toLowerCase().includes(query) ||
        order.orderNumber?.toLowerCase().includes(query) ||
        order.items?.some(item => item.name?.toLowerCase().includes(query))
      );
    }

    setFilteredOrders(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleViewOrder = (orderId) => {
    navigate(`${ROUTES.ORDERS}/${orderId}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle />;
      case 'cancelled':
        return <Cancel />;
      case 'shipped':
      case 'out_for_delivery':
        return <LocalShipping />;
      default:
        return <Pending />;
    }
  };

  if (loading && orders.length === 0) {
    return <LoadingSpinner message="Loading your orders..." />;
  }

  if (error) {
    return (
      <OrdersContainer>
        <Alert severity="error">{error}</Alert>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer maxWidth="lg">
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
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
              placeholder="Search orders by ID or product name..."
              value={searchQuery}
              onChange={handleSearchChange}
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
            <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab label="All" />
              <Tab label="Active" />
              <Tab label="In Transit" />
              <Tab label="Delivered" />
              <Tab label="Cancelled" />
            </Tabs>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No orders found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchQuery
                  ? "No orders match your search criteria"
                  : "You haven't placed any orders yet"}
              </Typography>
              <Button variant="contained" onClick={() => navigate(ROUTES.PRODUCTS)}>
                Start Shopping
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {filteredOrders.map((order) => {
            const statusInfo = getOrderStatus(order.status);
            
            return (
              <OrderCard key={order.id}>
                <CardContent>
                  <Grid container spacing={2}>
                    {/* Order Header */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            Order #{order.orderNumber || order.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Placed on {formatDateTime(order.createdAt)}
                          </Typography>
                        </Box>
                        <StatusChip
                          icon={getStatusIcon(order.status)}
                          label={statusInfo?.label || order.status}
                          statuscolor={statusInfo?.color}
                        />
                      </Box>
                      <Divider />
                    </Grid>

                    {/* Order Items */}
                    <Grid item xs={12} md={8}>
                      <List>
                        {order.items?.slice(0, 3).map((item, index) => (
                          <ListItem key={index} disableGutters>
                            <ListItemAvatar>
                              <Avatar
                                src={item.image || item.imageUrl}
                                alt={item.name}
                                variant="rounded"
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={item.name}
                              secondary={`Quantity: ${item.quantity} × ${formatPrice(item.price)}`}
                            />
                          </ListItem>
                        ))}
                        {order.items?.length > 3 && (
                          <Typography variant="body2" color="text.secondary">
                            +{order.items.length - 3} more items
                          </Typography>
                        )}
                      </List>
                    </Grid>

                    {/* Order Summary */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Total Amount
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                          {formatPrice(order.totalAmount || 0)}
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewOrder(order.id)}
                          fullWidth
                          sx={{ mt: 1 }}
                        >
                          View Details
                        </Button>
                        {order.trackingNumber && (
                          <Button
                            variant="text"
                            startIcon={<LocalShipping />}
                            fullWidth
                            size="small"
                            sx={{ mt: 1 }}
                          >
                            Track Order
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </OrderCard>
            );
          })}
        </Box>
      )}
    </OrdersContainer>
  );
};

export default Orders;