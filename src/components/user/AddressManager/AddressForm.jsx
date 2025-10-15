// ==================== AddressForm.jsx ====================
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress
} from '@mui/material';
import { validateWithSchema, addressSchema } from '../../../utils/validationSchemas';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const AddressForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    addressType: 'home',
    isDefault: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateWithSchema(formData, addressSchema);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting address:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address Line 1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            error={!!errors.addressLine1}
            helperText={errors.addressLine1}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address Line 2 (Optional)"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.state}>
            <InputLabel>State</InputLabel>
            <Select
              name="state"
              value={formData.state}
              onChange={handleChange}
              label="State"
            >
              {INDIAN_STATES.map(state => (
                <MenuItem key={state} value={state}>{state}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            error={!!errors.pincode}
            helperText={errors.pincode}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Address Type</InputLabel>
            <Select
              name="addressType"
              value={formData.addressType}
              onChange={handleChange}
              label="Address Type"
            >
              <MenuItem value="home">Home</MenuItem>
              <MenuItem value="work">Work</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
            }
            label="Set as default address"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Save Address'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddressForm;