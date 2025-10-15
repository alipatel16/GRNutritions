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
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Google as GoogleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

// Hooks and contexts
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useCart } from '../../context/CartContext/CartContext';
import { useFormValidation } from '../../hooks/useFormValidation';

// Utils and constants
import { loginSchema } from '../../utils/helpers/validators';
import { ROUTES } from '../../utils/constants/routes';

// Styled components
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.light}20 0%, 
    ${theme.palette.secondary.light}20 100%)`,
  padding: theme.spacing(2)
}));

const LoginCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
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

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  
  // Context hooks
  const { login, loading, error, clearError } = useAuth();
  const { mergeGuestCart } = useCart();
  
  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
    { email: '', password: '' },
    loginSchema
  );

  // Get redirect path from location state
  const from = location.state?.from?.pathname || ROUTES.HOME;

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      const result = await login(values.email, values.password);
      
      if (result.success) {
        // Merge guest cart with user cart
        await mergeGuestCart();
        
        // Navigate to intended page or home
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Handle social login (placeholder)
  const handleGoogleLogin = async () => {
    // TODO: Implement Google OAuth
    console.log('Google login not implemented yet');
  };

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <LoginContainer>
      <LoginCard>
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
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account to continue
            </Typography>
          </LogoSection>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
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
              autoFocus={!isMobile}
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
              sx={{ mb: 3 }}
              autoComplete="current-password"
            />

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 2, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Forgot Password */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={handleForgotPassword}
                disabled={loading}
                sx={{ textDecoration: 'none' }}
              >
                Forgot your password?
              </Link>
            </Box>

            {/* Social Login Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                or continue with
              </Typography>
            </Divider>

            {/* Google Login */}
            <SocialButton
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{ mb: 3 }}
            >
              Continue with Google
            </SocialButton>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to={ROUTES.REGISTER}
                  state={{ from: location.state?.from }}
                  sx={{ fontWeight: 600 }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* Demo Credentials (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Demo Credentials:
              </Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>
                Email: demo@nutritionshop.com
              </Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>
                Password: demo123
              </Typography>
              <Button
                size="small"
                onClick={() => {
                  handleChange('email', 'demo@nutritionshop.com');
                  handleChange('password', 'demo123');
                }}
                sx={{ mt: 1 }}
              >
                Fill Demo Credentials
              </Button>
            </Box>
          )}
        </CardContent>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;