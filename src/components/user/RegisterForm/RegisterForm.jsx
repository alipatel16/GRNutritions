// ==================== RegisterForm.jsx ====================
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
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants/routes';
import { validateWithSchema, userRegistrationSchema } from '../../../utils/validationSchemas';

const RegisterForm = ({ onSubmit, loading = false, error = '' }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
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
    
    if (!acceptTerms) {
      setErrors({ terms: 'You must accept the terms and conditions' });
      return;
    }

    const validation = validateWithSchema(formData, userRegistrationSchema);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    await onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        label="Full Name"
        name="displayName"
        value={formData.displayName}
        onChange={handleChange}
        error={!!errors.displayName}
        helperText={errors.displayName}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person />
            </InputAdornment>
          )
        }}
      />

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
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone />
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

      <TextField
        fullWidth
        label="Confirm Password"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
        }
        label={
          <Typography variant="body2">
            I accept the{' '}
            <Link component={RouterLink} to={ROUTES.TERMS}>
              Terms & Conditions
            </Link>
          </Typography>
        }
        sx={{ mt: 1 }}
      />
      {errors.terms && (
        <Typography variant="caption" color="error" display="block">
          {errors.terms}
        </Typography>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Create Account'}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link component={RouterLink} to={ROUTES.LOGIN}>
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterForm;