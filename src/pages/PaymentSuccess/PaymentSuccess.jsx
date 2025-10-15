import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Paper
} from '@mui/material';
import {
  CheckCircle,
  Receipt as ReceiptIcon,
  Home as HomeIcon,
  ShoppingBag as ShopIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import databaseService from '../../services/firebase/database';
import { formatPrice, formatDateTime } from '../../utils/helpers/formatters';
import { getOrderStatus } from '../../utils/constants/orderStatus';
import { ROUTES } from '../../utils/constants/routes';
import { BUSINESS_CONSTANTS } from '../../utils/constants/orderStatus';

// Styled components
const SuccessContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  textAlign: 'center'
}));

// Renamed to avoid conflict with imported CheckCircle icon
const SuccessIconStyled = styled(CheckCircle)(({ theme }) => ({
  fontSize: 80,
  color: theme.palette.success.main,
  marginBottom: theme.spacing(2)
}));

const OrderCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: '0 auto',
  textAlign: 'left'
}));

const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: 160,
  margin: theme.spacing(1)
}));

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { orderId, paymentId } = location.state || {};

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    } else {
      setError('Order information not found');
      setLoading(false);
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const result = await databaseService.getOrderById(orderId);
      
      if (result.success && result.data) {
        setOrder(result.data);
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => navigate(ROUTES.HOME);
  const handleViewOrders = () => navigate(ROUTES.ORDERS);
  const handleContinueShopping = () => navigate(ROUTES.PRODUCTS);
  const handleDownloadReceipt = () => console.log('Download receipt for order:', orderId);

  if (loading) {
    return (
      <SuccessContainer>
        <Typography>Loading order details...</Typography>
      </SuccessContainer>
    );
  }

  if (error || !order) {
    return (
      <SuccessContainer>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Order information not available'}
        </Alert>
        <Button variant="contained" onClick={handleGoHome}>
          Go to Home
        </Button>
      </SuccessContainer>
    );
  }

  const statusConfig = getOrderStatus(order.status);

  return (
    <SuccessContainer maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <SuccessIconStyled />
        <Typography variant="h3" component="h1" gutterBottom fontWeight={600} color="success.main">
          Payment Successful!
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Thank you for your order. Your payment has been processed successfully.
        </Typography>
      </Box>

      <OrderCard elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Order #{order.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Placed on {formatDateTime(order.createdAt)}
              </Typography>
            </Box>
            <Chip
              label={statusConfig?.label || order.status}
              color="success"
              variant="filled"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Order Items
              </Typography>
              
              <List>
                {order.items?.map((item, index) => (
                  <ListItem key={index} divider={index < order.items.length - 1}>
                    <ListItemAvatar>
                      <Avatar
                        src={item.image}
                        alt={item.name}
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      >
                        {item.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={500}>
                          {item.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {item.quantity}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatPrice(item.price)} × {item.quantity}
                          </Typography>
                        </Box>
                      }
                    />
                    <Typography variant="subtitle1" fontWeight={600}>
                      {formatPrice(item.price * item.quantity)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Order Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">{formatPrice(order.subtotal || order.totalAmount)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                  <Typography variant="body2">Tax (GST 18%)</Typography>
                  <Typography variant="body2">{formatPrice(order.tax || 0)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">{formatPrice(order.shipping || 0)}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight={600}>Total Paid:</Typography>
                  <Typography variant="h6" fontWeight={600} color="primary">
                    {formatPrice(order.totalAmount)}
                  </Typography>
                </Box>
              </Paper>

              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Payment Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Payment ID: {paymentId || order.paymentId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Method: {order.paymentMethod || 'Razorpay'}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {order.address && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Shipping Address
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2">
                  {order.address.street}<br />
                  {order.address.city}, {order.address.state} - {order.address.zipCode}<br />
                  {order.address.country}
                </Typography>
              </Paper>
            </>
          )}

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Expected Delivery:</strong> Your order will be delivered within 5-7 business days.
              You will receive a tracking number via email once your order is shipped.
            </Typography>
          </Alert>
        </CardContent>
      </OrderCard>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <ActionButton variant="contained" startIcon={<ReceiptIcon />} onClick={handleViewOrders}>
          View All Orders
        </ActionButton>
        <ActionButton variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadReceipt}>
          Download Receipt
        </ActionButton>
        <ActionButton variant="outlined" startIcon={<ShopIcon />} onClick={handleContinueShopping}>
          Continue Shopping
        </ActionButton>
        <ActionButton variant="text" startIcon={<HomeIcon />} onClick={handleGoHome}>
          Go to Home
        </ActionButton>
      </Box>

      <Box sx={{ mt: 6, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          What's Next?
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <EmailIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Order Confirmation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You'll receive an email confirmation with your order details and tracking information.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <PhoneIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Customer Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Need help? Contact us at {BUSINESS_CONSTANTS.CONTACT_INFO.SUPPORT_PHONE} or 
                email {BUSINESS_CONSTANTS.CONTACT_INFO.SUPPORT_EMAIL}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </SuccessContainer>
  );
};

export default PaymentSuccess;