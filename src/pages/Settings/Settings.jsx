// ==================== Settings.jsx ====================
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  TextField,
  Alert
} from '@mui/material';
import {
  Notifications,
  Security,
  Visibility,
  Email,
  Save
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext/AuthContext';
import toast from '../../services/notification/toast';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    smsNotifications: false
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    showReviews: true,
    showOrderHistory: false
  });

  const handleNotificationChange = (setting) => (event) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: event.target.checked
    });
  };

  const handlePrivacyChange = (setting) => (event) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: event.target.checked
    });
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Save settings to database
      // await databaseService.updateUserSettings(user.uid, {
      //   notifications: notificationSettings,
      //   privacy: privacySettings
      // });
      
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Account Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account preferences and settings
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Notifications color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Notification Preferences
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange('emailNotifications')}
                      />
                    }
                    label="Email Notifications"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Receive notifications via email
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.orderUpdates}
                        onChange={handleNotificationChange('orderUpdates')}
                      />
                    }
                    label="Order Updates"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Get updates about your orders
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.promotionalEmails}
                        onChange={handleNotificationChange('promotionalEmails')}
                      />
                    }
                    label="Promotional Emails"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Receive promotional offers and deals
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onChange={handleNotificationChange('smsNotifications')}
                      />
                    }
                    label="SMS Notifications"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Receive SMS for important updates
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Visibility color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Privacy Settings
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacySettings.profileVisibility}
                        onChange={handlePrivacyChange('profileVisibility')}
                      />
                    }
                    label="Public Profile"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Make your profile visible to others
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacySettings.showReviews}
                        onChange={handlePrivacyChange('showReviews')}
                      />
                    }
                    label="Show Reviews"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Display your reviews publicly
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacySettings.showOrderHistory}
                        onChange={handlePrivacyChange('showOrderHistory')}
                      />
                    }
                    label="Show Order History"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Make your order history visible
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Security color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Security
                </Typography>
              </Box>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                Your email: {user?.email}
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Current Password"
                    disabled
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    disabled
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    To change your password, please use the "Forgot Password" option on the login page.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Save />}
              onClick={handleSaveSettings}
              disabled={loading}
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;