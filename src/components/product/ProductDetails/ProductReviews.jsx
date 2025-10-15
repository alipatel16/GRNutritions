// ==================== ProductReviews.jsx ====================
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Grid,
  Paper
} from '@mui/material';
import { RateReview } from '@mui/icons-material';
import RatingDisplay from '../../reviews/RatingDisplay/RatingDisplay';
import ReviewForm from '../../reviews/ReviewForm/ReviewForm';
import ReviewList from '../../reviews/ReviewList/ReviewList';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import databaseService from '../../../services/firebase/database';

const ProductReviews = ({ productId }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const result = await databaseService.getProductReviews(productId);
      if (result.success) {
        setReviews(result.data || []);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    await databaseService.addReview(reviewData);
    loadReviews();
    setShowForm(false);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length
  }));

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Customer Reviews
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h2" fontWeight="bold">
              {averageRating.toFixed(1)}
            </Typography>
            <RatingDisplay rating={averageRating} reviewCount={reviews.length} showNumber={false} />
            <Typography variant="body2" color="text.secondary">
              Based on {reviews.length} reviews
            </Typography>

            {isAuthenticated && (
              <Button
                variant="contained"
                startIcon={<RateReview />}
                onClick={() => setShowForm(!showForm)}
                sx={{ mt: 2 }}
                fullWidth
              >
                Write a Review
              </Button>
            )}

            <Box sx={{ mt: 3 }}>
              {ratingCounts.map(({ rating, count }) => (
                <Box key={rating} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: 20 }}>
                    {rating}★
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={reviews.length > 0 ? (count / reviews.length) * 100 : 0}
                    sx={{ flex: 1, height: 8, borderRadius: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 30 }}>
                    {count}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {showForm && isAuthenticated && (
            <ReviewForm
              productId={productId}
              onSubmit={handleSubmitReview}
              onCancel={() => setShowForm(false)}
            />
          )}

          <Box sx={{ mt: showForm ? 3 : 0 }}>
            <ReviewList reviews={reviews} loading={loading} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductReviews;