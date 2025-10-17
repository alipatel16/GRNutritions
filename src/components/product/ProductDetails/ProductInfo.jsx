// ==================== ProductInfo.jsx ====================
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Rating,
  TextField,
  IconButton,
  Alert
} from '@mui/material';
import {
  ShoppingCart,
  FavoriteBorder,
  Add,
  Remove,
  LocalShipping,
  VerifiedUser
} from '@mui/icons-material';
import { formatPrice } from '../../../utils/helpers/formatters';

const ProductInfo = ({ product, onAddToCart, onAddToWishlist }) => {
  const [quantity, setQuantity] = useState(1);

  // Debug: Log product data to console
  React.useEffect(() => {
    console.log('ProductInfo - Product Data:', product);
    console.log('ProductInfo - Price:', product?.price, typeof product?.price);
    console.log('ProductInfo - Inventory:', product?.inventory, typeof product?.inventory);
    console.log('ProductInfo - All fields:', Object.keys(product || {}));
  }, [product]);

  // Safety check: Ensure product exists
  if (!product) {
    return (
      <Box>
        <Alert severity="error">Product data not available</Alert>
      </Box>
    );
  }

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
    }
  };

  // FIXED: Ensure price is a number
  const productPrice = Number(product.price) || 0;
  const comparePrice = Number(product.compareAtPrice) || 0;
  
  const hasDiscount = comparePrice > 0 && comparePrice > productPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((comparePrice - productPrice) / comparePrice) * 100)
    : 0;

  // FIXED: Use product.inventory instead of product.stock
  const currentInventory = Number(product.inventory) || 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        {product.name || 'Product Name Not Available'}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Rating value={product.rating || 0} precision={0.5} readOnly />
        <Typography variant="body2" color="text.secondary">
          ({product.reviewCount || 0} reviews)
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1 }}>
          <Typography variant="h3" color="primary" fontWeight="bold">
            {formatPrice(productPrice)}
          </Typography>
          {hasDiscount && (
            <>
              <Typography variant="h5" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                {formatPrice(comparePrice)}
              </Typography>
              <Chip label={`${discountPercentage}% OFF`} color="error" size="small" />
            </>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          Inclusive of all taxes
        </Typography>
      </Box>

      {product.brand && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Brand: <strong>{product.brand}</strong>
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {product.description && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description}
          </Typography>
        </Box>
      )}

      {/* FIXED: Check currentInventory (product.inventory) instead of product.stock */}
      {currentInventory > 0 ? (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="body1">Quantity:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                <Remove />
              </IconButton>
              <TextField
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(currentInventory, parseInt(e.target.value) || 1)))}
                inputProps={{ min: 1, max: currentInventory, style: { textAlign: 'center', width: 50 } }}
                variant="standard"
                InputProps={{ disableUnderline: true }}
              />
              <IconButton onClick={() => setQuantity(Math.min(currentInventory, quantity + 1))} disabled={quantity >= currentInventory}>
                <Add />
              </IconButton>
            </Box>
            {/* FIXED: Show low stock warning based on currentInventory */}
            {currentInventory < 10 && currentInventory > 0 && (
              <Typography variant="caption" color="warning.main">
                Only {currentInventory} left
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              fullWidth
            >
              Add to Cart
            </Button>
            {onAddToWishlist && (
              <IconButton size="large" onClick={() => onAddToWishlist(product)}>
                <FavoriteBorder />
              </IconButton>
            )}
          </Box>
        </>
      ) : (
        <Alert severity="error" sx={{ mb: 3 }}>
          Out of Stock
        </Alert>
      )}

      <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <LocalShipping color="primary" />
          <Typography variant="body2">
            Free shipping on orders above ₹999
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VerifiedUser color="primary" />
          <Typography variant="body2">
            100% authentic products
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductInfo;