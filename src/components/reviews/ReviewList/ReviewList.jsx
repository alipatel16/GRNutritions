// ==================== ReviewList.jsx ====================
import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import ReviewItem from './ReviewItem';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';

const ReviewList = ({ reviews, loading, onEdit, onDelete }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No reviews yet. Be the first to review!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {reviews.map((review, index) => (
        <Box key={review.id || index}>
          <ReviewItem review={review} onEdit={onEdit} onDelete={onDelete} />
          {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />}
        </Box>
      ))}
    </Box>
  );
};

export default ReviewList;