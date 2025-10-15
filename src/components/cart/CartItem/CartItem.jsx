import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
  Divider,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  FavoriteBorder as WishlistIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

// Utils
import { formatPrice } from '../../../utils/helpers/formatters';
import { ROUTES, ROUTE_BUILDERS } from '../../../utils/constants/routes';

// Styled components
const CartItemCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '&:last-child': {
    marginBottom: 0
  },
  boxShadow: theme.shadows[1],
  '&:hover': {
    boxShadow: theme.shadows[3]
  },
  transition: 'box-shadow 0.2s ease-in-out'
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  width: 120,
  height: 120,
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('sm')]: {
    width: 80,
    height: 80
  }
}));

const QuantityControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5)
}));

const QuantityInput = styled(TextField)(({ theme }) => ({
  '& input': {
    textAlign: 'center',
    padding: theme.spacing(0.5, 1),
    width: '40px'
  },
  '& fieldset': {
    border: 'none'
  }
}));

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  onMoveToWishlist,
  disabled = false 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > item.maxQuantity || disabled) return;

    setQuantity(newQuantity);
    setUpdating(true);
    
    try {
      await onUpdateQuantity(item.productId, newQuantity);
    } catch (error) {
      setQuantity(item.quantity); // Revert on error
    } finally {
      setUpdating(false);
    }
  };

  const handleIncrement = () => {
    handleQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    handleQuantityChange(quantity - 1);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= item.maxQuantity) {
      handleQuantityChange(value);
    }
  };

  const handleRemove = async () => {
    if (disabled) return;
    
    setUpdating(true);
    try {
      await onRemove(item.productId);
    } finally {
      setUpdating(false);
    }
  };

  const handleMoveToWishlist = async () => {
    if (disabled || !onMoveToWishlist) return;
    
    setUpdating(true);
    try {
      await onMoveToWishlist(item.productId);
    } finally {
      setUpdating(false);
    }
  };

  const totalPrice = item.price * quantity;
  const hasDiscount = item.compareAtPrice && item.compareAtPrice > item.price;
  const discountPercentage = hasDiscount
    ? Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100)
    : 0;

  return (
    <CartItemCard>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Product Image */}
          <Grid item xs={3} sm={2}>
            <Link to={ROUTE_BUILDERS.productDetail(item.productId)}>
              <ProductImage
                component="img"
                image={item.image || '/images/placeholder-product.png'}
                alt={item.name}
              />
            </Link>
          </Grid>

          {/* Product Details */}
          <Grid item xs={9} sm={isMobile ? 10 : 4}>
            <Link 
              to={ROUTE_BUILDERS.productDetail(item.productId)}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                {item.name}
              </Typography>
            </Link>
            
            {item.brand && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Brand: {item.brand}
              </Typography>
            )}

            {item.variant && (
              <Typography variant="body2" color="text.secondary">
                {item.variant}
              </Typography>
            )}

            {hasDiscount && (
              <Chip
                label={`${discountPercentage}% OFF`}
                color="error"
                size="small"
                sx={{ mt: 0.5 }}
              />
            )}

            {item.stock < 10 && item.stock > 0 && (
              <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 0.5 }}>
                Only {item.stock} left in stock
              </Typography>
            )}

            {item.stock === 0 && (
              <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5 }}>
                Out of stock
              </Typography>
            )}
          </Grid>

          {/* Price and Quantity - Desktop */}
          {!isMobile && (
            <>
              <Grid item sm={2}>
                <Box>
                  {hasDiscount && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textDecoration: 'line-through' }}
                    >
                      {formatPrice(item.compareAtPrice)}
                    </Typography>
                  )}
                  <Typography variant="h6" color="primary">
                    {formatPrice(item.price)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item sm={2}>
                <QuantityControl>
                  <IconButton
                    size="small"
                    onClick={handleDecrement}
                    disabled={quantity <= 1 || updating || disabled}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <QuantityInput
                    type="number"
                    value={quantity}
                    onChange={handleInputChange}
                    disabled={updating || disabled}
                    size="small"
                    inputProps={{ min: 1, max: item.maxQuantity }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleIncrement}
                    disabled={quantity >= item.maxQuantity || updating || disabled}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </QuantityControl>
              </Grid>

              <Grid item sm={2}>
                <Typography variant="h6" fontWeight="bold">
                  {formatPrice(totalPrice)}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>

        {/* Mobile Price and Quantity */}
        {isMobile && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                {hasDiscount && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    {formatPrice(item.compareAtPrice)}
                  </Typography>
                )}
                <Typography variant="h6" color="primary">
                  {formatPrice(item.price)}
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold">
                {formatPrice(totalPrice)}
              </Typography>
            </Box>

            <QuantityControl sx={{ width: 'fit-content' }}>
              <IconButton
                size="small"
                onClick={handleDecrement}
                disabled={quantity <= 1 || updating || disabled}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <QuantityInput
                type="number"
                value={quantity}
                onChange={handleInputChange}
                disabled={updating || disabled}
                size="small"
                inputProps={{ min: 1, max: item.maxQuantity }}
              />
              <IconButton
                size="small"
                onClick={handleIncrement}
                disabled={quantity >= item.maxQuantity || updating || disabled}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </QuantityControl>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {onMoveToWishlist && (
            <Button
              size="small"
              startIcon={<WishlistIcon />}
              onClick={handleMoveToWishlist}
              disabled={updating || disabled}
            >
              Move to Wishlist
            </Button>
          )}
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleRemove}
            disabled={updating || disabled}
          >
            Remove
          </Button>
        </Box>
      </CardContent>
    </CartItemCard>
  );
};

export default CartItem;