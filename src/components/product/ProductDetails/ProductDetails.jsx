// ==================== ProductDetails.jsx ====================
import React from 'react';
import { Box, Grid, Container } from '@mui/material';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductReviews from './ProductReviews';

const ProductDetails = ({ product, onAddToCart, onAddToWishlist }) => {
  
  // Normalize images to ensure compatibility with both formats
  const getProductImages = () => {
    // If product has images array (new base64 format)
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    
    // If product has single image property (legacy format)
    if (product.image) {
      return [product.image];
    }
    
    // No images available
    return [];
  };

  const productImages = getProductImages();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images Gallery */}
        <Grid item xs={12} md={6}>
          <ProductImageGallery 
            images={productImages}
            productName={product.name || 'Product'}
          />
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <ProductInfo 
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
          />
        </Grid>

        {/* Product Reviews */}
        <Grid item xs={12}>
          <ProductReviews productId={product.id} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;