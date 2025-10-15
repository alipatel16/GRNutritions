// ==================== UserProfile.jsx ====================
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Typography,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { Save, Edit, Cancel } from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { validateWithSchema, userProfileSchema } from '../../../utils/validationSchemas';
import toast from '../../../services/notification/toast';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
    bio: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateWithSchema(formData, userProfileSchema);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await updateProfile(formData);
      toast.messages.profileUpdated();
      setEditing(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user.displayName || '',
      phoneNumber: user.phoneNumber || '',
      bio: user.bio || ''
    });
    setErrors({});
    setEditing(false);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Profile Information
          </Typography>
          {!editing && (
            <Button startIcon={<Edit />} onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{ width: 80, height: 80, mr: 2 }}
            src={user?.photoURL}
          >
            {user?.displayName?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6">{user?.displayName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                disabled={!editing}
                error={!!errors.displayName}
                helperText={errors.displayName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!editing}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                value={user?.email}
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!editing}
                multiline
                rows={3}
                error={!!errors.bio}
                helperText={errors.bio}
              />
            </Grid>
          </Grid>

          {editing && (
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserProfile;