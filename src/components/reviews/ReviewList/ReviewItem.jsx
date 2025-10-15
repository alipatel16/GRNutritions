// ==================== ReviewItem.jsx ====================
import React from 'react';
import {
  Box,
  Typography,
  Rating,
  Avatar,
  IconButton,
  Chip
} from '@mui/material';
import { Edit, Delete, Verified } from '@mui/icons-material';
import { formatRelativeTime } from '../../../utils/helpers/formatters';
import { useAuth } from '../../../context/AuthContext/AuthContext';

const ReviewItem = ({ review, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isOwnReview = user?.uid === review.userId;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
          <Avatar>{review.userName?.[0]?.toUpperCase()}</Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {review.userName}
              </Typography>
              {review.verified && (
                <Chip
                  icon={<Verified />}
                  label="Verified Purchase"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}
            </Box>
            <Rating value={review.rating} readOnly size="small" />
            <Typography variant="caption" color="text.secondary" display="block">
              {formatRelativeTime(review.createdAt)}
            </Typography>
          </Box>
        </Box>

        {isOwnReview && (
          <Box>
            {onEdit && (
              <IconButton size="small" onClick={() => onEdit(review)}>
                <Edit fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton size="small" color="error" onClick={() => onDelete(review.id)}>
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}
      </Box>

      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        {review.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {review.comment}
      </Typography>
    </Box>
  );
};

export default ReviewItem;