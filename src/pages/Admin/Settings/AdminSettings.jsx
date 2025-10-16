// ==================== AdminSettings.jsx ====================
// Location: src/pages/AdminSettings/AdminSettings.jsx

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Sync as SyncIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import InventorySync from '../../../components/admin/InventorySync/InventorySync';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const AdminSettings = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Nutrition Shop',
    siteEmail: 'admin@nutritionshop.com',
    supportPhone: '+91-9876543210',
    enableRegistration: true,
    enableGuestCheckout: true,
    maintenanceMode: false
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    reviewNotifications: true
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    enableTwoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setSaveSuccess(false);
  };

  const handleGeneralSettingChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationSettingChange = (field) => (event) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handleSecuritySettingChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setSaveSuccess(false);

    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would actually save to Firebase/backend
      // await databaseService.updateSettings(...)
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Admin Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your store settings and configurations
        </Typography>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<SettingsIcon />} label="General" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
          <Tab icon={<SecurityIcon />} label="Security" />
          <Tab icon={<SyncIcon />} label="Inventory Sync" />
          <Tab icon={<StorageIcon />} label="Database" />
        </Tabs>

        {/* General Settings Tab */}
        <TabPanel value={currentTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Site Name"
                value={generalSettings.siteName}
                onChange={handleGeneralSettingChange('siteName')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Site Email"
                type="email"
                value={generalSettings.siteEmail}
                onChange={handleGeneralSettingChange('siteEmail')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Support Phone"
                value={generalSettings.supportPhone}
                onChange={handleGeneralSettingChange('supportPhone')}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Features
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={generalSettings.enableRegistration}
                    onChange={handleGeneralSettingChange('enableRegistration')}
                  />
                }
                label="Enable User Registration"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={generalSettings.enableGuestCheckout}
                    onChange={handleGeneralSettingChange('enableGuestCheckout')}
                  />
                }
                label="Enable Guest Checkout"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={generalSettings.maintenanceMode}
                    onChange={handleGeneralSettingChange('maintenanceMode')}
                    color="warning"
                  />
                }
                label="Maintenance Mode"
              />
              {generalSettings.maintenanceMode && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Site will be unavailable to customers when maintenance mode is enabled
                </Alert>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={handleSaveSettings}
                  disabled={loading}
                >
                  Save Settings
                </Button>
              </Box>
              {saveSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Settings saved successfully!
                </Alert>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={currentTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onChange={handleNotificationSettingChange('emailNotifications')}
                  />
                }
                label="Enable Email Notifications"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Send email notifications for important events
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.orderNotifications}
                    onChange={handleNotificationSettingChange('orderNotifications')}
                  />
                }
                label="Order Notifications"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Receive notifications when new orders are placed
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.lowStockAlerts}
                    onChange={handleNotificationSettingChange('lowStockAlerts')}
                  />
                }
                label="Low Stock Alerts"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Get notified when products are running low on stock
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.reviewNotifications}
                    onChange={handleNotificationSettingChange('reviewNotifications')}
                  />
                }
                label="Review Notifications"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Receive alerts for new customer reviews
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={handleSaveSettings}
                  disabled={loading}
                >
                  Save Settings
                </Button>
              </Box>
              {saveSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Settings saved successfully!
                </Alert>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={currentTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.requireEmailVerification}
                    onChange={handleSecuritySettingChange('requireEmailVerification')}
                  />
                }
                label="Require Email Verification"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Users must verify their email before accessing the account
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.enableTwoFactor}
                    onChange={handleSecuritySettingChange('enableTwoFactor')}
                  />
                }
                label="Enable Two-Factor Authentication"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Add an extra layer of security with 2FA
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Session Timeout (minutes)"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={handleSecuritySettingChange('sessionTimeout')}
                helperText="Auto logout after this period of inactivity"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Max Login Attempts"
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={handleSecuritySettingChange('maxLoginAttempts')}
                helperText="Lock account after this many failed attempts"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={handleSaveSettings}
                  disabled={loading}
                >
                  Save Settings
                </Button>
              </Box>
              {saveSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Settings saved successfully!
                </Alert>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Inventory Sync Tab */}
        <TabPanel value={currentTab} index={3}>
          <InventorySync />
        </TabPanel>

        {/* Database Tab */}
        <TabPanel value={currentTab} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Database Maintenance
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Clear Cache
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Clear all cached data to free up memory and ensure fresh data loads
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Clear Cache
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Backup Database
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create a backup of your database for safety
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Create Backup
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Optimize Database
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Optimize database performance and clean up orphaned records
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="warning">
                    Optimize Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ border: '1px solid', borderColor: 'error.main' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="error">
                    Reset Database
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ⚠️ Warning: This will delete all data permanently
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="error">
                    Reset Database
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminSettings;