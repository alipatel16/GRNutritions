// ==================== ProductManagement.jsx - FIXED ====================
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { Add } from '@mui/icons-material';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { useProducts } from '../../../context/ProductContext/ProductContext';
import toast from '../../../services/notification/toast';

const ProductManagement = () => {
  const { products, loading, loadProducts, createProduct, updateProduct, deleteProduct } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // FIXED: Load products only once on mount, not when loadProducts changes
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once

  const handleAddProduct = async (productData) => {
    try {
      const result = await createProduct(productData);
      if (result.success) {
        toast.messages.productAdded();
        setDialogOpen(false);
        // Products are already updated in context via ADD_PRODUCT action
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add product');
    }
  };

  const handleEditProduct = async (productData) => {
    try {
      const result = await updateProduct(editingProduct.id, productData);
      if (result.success) {
        toast.messages.productUpdated();
        setDialogOpen(false);
        setEditingProduct(null);
        // Products are already updated in context via UPDATE_PRODUCT action
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const result = await deleteProduct(productId);
      if (result.success) {
        toast.messages.productDeleted();
        // Products are already updated in context via REMOVE_PRODUCT action
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const openEditDialog = (product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openAddDialog}
        >
          Add Product
        </Button>
      </Box>

      <ProductList
        products={products}
        loading={loading}
        onEdit={openEditDialog}
        onDelete={handleDeleteProduct}
      />

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <ProductForm
            initialData={editingProduct}
            onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;