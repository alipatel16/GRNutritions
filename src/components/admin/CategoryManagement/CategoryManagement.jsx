// ==================== CategoryManagement.jsx ====================
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
import CategoryForm from './CategoryForm';
import CategoryList from './CategoryList';
import databaseService from '../../../services/firebase/database';
import toast from '../../../services/notification/toast';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const result = await databaseService.getCategories();
      if (result.success) {
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (categoryData) => {
    try {
      await databaseService.addCategory(categoryData);
      toast.messages.categoryAdded();
      loadCategories();
      setDialogOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditCategory = async (categoryData) => {
    try {
      await databaseService.updateCategory(editingCategory.id, categoryData);
      toast.messages.categoryUpdated();
      loadCategories();
      setDialogOpen(false);
      setEditingCategory(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await databaseService.deleteCategory(categoryId);
      toast.messages.categoryDeleted();
      loadCategories();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openAddDialog = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Category Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openAddDialog}
        >
          Add Category
        </Button>
      </Box>

      <CategoryList
        categories={categories}
        loading={loading}
        onEdit={openEditDialog}
        onDelete={handleDeleteCategory}
      />

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <CategoryForm
            initialData={editingCategory}
            onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;