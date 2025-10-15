// ==================== ProductManagement.jsx ====================
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
  const { products, loading, loadProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddProduct = async (productData) => {
    try {
      await addProduct(productData);
      toast.messages.productAdded();
      setDialogOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditProduct = async (productData) => {
    try {
      await updateProduct(editingProduct.id, productData);
      toast.messages.productUpdated();
      setDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProduct(productId);
      toast.messages.productDeleted();
    } catch (error) {
      toast.error(error.message);
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
        onClose={() => setDialogOpen(false)}
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
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;