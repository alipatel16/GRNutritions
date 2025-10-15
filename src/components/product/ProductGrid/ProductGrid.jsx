// ==================== ProductGrid.jsx ====================
import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import ProductCard from '../ProductCard/ProductCard';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';

const ProductGrid = ({ products, loading, error, onRetry, columns = { xs: 1, sm: 2, md: 3, lg: 4 } }) => {
  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        {onRetry && (
          <Button variant="contained" startIcon={<RefreshIcon />} onClick={onRetry} sx={{ mt: 2 }}>
            Try Again
          </Button>
        )}
      </Box>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No products found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Try adjusting your filters or search term
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item key={product.id} xs={columns.xs} sm={columns.sm} md={columns.md} lg={columns.lg}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;