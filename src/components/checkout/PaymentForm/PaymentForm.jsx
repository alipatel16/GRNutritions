// ==================== PaymentForm.jsx ====================
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  Payment,
  AccountBalance,
  CreditCard
} from '@mui/icons-material';
import { formatPrice } from '../../../utils/helpers/formatters';

const PaymentForm = ({ amount, onPaymentSelect, selectedMethod }) => {
  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay (UPI, Cards, Net Banking)',
      icon: <Payment />,
      description: 'Secure payment via Razorpay gateway'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <AccountBalance />,
      description: 'Pay when you receive the order'
    }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Payment Method
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Total Amount: <strong>{formatPrice(amount)}</strong>
      </Alert>

      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          value={selectedMethod}
          onChange={(e) => onPaymentSelect(e.target.value)}
        >
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              sx={{
                mb: 2,
                cursor: 'pointer',
                border: selectedMethod === method.id ? 2 : 1,
                borderColor: selectedMethod === method.id ? 'primary.main' : 'divider'
              }}
              onClick={() => onPaymentSelect(method.id)}
            >
              <CardContent>
                <FormControlLabel
                  value={method.id}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {method.icon}
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {method.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {method.description}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </CardContent>
            </Card>
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default PaymentForm;