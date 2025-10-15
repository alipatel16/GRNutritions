// ==================== PaymentFailure.jsx (page) ====================
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent
} from '@mui/material';
import {
  Error as ErrorIcon,
  Home as HomeIcon,
  Refresh as RetryIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants/routes';

const FailureContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  textAlign: 'center'
}));

const ErrorIconStyled = styled(ErrorIcon)(({ theme }) => ({
  fontSize: 80,
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2)
}));

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error, orderId } = location.state || {};

  const handleRetry = () => {
    navigate(ROUTES.CHECKOUT);
  };

  const handleGoHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <FailureContainer maxWidth="sm">
      <Card>
        <CardContent sx={{ py: 6 }}>
          <ErrorIconStyled />
          
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Payment Failed
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            {error || 'We were unable to process your payment. Please try again.'}
          </Typography>

          {orderId && (
            <Typography variant="body2" color="text.secondary" paragraph>
              Order ID: {orderId}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<RetryIcon />}
              onClick={handleRetry}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
            >
              Go to Home
            </Button>
          </Box>

          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Need help? Contact our support team
            </Typography>
            <Typography variant="body2" color="primary" fontWeight="bold">
              support@nutritionshop.com
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </FailureContainer>
  );
};

export default PaymentFailure;