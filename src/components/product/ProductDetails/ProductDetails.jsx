// ==================== ProductDetails.jsx ====================
import React, { useState } from 'react';
import { Box, Grid, Container } from '@mui/material';
import ProductImages from './ProductImages';
import ProductInfo from './ProductInfo';
import ProductReviews from './ProductReviews';

const ProductDetails = ({ product, onAddToCart, onAddToWishlist }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <ProductImages images={product.images || [product.image]} />
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