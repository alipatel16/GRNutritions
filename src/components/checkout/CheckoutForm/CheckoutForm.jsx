// ==================== CheckoutForm.jsx ====================
import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Alert
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import AddressManager from '../../user/AddressManager/AddressManager';
import PaymentForm from '../../checkout/PaymentForm/PaymentForm';
import OrderSummary from '../OrderSummary/OrderSummary';
import { useCart } from '../../../context/CartContext/CartContext';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants/routes';

const steps = ['Shipping Address', 'Payment', 'Review Order'];

const CheckoutForm = () => {
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!items || items.length === 0) {
      navigate(ROUTES.CART);
    }
  }, [items, navigate]);

  const handleNext = () => {
    if (activeStep === 0 && !shippingAddress) {
      setError('Please select a shipping address');
      return;
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddressSelect = (address) => {
    setShippingAddress(address);
  };

  const handlePlaceOrder = async (paymentDetails) => {
    try {
      // Create order with payment details
      const orderData = {
        userId: user.uid,
        items,
        shippingAddress,
        paymentMethod,
        paymentDetails,
        totalAmount,
        status: 'pending'
      };

      // Process order (this would call your backend/Firebase)
      // const result = await databaseService.createOrder(orderData);
      
      // Clear cart
      await clearCart();
      
      // Navigate to success page
      navigate(ROUTES.PAYMENT_SUCCESS, {
        state: { orderId: 'ORDER_ID', paymentId: 'PAYMENT_ID' }
      });
    } catch (err) {
      setError(err.message || 'Failed to place order');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <AddressManager
            onSelectAddress={handleAddressSelect}
            selectionMode={true}
          />
        );
      case 1:
        return (
          <PaymentForm
            amount={totalAmount}
            onPaymentSelect={setPaymentMethod}
            selectedMethod={paymentMethod}
          />
        );
      case 2:
        return (
          <OrderSummary
            items={items}
            shippingAddress={shippingAddress}
            paymentMethod={paymentMethod}
            onPlaceOrder={handlePlaceOrder}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
          
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForward />}
            >
              Continue
            </Button>
          ) : null}
        </Box>
      </Paper>
    </Box>
  );
};

export default CheckoutForm;