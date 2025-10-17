// ==================== OrderTable.jsx - FIXED ====================
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { formatPrice, formatDate } from '../../../utils/helpers/formatters';
import { getOrderStatus, ORDER_STATUS } from '../../../utils/constants/orderStatus';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';

// Helper function to map order status to MUI Chip colors
const getChipColor = (statusId) => {
  const colorMap = {
    'pending': 'warning',
    'confirmed': 'info',
    'processing': 'secondary',
    'shipped': 'primary',
    'delivered': 'success',
    'cancelled': 'error',
    'returned': 'default',
    'refunded': 'default'
  };
  return colorMap[statusId] || 'default';
};

const OrderTable = ({ orders, loading, onStatusUpdate }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!orders || orders.length === 0) {
    return <Box sx={{ textAlign: 'center', py: 4 }}>No orders found</Box>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => {
            const status = getOrderStatus(order.status);
            return (
              <TableRow key={order.id}>
                <TableCell>#{order.orderNumber || order.id.slice(0, 8)}</TableCell>
                <TableCell>{order.userName || 'Guest'}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{order.items?.length || 0}</TableCell>
                <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                <TableCell>
                  <Chip
                    label={status?.label || order.status}
                    color={getChipColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                    size="small"
                  >
                    {Object.values(ORDER_STATUS).map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.label}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;