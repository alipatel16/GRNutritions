// ==================== StockUpdateForm.jsx ====================
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress
} from '@mui/material';

const StockUpdateForm = ({ product, onSubmit, onCancel }) => {
  const [quantity, setQuantity] = useState(product.inventory);
  const [reason, setReason] = useState('restock');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(product.id, parseInt(quantity), reason, notes);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Product: {product.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Current Stock: {product.inventory}
      </Typography>

      <TextField
        fullWidth
        label="New Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
        sx={{ my: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Reason</InputLabel>
        <Select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          label="Reason"
        >
          <MenuItem value="restock">Restock</MenuItem>
          <MenuItem value="return">Return</MenuItem>
          <MenuItem value="damage">Damage/Loss</MenuItem>
          <MenuItem value="adjustment">Adjustment</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Update Stock'}
        </Button>
      </Box>
    </Box>
  );
};

export default StockUpdateForm;