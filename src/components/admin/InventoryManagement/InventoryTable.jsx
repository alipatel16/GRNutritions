// ==================== InventoryTable.jsx ====================
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
import { Edit } from '@mui/icons-material';
import { getInventoryStatus } from '../../../utils/constants/orderStatus';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';

const InventoryTable = ({ inventory, loading, onUpdateStock }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!inventory || inventory.length === 0) {
    return <Box sx={{ textAlign: 'center', py: 4 }}>No inventory data found</Box>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Current Stock</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory.map((item) => {
            const status = getInventoryStatus(item.inventory);
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <Avatar src={item.image} variant="rounded" />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.inventory}</TableCell>
                <TableCell>
                  <Chip
                    label={status.label}
                    color={status.color}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onUpdateStock(item)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;