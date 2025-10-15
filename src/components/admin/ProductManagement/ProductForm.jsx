// ==================== ProductForm.jsx (Admin) ====================
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress
} from '@mui/material';
import { validateWithSchema, productSchema } from '../../../utils/validationSchemas';
import { getAllCategories } from '../../../utils/constants/categories';

const ProductForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    compareAtPrice: '',
    category: '',
    brand: '',
    sku: '',
    inventory: '',
    weight: '',
    featured: false,
    active: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = getAllCategories();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateWithSchema(formData, productSchema);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Short Description"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={4}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Compare At Price"
            name="compareAtPrice"
            type="number"
            value={formData.compareAtPrice}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.category}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            error={!!errors.brand}
            helperText={errors.brand}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            error={!!errors.sku}
            helperText={errors.sku}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Inventory"
            name="inventory"
            type="number"
            value={formData.inventory}
            onChange={handleChange}
            error={!!errors.inventory}
            helperText={errors.inventory}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
            }
            label="Featured Product"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
            }
            label="Active"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Save Product'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;