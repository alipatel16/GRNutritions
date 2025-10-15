// ==================== AddressList.jsx ====================
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Grid,
  Button,
  Radio
} from '@mui/material';
import {
  Edit,
  Delete,
  Home,
  Work,
  LocationOn,
  Star,
  StarBorder
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';

const AddressCard = styled(Card)(({ theme, selected }) => ({
  cursor: selectionMode => selectionMode ? 'pointer' : 'default',
  border: `2px solid ${selected ? theme.palette.primary.main : 'transparent'}`,
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: theme.palette.primary.main
  }
}));

const AddressList = ({
  addresses,
  loading,
  onEdit,
  onDelete,
  onSetDefault,
  onSelect,
  selectionMode = false,
  selectedAddressId = null
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!addresses || addresses.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <LocationOn sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No addresses added yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add a delivery address to continue
        </Typography>
      </Box>
    );
  }

  const getAddressIcon = (type) => {
    switch (type) {
      case 'home': return <Home />;
      case 'work': return <Work />;
      default: return <LocationOn />;
    }
  };

  return (
    <Grid container spacing={2}>
      {addresses.map((address) => (
        <Grid item xs={12} key={address.id}>
          <AddressCard
            selected={selectionMode && selectedAddressId === address.id}
            onClick={() => selectionMode && onSelect && onSelect(address)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                  {selectionMode && (
                    <Radio
                      checked={selectedAddressId === address.id}
                      sx={{ mt: -1 }}
                    />
                  )}
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {getAddressIcon(address.addressType)}
                      <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                        {address.addressType}
                      </Typography>
                      {address.isDefault && (
                        <Chip
                          icon={<Star />}
                          label="Default"
                          size="small"
                          color="primary"
                        />
                      )}
                    </Box>

                    <Typography variant="body1" fontWeight="medium">
                      {address.fullName}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      {address.city}, {address.state} - {address.pincode}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Phone: {address.phoneNumber}
                    </Typography>
                  </Box>
                </Box>

                {!selectionMode && (
                  <Box>
                    {onEdit && (
                      <IconButton onClick={() => onEdit(address)} size="small">
                        <Edit />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton onClick={() => onDelete(address.id)} size="small" color="error">
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                )}
              </Box>

              {!selectionMode && !address.isDefault && onSetDefault && (
                <Button
                  size="small"
                  startIcon={<StarBorder />}
                  onClick={() => onSetDefault(address.id)}
                  sx={{ mt: 1 }}
                >
                  Set as Default
                </Button>
              )}
            </CardContent>
          </AddressCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default AddressList;