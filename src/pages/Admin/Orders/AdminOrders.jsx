import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import {
  Visibility,
  Edit,
  Search,
  FilterList
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useOrders } from '../../../hooks/useOrders';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import { formatPrice, formatDateTime } from '../../../utils/helpers/formatters';
import { getOrderStatus, ORDER_STATUS } from '../../../utils/constants/orderStatus';
import { toast } from 'react-toastify';

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3)
}));

const SearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3)
}));

const AdminOrders = () => {
  const { orders, loading, loadAllOrders, updateOrderStatus } = useOrders();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadAllOrders();
  }, [loadAllOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleEditStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setEditStatusOpen(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      toast.success('Order status updated successfully');
      setEditStatusOpen(false);
      loadAllOrders();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  return (
    <Box>
      <HeaderBox>
        <Typography variant="h4" fontWeight={600}>
          Order Management
        </Typography>
      </HeaderBox>

      <SearchBox>
        <TextField
          fullWidth
          size="small"
          placeholder="Search orders by ID or customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {Object.values(ORDER_STATUS).map((status) => (
              <MenuItem key={status.id} value={status.id}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </SearchBox>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => {
                  const statusConfig = getOrderStatus(order.status);
                  return (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          #{order.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order.customerName || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.customerEmail}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatDateTime(order.createdAt)}
                      </TableCell>
                      <TableCell>{order.items?.length || 0}</TableCell>
                      <TableCell fontWeight={600}>
                        {formatPrice(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusConfig?.label || order.status}
                          size="small"
                          sx={{
                            bgcolor: `${statusConfig?.color}20`,
                            color: statusConfig?.color,
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditStatus(order)}
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredOrders.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Order Details - #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Customer Information
                    </Typography>
                    <Typography variant="body2">
                      Name: {selectedOrder.customerName}
                    </Typography>
                    <Typography variant="body2">
                      Email: {selectedOrder.customerEmail}
                    </Typography>
                    <Typography variant="body2">
                      Phone: {selectedOrder.customerPhone}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Order Information
                    </Typography>
                    <Typography variant="body2">
                      Date: {formatDateTime(selectedOrder.createdAt)}
                    </Typography>
                    <Typography variant="body2">
                      Status: {getOrderStatus(selectedOrder.status)?.label}
                    </Typography>
                    <Typography variant="body2">
                      Total: {formatPrice(selectedOrder.totalAmount)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Order Items
                  </Typography>
                  <List>
                    {selectedOrder.items?.map((item, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={item.name}
                          secondary={`Qty: ${item.quantity} × ${formatPrice(item.price)}`}
                        />
                        <Typography fontWeight={600}>
                          {formatPrice(item.price * item.quantity)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                {selectedOrder.address && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Shipping Address
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2">
                        {selectedOrder.address.street}<br />
                        {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.zipCode}<br />
                        {selectedOrder.address.country}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={editStatusOpen} onClose={() => setEditStatusOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Order Status</InputLabel>
            <Select
              value={newStatus}
              label="Order Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {Object.values(ORDER_STATUS).map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditStatusOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOrders;