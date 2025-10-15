import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Google as GoogleIcon,
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

// Hooks and contexts
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useCart } from '../../context/CartContext/CartContext';
import { useFormValidation } from '../../hooks/useFormValidation';

// Utils and constants
import { userRegistrationSchema } from '../../utils/helpers/validators';
import { ROUTES } from '../../utils/constants/routes';

// Styled components
const RegisterContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.light}20 0%, 
    ${theme.palette.secondary.light}20 100%)`,
  padding: theme.spacing(2)
}));

const RegisterCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[8]
}));

const LogoSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(3)
}));

const SocialButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.divider,
  color: theme.palette.text.primary,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main + '08'
  }
}));

const StepContent = styled(Box)(({ theme }) => ({
  minHeight: 300,
  display: 'flex',
  flexDirection: 'column'
}));

const Register = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  
  // Context hooks
  const { register, loading, error, clearError } = useAuth();
  const { mergeGuestCart } = useCart();
  
  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Form validation
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset
  } = useFormValidation(
    {
      displayName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: ''
    },
    userRegistrationSchema
  );

  // Get redirect path from location state
  const from = location.state?.from?.pathname || ROUTES.HOME;

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Registration steps
  const steps = ['Personal Info', 'Account Details', 'Verification'];

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validate()) {
      return;
    }

    if (!acceptTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    try {
      const result = await register({
        displayName: values.displayName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber
      });
      
      if (result.success) {
        // Merge guest cart with user cart
        await mergeGuestCart();
        
        // Navigate to intended page or home
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  // Handle social registration (placeholder)
  const handleGoogleRegister = async () => {
    // TODO: Implement Google OAuth
    console.log('Google registration not implemented yet');
  };

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Step navigation
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate personal info
      if (!values.displayName || !values.phoneNumber) {
        return;
      }
    } else if (activeStep === 1) {
      // Validate account details
      if (!values.email || !values.password || !values.confirmPassword) {
        return;
      }
      if (values.password !== values.confirmPassword) {
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <StepContent>
            <TextField
              fullWidth
              label="Full Name"
              name="displayName"
              value={values.displayName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.displayName && !!errors.displayName}
              helperText={touched.displayName && errors.displayName}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
              autoComplete="name"
              autoFocus={!isMobile}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phoneNumber && !!errors.phoneNumber}
              helperText={touched.phoneNumber && errors.phoneNumber}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
              autoComplete="tel"
              placeholder="+91 9876543210"
            />
          </StepContent>
        );

      case 1:
        return (
          <StepContent>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
              autoComplete="new-password"
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && !!errors.confirmPassword}
              helperText={touched.confirmPassword && errors.confirmPassword}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
              autoComplete="new-password"
            />
          </StepContent>
        );

      case 2:
        return (
          <StepContent sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Terms & Conditions
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please review and accept our terms and conditions to complete your registration.
            </Typography>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={loading}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link component={RouterLink} to="/terms" target="_blank">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link component={RouterLink} to="/privacy" target="_blank">
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mb: 2 }}
            />
          </StepContent>
        );

      default:
        return null;
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <CardContent sx={{ p: 4 }}>
          {/* Logo and Title */}
          <LogoSection>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              🍃 NutriShop
            </Typography>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join us for premium nutrition products
            </Typography>
          </LogoSection>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
                startIcon={<BackIcon />}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !acceptTerms}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Create Account'
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={loading}
                  endIcon={<ForwardIcon />}
                >
                  Next
                </Button>
              )}
            </Box>

            {/* Social Registration (only on first step) */}
            {activeStep === 0 && (
              <>
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    or continue with
                  </Typography>
                </Divider>

                <SocialButton
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleRegister}
                  disabled={loading}
                  sx={{ mb: 3 }}
                >
                  Continue with Google
                </SocialButton>
              </>
            )}

            {/* Sign In Link */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to={ROUTES.LOGIN}
                  state={{ from: location.state?.from }}
                  sx={{ fontWeight: 600 }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;