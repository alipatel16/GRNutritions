// ==================== Checkout.jsx (page) ====================
import React from 'react';
import { Container } from '@mui/material';
import CheckoutForm from '../../components/checkout/CheckoutForm/CheckoutForm';

const Checkout = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CheckoutForm />
    </Container>
  );
};

export default Checkout;