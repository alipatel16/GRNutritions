import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  LocalOffer as CouponIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Utils
import { formatPrice } from '../../../utils/helpers/formatters';
import { ROUTES } from '../../../utils/constants/routes';
import { BUSINESS_CONSTANTS } from '../../../utils/constants/orderStatus';

// Hooks
import { useAuth } from '../../../context/AuthContext/AuthContext';

// Styled components
const SummaryCard = styled(Card)(({ theme }) => ({
  position: 'sticky',
  top: theme.spacing(10),
  boxShadow: theme.shadows[3]
}));

const SummaryRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1.5)
}));

const TotalRow = styled(SummaryRow)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  marginTop: theme.spacing(2),
  borderTop: `2px solid ${theme.palette.divider}`
}));

const CartSummary = ({
  subtotal,
  tax,
  shipping,
  discount = 0,
  totalAmount,
  totalItems,
  onApplyCoupon,
  onRemoveCoupon,
  appliedCoupon = null,
  isLoading = false,
  showCheckoutButton = true
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setApplyingCoupon(true);
    setCouponError('');

    try {
      const result = await onApplyCoupon(couponCode);
      if (!result.success) {
        setCouponError(result.message || 'Invalid coupon code');
      } else {
        setCouponCode('');
      }
    } catch (error) {
      setCouponError('Failed to apply coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await onRemoveCoupon();
      setCouponCode('');
      setCouponError('');
    } catch (error) {
      console.error('Error removing coupon:', error);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: ROUTES.CHECKOUT } });
      return;
    }
    navigate(ROUTES.CHECKOUT);
  };

  const savingsAmount = discount + (subtotal - (totalAmount - tax - shipping));
  const freeShippingThreshold = BUSINESS_CONSTANTS.ORDER_LIMITS.MIN_ORDER_AMOUNT;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;

  return (
    <SummaryCard>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Order Summary
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Price Breakdown */}
        <SummaryRow>
          <Typography variant="body1">
            Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {formatPrice(subtotal)}
          </Typography>
        </SummaryRow>

        {discount > 0 && (
          <SummaryRow>
            <Typography variant="body1" color="success.main">
              Discount
            </Typography>
            <Typography variant="body1" color="success.main" fontWeight="medium">
              -{formatPrice(discount)}
            </Typography>
          </SummaryRow>
        )}

        <SummaryRow>
          <Typography variant="body1">Shipping</Typography>
          <Typography variant="body1" fontWeight="medium">
            {shipping === 0 ? (
              <Box component="span" color="success.main">
                FREE
              </Box>
            ) : (
              formatPrice(shipping)
            )}
          </Typography>
        </SummaryRow>

        <SummaryRow>
          <Typography variant="body1">Tax (GST)</Typography>
          <Typography variant="body1" fontWeight="medium">
            {formatPrice(tax)}
          </Typography>
        </SummaryRow>

        <TotalRow>
          <Typography variant="h6" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {formatPrice(totalAmount)}
          </Typography>
        </TotalRow>

        {savingsAmount > 0 && (
          <Box sx={{ mt: 2 }}>
            <Chip
              icon={<CheckIcon />}
              label={`You saved ${formatPrice(savingsAmount)}!`}
              color="success"
              sx={{ width: '100%' }}
            />
          </Box>
        )}

        {/* Free Shipping Progress */}
        {!qualifiesForFreeShipping && amountForFreeShipping > 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Add {formatPrice(amountForFreeShipping)} more to get FREE shipping!
          </Alert>
        )}

        {qualifiesForFreeShipping && shipping === 0 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            You've qualified for FREE shipping!
          </Alert>
        )}

        {/* Coupon Section */}
        {onApplyCoupon && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Have a coupon code?
            </Typography>

            {appliedCoupon ? (
              <Chip
                icon={<CouponIcon />}
                label={`${appliedCoupon.code} - ${formatPrice(appliedCoupon.discount)} off`}
                onDelete={handleRemoveCoupon}
                color="success"
                sx={{ width: '100%', mt: 1 }}
              />
            ) : (
              <>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={applyingCoupon}
                    error={!!couponError}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CouponIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode.trim()}
                  >
                    {applyingCoupon ? <CircularProgress size={20} /> : 'Apply'}
                  </Button>
                </Box>
                {couponError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {couponError}
                  </Typography>
                )}
              </>
            )}
          </Box>
        )}

        {/* Checkout Button */}
        {showCheckoutButton && (
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleCheckout}
            disabled={isLoading || totalItems === 0}
            startIcon={<CartIcon />}
            sx={{ mt: 3 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Proceed to Checkout'
            )}
          </Button>
        )}

        {/* Security Note */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            🔒 Secure checkout powered by Razorpay
          </Typography>
        </Box>
      </CardContent>
    </SummaryCard>
  );
};

export default CartSummary;