import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Avatar,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  Alert,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingBag as ShopIcon,
  Security as SecurityIcon,
  LocalShipping as ShippingIcon,
  ArrowForward as ArrowIcon,
  Discount as CouponIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// Hooks and contexts
import { useCart } from '../../context/CartContext/CartContext';
import { useAuth } from '../../context/AuthContext/AuthContext';

// Utils
import { formatPrice } from '../../utils/helpers/formatters';
import { ROUTES } from '../../utils/constants/routes';
import { BUSINESS_CONSTANTS } from '../../utils/constants/orderStatus';

// Styled components
const CartContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4)
}));

const CartItemCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

const QuantityControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden'
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 0,
  padding: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const SummaryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  position: 'sticky',
  top: theme.spacing(2),
  height: 'fit-content'
}));

const TrustBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main
  }
}));

const EmptyCartContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 2),
  minHeight: '60vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}));

const Cart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // Context hooks
  const {
    items,
    totalItems,
    subtotal,
    tax,
    shipping,
    totalAmount,
    loading,
    updateQuantity,
    removeFromCart,
    validateCart
  } = useCart();
  
  const { isAuthenticated } = useAuth();

  // Handle quantity changes
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  // Handle remove item
  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: { pathname: ROUTES.CHECKOUT } } });
      return;
    }

    // Validate cart before proceeding
    const validation = await validateCart();
    if (!validation.valid) {
      // Show validation errors
      alert(validation.errors.join('\n'));
      return;
    }

    navigate(ROUTES.CHECKOUT);
  };

  // Continue shopping
  const handleContinueShopping = () => {
    navigate(ROUTES.PRODUCTS);
  };

  // Generate breadcrumbs
  const breadcrumbs = [
    <Link key="home" component={RouterLink} to="/" color="inherit">
      Home
    </Link>,
    <Link key="products" component={RouterLink} to="/products" color="inherit">
      Products
    </Link>,
    <Typography key="cart" color="text.primary">
      Shopping Cart
    </Typography>
  ];

  // Render empty cart
  const renderEmptyCart = () => (
    <EmptyCartContainer>
      <ShopIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Your cart is empty
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Looks like you haven't added any items to your cart yet.
        Discover our amazing nutrition products!
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<ShopIcon />}
        onClick={handleContinueShopping}
        sx={{ mt: 2 }}
      >
        Start Shopping
      </Button>
    </EmptyCartContainer>
  );

  // Render cart item
  const renderCartItem = (item) => (
    <CartItemCard key={item.productId} elevation={1}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Product Image */}
          <Grid item xs={3} sm={2}>
            <Avatar
              src={item.image}
              alt={item.name}
              variant="rounded"
              sx={{ width: 80, height: 80 }}
            >
              {item.name.charAt(0)}
            </Avatar>
          </Grid>

          {/* Product Details */}
          <Grid item xs={9} sm={4}>
            <Typography variant="h6" gutterBottom>
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Price: {formatPrice(item.price)}
            </Typography>
            {item.maxQuantity && item.quantity >= item.maxQuantity && (
              <Typography variant="caption" color="warning.main">
                Maximum quantity reached
              </Typography>
            )}
          </Grid>

          {/* Quantity Controls */}
          <Grid item xs={6} sm={3}>
            <QuantityControl>
              <QuantityButton
                size="small"
                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                disabled={loading}
              >
                <RemoveIcon fontSize="small" />
              </QuantityButton>
              
              <TextField
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 1;
                  if (newQuantity !== item.quantity) {
                    handleQuantityChange(item.productId, newQuantity);
                  }
                }}
                inputProps={{
                  min: 1,
                  max: item.maxQuantity || 99,
                  style: { textAlign: 'center', width: 60 }
                }}
                variant="outlined"
                size="small"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' }
                  }
                }}
              />
              
              <QuantityButton
                size="small"
                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                disabled={loading || (item.maxQuantity && item.quantity >= item.maxQuantity)}
              >
                <AddIcon fontSize="small" />
              </QuantityButton>
            </QuantityControl>
          </Grid>

          {/* Total & Actions */}
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {formatPrice(item.price * item.quantity)}
              </Typography>
              <IconButton
                color="error"
                onClick={() => handleRemoveItem(item.productId)}
                disabled={loading}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </CartItemCard>
  );

  // Render cart summary
  const renderCartSummary = () => (
    <SummaryCard elevation={2}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Order Summary
      </Typography>

      {/* Summary Details */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">
            Subtotal ({totalItems} items):
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {formatPrice(subtotal)}
          </Typography>
        </Box>

        {shipping > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Shipping:</Typography>
            <Typography variant="body2" fontWeight={500}>
              {formatPrice(shipping)}
            </Typography>
          </Box>
        )}

        {shipping === 0 && subtotal >= BUSINESS_CONSTANTS.ORDER_LIMITS.MIN_ORDER_AMOUNT && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="success.main">
              Shipping (Free):
            </Typography>
            <Typography variant="body2" fontWeight={500} color="success.main">
              ₹0
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Tax (GST):</Typography>
          <Typography variant="body2" fontWeight={500}>
            {formatPrice(tax)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Total:
          </Typography>
          <Typography variant="h6" fontWeight={600} color="primary">
            {formatPrice(totalAmount)}
          </Typography>
        </Box>
      </Box>

      {/* Minimum Order Alert */}
      {subtotal < BUSINESS_CONSTANTS.ORDER_LIMITS.MIN_ORDER_AMOUNT && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Add {formatPrice(BUSINESS_CONSTANTS.ORDER_LIMITS.MIN_ORDER_AMOUNT - subtotal)} more 
          for free shipping and to meet minimum order requirement.
        </Alert>
      )}

      {/* Coupon Code */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Enter coupon code"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CouponIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button size="small">Apply</Button>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Checkout Button */}
      <Button
        fullWidth
        variant="contained"
        size="large"
        endIcon={<ArrowIcon />}
        onClick={handleCheckout}
        disabled={loading || totalItems === 0}
        sx={{ mb: 2, py: 1.5 }}
      >
        {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
      </Button>

      {/* Continue Shopping */}
      <Button
        fullWidth
        variant="outlined"
        onClick={handleContinueShopping}
        disabled={loading}
      >
        Continue Shopping
      </Button>

      {/* Trust Badges */}
      <Box sx={{ mt: 3 }}>
        <TrustBadge>
          <SecurityIcon />
          <Typography variant="caption">
            Secure 256-bit SSL encryption
          </Typography>
        </TrustBadge>
        
        <TrustBadge>
          <ShippingIcon />
          <Typography variant="caption">
            Free shipping on orders over ₹999
          </Typography>
        </TrustBadge>
      </Box>
    </SummaryCard>
  );

  return (
    <CartContainer maxWidth="lg">
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        {breadcrumbs}
      </Breadcrumbs>

      {/* Page Header */}
      <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
        Shopping Cart
      </Typography>

      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <Typography variant="body1" color="text.secondary" paragraph>
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </Typography>

          <Grid container spacing={3}>
            {/* Cart Items */}
            <Grid item xs={12} md={8}>
              {items.map(renderCartItem)}
            </Grid>

            {/* Cart Summary */}
            <Grid item xs={12} md={4}>
              {renderCartSummary()}
            </Grid>
          </Grid>
        </>
      )}
    </CartContainer>
  );
};

export default Cart;