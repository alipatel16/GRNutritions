// ==================== OrderSummary.jsx (component) ====================
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { formatPrice } from '../../../utils/helpers/formatters';

const OrderSummary = ({ items, shippingAddress, paymentMethod, onPlaceOrder }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 999 ? 0 : 50;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    
    try {
      await onPlaceOrder({
        paymentMethod,
        amount: total
      });
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Your Order
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Shipping Address */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Shipping Address
          </Typography>
          {shippingAddress ? (
            <Box>
              <Typography variant="body2">{shippingAddress.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {shippingAddress.addressLine1}
                {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: {shippingAddress.phoneNumber}
              </Typography>
            </Box>
          ) : (
            <Typography color="error">No address selected</Typography>
          )}
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Order Items ({items.length})
          </Typography>
          <List>
            {items.map((item, index) => (
              <ListItem key={index} divider={index < items.length - 1}>
                <ListItemAvatar>
                  <Avatar src={item.image} variant="rounded" />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={`Qty: ${item.quantity}`}
                />
                <Typography variant="body1" fontWeight="bold">
                  {formatPrice(item.price * item.quantity)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Price Details
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Subtotal</Typography>
            <Typography>{formatPrice(subtotal)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Tax (GST 18%)</Typography>
            <Typography>{formatPrice(tax)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Shipping</Typography>
            <Typography>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="h6" fontWeight="bold">Total</Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {formatPrice(total)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handlePlaceOrder}
        disabled={loading || !shippingAddress}
        startIcon={loading ? <CircularProgress size={20} /> : <ShoppingCart />}
      >
        {loading ? 'Processing...' : 'Place Order'}
      </Button>
    </Box>
  );
};

export default OrderSummary;