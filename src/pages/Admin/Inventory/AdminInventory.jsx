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
  Avatar,
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
  Alert
} from '@mui/material';
import {
  Edit,
  Search,
  Warning,
  CheckCircle,
  Cancel,
  Image as ImageIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useInventory } from '../../../hooks/useInventory';
import { useProducts } from '../../../context/ProductContext/ProductContext';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import { formatPrice } from '../../../utils/helpers/formatters';
import { getInventoryStatus, INVENTORY_STATUS } from '../../../utils/constants/orderStatus';
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

const AdminInventory = () => {
  const { products, loading, updateProduct, loadProducts } = useProducts();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockUpdate, setStockUpdate] = useState({
    quantity: '',
    reason: ''
  });

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const inventoryStatus = getInventoryStatus(product.inventory);
    const matchesStatus = !statusFilter || inventoryStatus.id === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setStockUpdate({
      quantity: product.inventory,
      reason: ''
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
    setStockUpdate({ quantity: '', reason: '' });
  };

  const handleUpdateStock = async () => {
    try {
      await updateProduct(selectedProduct.id, {
        inventory: parseInt(stockUpdate.quantity)
      });
      toast.success('Inventory updated successfully');
      handleCloseDialog();
      loadProducts();
    } catch (error) {
      toast.error('Failed to update inventory');
      console.error('Error updating inventory:', error);
    }
  };

  const getStatusIcon = (stock) => {
    const status = getInventoryStatus(stock);
    switch (status.id) {
      case 'in_stock':
        return <CheckCircle />;
      case 'low_stock':
        return <Warning />;
      case 'out_of_stock':
        return <Cancel />;
      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading inventory..." />;
  }

  const lowStockCount = products.filter(p => {
    const status = getInventoryStatus(p.inventory);
    return status.id === 'low_stock';
  }).length;

  const outOfStockCount = products.filter(p => {
    const status = getInventoryStatus(p.inventory);
    return status.id === 'out_of_stock';
  }).length;

  return (
    <Box>
      <HeaderBox>
        <Typography variant="h4" fontWeight={600}>
          Inventory Management
        </Typography>
      </HeaderBox>

      {/* Alerts */}
      {lowStockCount > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {lowStockCount} product(s) are running low on stock
        </Alert>
      )}
      {outOfStockCount > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {outOfStockCount} product(s) are out of stock
        </Alert>
      )}

      <SearchBox>
        <TextField
          fullWidth
          size="small"
          placeholder="Search products..."
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
          <InputLabel>Stock Status</InputLabel>
          <Select
            value={statusFilter}
            label="Stock Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All Products</MenuItem>
            <MenuItem value="in_stock">In Stock</MenuItem>
            <MenuItem value="low_stock">Low Stock</MenuItem>
            <MenuItem value="out_of_stock">Out of Stock</MenuItem>
          </Select>
        </FormControl>
      </SearchBox>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Current Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => {
                  const inventoryStatus = getInventoryStatus(product.inventory);
                  return (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Avatar
                          src={product.images?.[0]}
                          variant="rounded"
                          sx={{ width: 48, height: 48 }}
                        >
                          <ImageIcon />
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <Typography
                          variant="h6"
                          color={
                            inventoryStatus.id === 'out_of_stock' ? 'error' :
                            inventoryStatus.id === 'low_stock' ? 'warning.main' :
                            'success.main'
                          }
                          fontWeight={600}
                        >
                          {product.inventory}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(product.inventory)}
                          label={inventoryStatus.label}
                          size="small"
                          sx={{
                            bgcolor: `${inventoryStatus.color}20`,
                            color: inventoryStatus.color,
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(product)}
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
          count={filteredProducts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Update Stock Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Inventory - {selectedProduct?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Stock"
                value={selectedProduct?.inventory || 0}
                disabled
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Stock Quantity"
                type="number"
                value={stockUpdate.quantity}
                onChange={(e) => setStockUpdate({ ...stockUpdate, quantity: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for Update (Optional)"
                multiline
                rows={3}
                value={stockUpdate.reason}
                onChange={(e) => setStockUpdate({ ...stockUpdate, reason: e.target.value })}
                placeholder="E.g., New stock arrival, Damaged items, etc."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateStock} 
            variant="contained"
            disabled={!stockUpdate.quantity}
          >
            Update Stock
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminInventory;