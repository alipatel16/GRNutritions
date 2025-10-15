import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  AdminPanelSettings
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { loginSchema } from '../../utils/helpers/validators';
import { ROUTES } from '../../utils/constants/routes';

const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.dark}20 0%, 
    ${theme.palette.secondary.dark}20 100%)`,
  padding: theme.spacing(2)
}));

const LoginCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 420,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[12]
}));

const AdminIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2)
}));

const AdminLogin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const { login, user, loading, error: authError, clearError } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate
  } = useFormValidation(
    { email: '', password: '' },
    loginSchema
  );

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    // Redirect if already logged in as admin
    if (user && user.role === 'admin') {
      navigate(ROUTES.ADMIN_DASHBOARD);
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginError('');
    
    if (!validate()) {
      return;
    }

    try {
      const result = await login(values.email, values.password);
      
      if (result.success) {
        // Check if user has admin role
        if (result.user && result.user.role === 'admin') {
          navigate(ROUTES.ADMIN_DASHBOARD);
        } else {
          setLoginError('Access denied. Admin privileges required.');
          // Optionally log out the non-admin user
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Invalid email or password');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <CardContent sx={{ p: 4 }}>
          <AdminIcon>
            <AdminPanelSettings 
              sx={{ 
                fontSize: 64, 
                color: 'primary.main' 
              }} 
            />
          </AdminIcon>

          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom 
            fontWeight={700}
          >
            Admin Login
          </Typography>
          
          <Typography 
            variant="body2" 
            align="center" 
            color="text.secondary" 
            paragraph
          >
            Sign in to access the admin dashboard
          </Typography>

          {(authError || loginError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {authError || loginError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
              margin="normal"
              autoComplete="email"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                )
              }}
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
              margin="normal"
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="caption">
              <strong>Admin access only.</strong> If you're a customer, please use the regular login page.
            </Typography>
          </Alert>
        </CardContent>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLogin;