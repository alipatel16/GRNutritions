import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useCart } from '../../context/CartContext/CartContext';
import CheckoutForm from '../../components/checkout/CheckoutForm/CheckoutForm';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { ROUTES } from '../../utils/constants/routes';

const CheckoutContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  minHeight: '80vh'
}));

const Checkout = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { items, loading: cartLoading } = useCart();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      navigate(ROUTES.LOGIN, { 
        state: { from: { pathname: ROUTES.CHECKOUT } } 
      });
      return;
    }

    // Redirect to cart if cart is empty
    if (!cartLoading && (!items || items.length === 0)) {
      navigate(ROUTES.CART);
      return;
    }
  }, [user, items, authLoading, cartLoading, navigate]);

  if (authLoading || cartLoading) {
    return <LoadingSpinner message="Loading checkout..." />;
  }

  if (!user) {
    return null;
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <CheckoutContainer maxWidth="lg">
      <CheckoutForm />
    </CheckoutContainer>
  );
};

export default Checkout;