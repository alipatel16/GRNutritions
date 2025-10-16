// ==================== InventorySync.jsx ====================
// Location: src/components/admin/InventorySync/InventorySync.jsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Divider,
  Chip
} from '@mui/material';
import {
  Sync as SyncIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Storage as StorageIcon
} from '@mui/icons-material';
import databaseService from '../../../services/firebase/database';

const InventorySync = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleSync = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const syncResult = await databaseService.syncAllProductsInventory();
      
      clearInterval(progressInterval);
      setProgress(100);

      if (syncResult.success) {
        setResult(syncResult);
      } else {
        setError(syncResult.error || 'Sync failed');
      }
    } catch (err) {
      console.error('Sync error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <StorageIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="h5" gutterBottom>
              Inventory Sync Utility
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Synchronize product data with inventory collection
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            <strong>What does this do?</strong>
          </Typography>
          <Typography variant="body2">
            This utility creates inventory entries for all products in your database. 
            Use this if you notice missing inventory data or after importing products.
          </Typography>
        </Alert>

        <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'white' }}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            Process Steps:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="1. Scan Products Collection"
                secondary="Reads all existing products from database"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="2. Create Inventory Entries"
                secondary="Creates corresponding inventory records with stock levels"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="3. Link Product IDs"
                secondary="Ensures proper linkage between products and inventory"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="4. Set Default Values"
                secondary="Configures stock thresholds and reorder points"
              />
            </ListItem>
          </List>
        </Paper>

        {loading && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Syncing inventory...
              </Typography>
              <Typography variant="body2" color="primary" fontWeight="bold">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          </Box>
        )}

        <Button
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
          onClick={handleSync}
          disabled={loading}
          fullWidth
          sx={{ mb: 2 }}
        >
          {loading ? 'Syncing Inventory...' : 'Start Inventory Sync'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              <strong>Sync Failed</strong>
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
        )}

        {result && (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>✓ Sync Completed Successfully!</strong>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`${result.total} Total Products`} 
                  color="default" 
                  size="small" 
                />
                <Chip 
                  label={`${result.synced} Synced`} 
                  color="success" 
                  size="small" 
                />
                {result.failed > 0 && (
                  <Chip 
                    label={`${result.failed} Failed`} 
                    color="error" 
                    size="small" 
                  />
                )}
              </Box>
            </Alert>

            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'info.lighter' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <InfoIcon color="info" sx={{ mr: 1, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    <strong>Next Steps:</strong>
                  </Typography>
                  <List dense sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 0.5 }}>
                      <Typography variant="body2">
                        ✓ Check Firebase Console → Realtime Database → 'inventory' collection
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <Typography variant="body2">
                        ✓ Verify stock levels match your products
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <Typography variant="body2">
                        ✓ New products will automatically create inventory entries
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <Typography variant="body2">
                        ✓ Updates to product inventory will sync to the inventory collection
                      </Typography>
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </Paper>
          </>
        )}

        {!result && !loading && !error && (
          <Alert severity="warning">
            <Typography variant="body2">
              <strong>Important:</strong> This is a one-time operation. Run this only when you need to 
              sync existing products with the inventory collection. New products added through the admin 
              panel will automatically create inventory entries.
            </Typography>
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default InventorySync;