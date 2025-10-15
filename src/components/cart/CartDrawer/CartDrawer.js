import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  ShoppingCart as CartIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingBag as ShopIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Hooks and contexts
import { useCart } from '../../../context/CartContext/CartContext';
import { useApp } from '../../../context/AppContext/AppProvider';
import { useAuth } from '../../../context/AuthContext/AuthContext';

// Utils
import { formatPrice } from '../../../utils/helpers/formatters';
import { ROUTES } from '../../../utils/constants/routes';

// Styled components
const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const DrawerContent = styled(Box)(({ theme }) => ({
  width: 400,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    width: '100vw'
  }
}));

const CartItemsList = styled(List)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: 0
}));

const CartItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  alignItems: 'flex-start'
}));

const QuantityControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1)
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
  size: 'small',
  padding: theme.spacing(0.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08)
  }
}));

const EmptyCart = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: theme.spacing(4),
  textAlign: 'center'
}));

const CartSummary = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.02)
}));

const SummaryRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '&:last-child': {
    marginBottom: 0
  }
}));

const CartDrawer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // Context hooks
  const { 
    items, 
    totalItems, 
    subtotal, 
    tax, 
    shipping, 
    totalAmount,
    updateQuantity, 
    removeFromCart,
    loading 
  } = useCart();
  
  const { ui, toggleCart } = useApp();
  const { isAuthenticated } = useAuth();

  const isOpen = ui.cartOpen;

  const handleClose = () => {
    toggleCart(false);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      handleClose();
      navigate(ROUTES.LOGIN);
      return;
    }
    
    handleClose();
    navigate(ROUTES.CHECKOUT);
  };

  const handleViewCart = () => {
    handleClose();
    navigate(ROUTES.CART);
  };

  const handleContinueShopping = () => {
    handleClose();
    navigate(ROUTES.PRODUCTS);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const renderCartItem = (item) => (
    <CartItem key={item.productId}>
      <ListItemAvatar>
        <Avatar
          src={item.image}
          alt={item.name}
          variant="rounded"
          sx={{ width: 56, height: 56 }}
        >
          {item.name.charAt(0)}
        </Avatar>
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <Typography variant="subtitle2" fontWeight={600}>
            {item.name}
          </Typography>
        }
        secondary={
          <Box>
            <Typography variant="body2" color="primary" fontWeight={500}>
              {formatPrice(item.price)}
            </Typography>
            
            <QuantityControls>
              <QuantityButton
                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                disabled={loading}
                size="small"
              >
                <RemoveIcon fontSize="small" />
              </QuantityButton>
              
              <Typography variant="body2" sx={{ minWidth: 24, textAlign: 'center' }}>
                {item.quantity}
              </Typography>
              
              <QuantityButton
                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                disabled={loading || item.quantity >= (item.maxQuantity || 99)}
                size="small"
              >
                <AddIcon fontSize="small" />
              </QuantityButton>
              
              <IconButton
                onClick={() => handleRemoveItem(item.productId)}
                disabled={loading}
                size="small"
                color="error"
                sx={{ ml: 1 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </QuantityControls>
          </Box>
        }
      />
    </CartItem>
  );

  const renderEmptyCart = () => (
    <EmptyCart>
      <CartIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Your cart is empty
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Add some products to get started
      </Typography>
      <Button
        variant="contained"
        startIcon={<ShopIcon />}
        onClick={handleContinueShopping}
      >
        Continue Shopping
      </Button>
    </EmptyCart>
  );

  const renderCartSummary = () => (
    <CartSummary>
      <SummaryRow>
        <Typography variant="body2">Subtotal:</Typography>
        <Typography variant="body2" fontWeight={500}>
          {formatPrice(subtotal)}
        </Typography>
      </SummaryRow>
      
      {tax > 0 && (
        <SummaryRow>
          <Typography variant="body2">Tax (GST):</Typography>
          <Typography variant="body2" fontWeight={500}>
            {formatPrice(tax)}
          </Typography>
        </SummaryRow>
      )}
      
      {shipping > 0 && (
        <SummaryRow>
          <Typography variant="body2">Shipping:</Typography>
          <Typography variant="body2" fontWeight={500}>
            {formatPrice(shipping)}
          </Typography>
        </SummaryRow>
      )}
      
      <Divider sx={{ my: 1 }} />
      
      <SummaryRow>
        <Typography variant="subtitle1" fontWeight={600}>
          Total:
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} color="primary">
          {formatPrice(totalAmount)}
        </Typography>
      </SummaryRow>
      
      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexDirection: 'column' }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleCheckout}
          disabled={loading}
        >
          {isAuthenticated ? 'Checkout' : 'Login to Checkout'}
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          onClick={handleViewCart}
          disabled={loading}
        >
          View Cart
        </Button>
      </Box>
    </CartSummary>
  );

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      ModalProps={{
        keepMounted: true // Better mobile performance
      }}
      PaperProps={{
        sx: {
          width: isMobile ? '100vw' : 400,
          maxWidth: '100vw'
        }
      }}
    >
      <DrawerContent>
        {/* Header */}
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge badgeContent={totalItems} color="primary">
              <CartIcon />
            </Badge>
            <Typography variant="h6" fontWeight={600}>
              Shopping Cart
            </Typography>
          </Box>
          
          <IconButton onClick={handleClose} edge="end">
            <CloseIcon />
          </IconButton>
        </DrawerHeader>

        {/* Content */}
        {items.length === 0 ? (
          renderEmptyCart()
        ) : (
          <>
            <CartItemsList>
              {items.map(renderCartItem)}
            </CartItemsList>
            
            {renderCartSummary()}
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;