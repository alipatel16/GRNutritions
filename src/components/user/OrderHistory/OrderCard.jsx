// ==================== OrderCard.jsx ====================
import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import {
  LocalShipping,
  Receipt,
  Cancel
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatDate } from '../../../utils/helpers/formatters';
import { getOrderStatus } from '../../../utils/constants/orderStatus';
import { ROUTE_BUILDERS } from '../../../utils/constants/routes';

const OrderCard = ({ order, onCancel }) => {
  const navigate = useNavigate();
  const status = getOrderStatus(order.status);

  const canCancel = order.status === 'pending' || order.status === 'processing';

  const handleViewDetails = () => {
    navigate(ROUTE_BUILDERS.orderDetail(order.id));
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      onCancel(order.id, 'Customer requested cancellation');
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Order #{order.orderNumber || order.id.slice(0, 8)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placed on {formatDate(order.createdAt)}
            </Typography>
          </Box>
          <Chip
            label={status?.label || order.status}
            color={status?.color || 'default'}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Items ({order.items?.length || 0})
            </Typography>
            {order.items?.slice(0, 2).map((item, index) => (
              <Typography key={index} variant="body2">
                • {item.productName} × {item.quantity}
              </Typography>
            ))}
            {order.items?.length > 2 && (
              <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                +{order.items.length - 2} more items
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total Amount
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {formatPrice(order.totalAmount)}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 1, mt: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Receipt />}
            onClick={handleViewDetails}
            size="small"
          >
            View Details
          </Button>
          
          {canCancel && onCancel && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              onClick={handleCancelOrder}
              size="small"
            >
              Cancel Order
            </Button>
          )}

          {order.trackingNumber && (
            <Button
              variant="outlined"
              startIcon={<LocalShipping />}
              size="small"
            >
              Track Order
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard;