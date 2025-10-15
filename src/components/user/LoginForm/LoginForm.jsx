// ==================== LoginForm.jsx ====================
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants/routes';
import { validateWithSchema, userLoginSchema } from '../../../utils/validationSchemas';

const LoginForm = ({ onSubmit, onGoogleSignIn, loading = false, error = '' }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateWithSchema(formData, userLoginSchema);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    await onSubmit(formData.email, formData.password);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email />
            </InputAdornment>
          )
        }}
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Link component={RouterLink} to={ROUTES.FORGOT_PASSWORD} variant="body2">
          Forgot Password?
        </Link>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Sign In'}
      </Button>

      {onGoogleSignIn && (
        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<Google />}
          onClick={onGoogleSignIn}
          disabled={loading}
        >
          Sign in with Google
        </Button>
      )}

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link component={RouterLink} to={ROUTES.REGISTER}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;