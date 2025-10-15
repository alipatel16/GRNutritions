// ==================== CategoryForm.jsx ====================
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  CircularProgress
} from '@mui/material';
import { validateWithSchema, categorySchema } from '../../../utils/validationSchemas';

const CategoryForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    slug: '',
    description: '',
    displayOrder: 0,
    active: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    // Auto-generate slug from name
    if (name === 'name' && !initialData) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, name: value, slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: newValue }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateWithSchema(formData, categorySchema);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting category:', error);
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
            label="Category Name"
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
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            error={!!errors.slug}
            helperText={errors.slug || 'URL-friendly version of the name'}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Display Order"
            name="displayOrder"
            type="number"
            value={formData.displayOrder}
            onChange={handleChange}
            error={!!errors.displayOrder}
            helperText={errors.displayOrder || 'Lower numbers appear first'}
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
          {loading ? <CircularProgress size={24} /> : 'Save Category'}
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryForm;