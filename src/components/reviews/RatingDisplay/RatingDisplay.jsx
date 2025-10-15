// ==================== RatingDisplay.jsx ====================
import React from 'react';
import { Box, Rating, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';

const RatingDisplay = ({ rating, reviewCount, size = 'medium', showNumber = true }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Rating value={rating || 0} precision={0.5} readOnly size={size} />
      {showNumber && (
        <>
          <Typography variant="body2" fontWeight="bold">
            {(rating || 0).toFixed(1)}
          </Typography>
          {reviewCount !== undefined && (
            <Typography variant="body2" color="text.secondary">
              ({reviewCount})
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default RatingDisplay;