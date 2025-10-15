// ==================== ProductList.jsx (Admin) ====================
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Box
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { formatPrice } from '../../../utils/helpers/formatters';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';

const ProductList = ({ products, loading, onEdit, onDelete }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!products || products.length === 0) {
    return <Box sx={{ textAlign: 'center', py: 4 }}>No products found</Box>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Inventory</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Avatar src={product.image} variant="rounded" />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell>
                <Chip
                  label={product.inventory}
                  color={product.inventory < 10 ? 'error' : 'success'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={product.active ? 'Active' : 'Inactive'}
                  color={product.active ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onEdit(product)}>
                  <Edit />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => onDelete(product.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductList;