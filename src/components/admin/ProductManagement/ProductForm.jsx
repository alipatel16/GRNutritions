// src/components/admin/ProductManagement/ProductForm.jsx
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
  CircularProgress,
  IconButton,
  Typography,
  Paper,
  Card,
  CardMedia,
  Alert
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { validateWithSchema, productSchema } from '../../../utils/validationSchemas';
import { getAllCategories } from '../../../utils/constants/categories';
import { 
  compressAndEncodeImage, 
  validateImageFile, 
  formatFileSize,
  getBase64Size 
} from '../../../utils/helpers/imageUtils';
import toast from '../../../services/notification/toast';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImagePreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  marginTop: theme.spacing(2)
}));

const ImagePreviewCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  width: 150,
  height: 150,
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden'
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: theme.palette.error.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.error.dark
  },
  padding: theme.spacing(0.5)
}));

const UploadBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  border: `2px dashed ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.action.hover,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    borderColor: theme.palette.primary.dark
  }
}));

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
    active: true,
    images: [] // Array of base64 strings
  });
  
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');

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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Limit to 5 images
    if ((formData.images?.length || 0) + files.length > 5) {
      setImageError('Maximum 5 images allowed');
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploadingImage(true);
    setImageError('');

    try {
      const compressedImages = [];

      for (const file of files) {
        // Validate file
        const validation = validateImageFile(file, {
          maxSize: 5 * 1024 * 1024, // 5MB
          allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        });

        if (!validation.isValid) {
          setImageError(validation.errors[0]);
          toast.error(validation.errors[0]);
          continue;
        }

        // Compress and convert to base64
        const base64 = await compressAndEncodeImage(file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.8,
          outputFormat: 'image/jpeg'
        });

        const compressedSize = getBase64Size(base64);
        console.log(`Original: ${formatFileSize(file.size)}, Compressed: ${formatFileSize(compressedSize)}`);

        compressedImages.push(base64);
      }

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...compressedImages]
      }));

      toast.success(`${compressedImages.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading images:', error);
      setImageError('Failed to upload images');
      toast.error('Failed to upload images');
    } finally {
      setUploadingImage(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    toast.success('Image removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if at least one image is uploaded
    if (!formData.images || formData.images.length === 0) {
      setImageError('At least one product image is required');
      toast.error('Please upload at least one product image');
      return;
    }

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
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      <Grid container spacing={3}>
        {/* Product Images Upload */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Product Images *
          </Typography>
          
          <UploadBox component="label">
            <VisuallyHiddenInput
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleImageUpload}
              disabled={uploadingImage || (formData.images?.length >= 5)}
            />
            <Box>
              {uploadingImage ? (
                <CircularProgress size={40} />
              ) : (
                <>
                  <ImageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body1" gutterBottom>
                    {formData.images?.length >= 5 
                      ? 'Maximum images reached (5/5)'
                      : 'Click to upload product images'
                    }
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supports: JPG, PNG, WEBP (Max 5MB each, up to 5 images)
                  </Typography>
                </>
              )}
            </Box>
          </UploadBox>

          {imageError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {imageError}
            </Alert>
          )}

          {/* Image Previews */}
          {formData.images && formData.images.length > 0 && (
            <ImagePreviewContainer>
              {formData.images.map((image, index) => (
                <ImagePreviewCard key={index}>
                  <CardMedia
                    component="img"
                    image={image}
                    alt={`Product ${index + 1}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <DeleteButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </DeleteButton>
                  {index === 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        py: 0.5,
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="caption">Primary</Typography>
                    </Box>
                  )}
                </ImagePreviewCard>
              ))}
            </ImagePreviewContainer>
          )}
        </Grid>

        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
        </Grid>

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
            helperText="Brief description for product cards (max 100 characters)"
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

        {/* Pricing */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Pricing
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Price (₹)"
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
            label="Compare At Price (₹)"
            name="compareAtPrice"
            type="number"
            value={formData.compareAtPrice}
            onChange={handleChange}
            helperText="Original price (for showing discounts)"
          />
        </Grid>

        {/* Product Details */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Product Details
          </Typography>
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
            helperText="Optional: Product weight"
          />
        </Grid>

        {/* Settings */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Settings
          </Typography>
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
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading || uploadingImage}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Saving...' : 'Save Product'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;