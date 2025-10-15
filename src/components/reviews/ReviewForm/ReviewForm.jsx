// ==================== ReviewForm.jsx ====================
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Rating,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import toast from '../../../services/notification/toast';

const ReviewForm = ({ productId, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onSubmit({
        productId,
        userId: user.uid,
        userName: user.displayName,
        rating,
        title,
        comment,
        createdAt: new Date().toISOString()
      });
      
      toast.messages.reviewSubmitted();
      setRating(0);
      setTitle('');
      setComment('');
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Write a Review
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Typography component="legend" gutterBottom>
            Your Rating *
          </Typography>
          <Rating
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            size="large"
          />
        </Box>

        <TextField
          fullWidth
          label="Review Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Your Review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          rows={4}
          required
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Send />}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
          {onCancel && (
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ReviewForm;