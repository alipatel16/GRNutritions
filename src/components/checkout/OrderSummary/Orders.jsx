// ==================== Orders.jsx (page) ====================
import React from 'react';
import { Container } from '@mui/material';
import OrderHistory from '../../components/user/OrderHistory/OrderHistory';

const Orders = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <OrderHistory />
    </Container>
  );
};

export default Orders;