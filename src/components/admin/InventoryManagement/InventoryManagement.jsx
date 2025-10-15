// ==================== InventoryManagement.jsx ====================
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import InventoryTable from './InventoryTable';
import StockUpdateForm from './StockUpdateForm';
import { useInventory } from '../../../hooks/useInventory';
import toast from '../../../services/notification/toast';

const InventoryManagement = () => {
  const { inventory, loading, loadInventory, updateInventory } = useInventory();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleUpdateStock = async (productId, quantity, reason, notes) => {
    try {
      await updateInventory(productId, quantity, reason, notes);
      setDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openUpdateDialog = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Inventory Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadInventory}
        >
          Refresh
        </Button>
      </Box>

      <InventoryTable
        inventory={inventory}
        loading={loading}
        onUpdateStock={openUpdateDialog}
      />

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Stock</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <StockUpdateForm
              product={selectedProduct}
              onSubmit={handleUpdateStock}
              onCancel={() => setDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default InventoryManagement;