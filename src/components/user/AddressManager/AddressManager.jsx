// ==================== AddressManager.jsx ====================
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add } from '@mui/icons-material';
import AddressForm from './AddressForm';
import AddressList from './AddressList';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import databaseService from '../../../services/firebase/database';
import toast from '../../../services/notification/toast';

const AddressManager = ({ onSelectAddress, selectionMode = false }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const result = await databaseService.getUserAddresses(user.uid);
      if (result.success) {
        setAddresses(result.data || []);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (addressData) => {
    try {
      await databaseService.addUserAddress(user.uid, addressData);
      toast.messages.addressAdded();
      loadAddresses();
      setDialogOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditAddress = async (addressData) => {
    try {
      await databaseService.updateAddress(user.uid, editingAddress.id, addressData);
      toast.messages.addressUpdated();
      loadAddresses();
      setDialogOpen(false);
      setEditingAddress(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await databaseService.deleteAddress(user.uid, addressId);
      toast.messages.addressDeleted();
      loadAddresses();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await databaseService.setDefaultAddress(user.uid, addressId);
      toast.success('Default address updated');
      loadAddresses();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openAddDialog = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  const openEditDialog = (address) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingAddress(null);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            {selectionMode ? 'Select Delivery Address' : 'Manage Addresses'}
          </Typography>
          {!selectionMode && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openAddDialog}
            >
              Add Address
            </Button>
          )}
        </Box>

        <AddressList
          addresses={addresses}
          loading={loading}
          onEdit={openEditDialog}
          onDelete={handleDeleteAddress}
          onSetDefault={handleSetDefault}
          onSelect={onSelectAddress}
          selectionMode={selectionMode}
        />

        <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </DialogTitle>
          <DialogContent>
            <AddressForm
              initialData={editingAddress}
              onSubmit={editingAddress ? handleEditAddress : handleAddAddress}
              onCancel={closeDialog}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AddressManager;