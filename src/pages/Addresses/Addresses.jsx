// ==================== Addresses.jsx ====================
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import AddressManager from '../../components/user/AddressManager/AddressManager';

const Addresses = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          My Addresses
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your delivery addresses
        </Typography>
      </Box>
      
      <AddressManager selectionMode={false} />
    </Container>
  );
};

export default Addresses;