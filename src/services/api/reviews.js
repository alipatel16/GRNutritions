// ==================== reviews.js ====================
import databaseService from '../firebase/database';

const reviewsAPI = {
  // Add review
  addReview: async (reviewData) => {
    try {
      const review = {
        ...reviewData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        helpful: 0,
        verified: false // Will be set to true if user has purchased the product
      };

      return await databaseService.create('reviews', review);
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  // Get product reviews
  getProductReviews: async (productId) => {
    try {
      return await databaseService.query('reviews', {
        orderBy: { type: 'child', key: 'productId' },
        equalTo: productId
      });
    } catch (error) {
      console.error('Error getting product reviews:', error);
      throw error;
    }
  },

  // Get user reviews
  getUserReviews: async (userId) => {
    try {
      return await databaseService.query('reviews', {
        orderBy: { type: 'child', key: 'userId' },
        equalTo: userId
      });
    } catch (error) {
      console.error('Error getting user reviews:', error);
      throw error;
    }
  },

  // Update review
  updateReview: async (reviewId, updates) => {
    try {
      return await databaseService.update(`reviews/${reviewId}`, updates);
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      return await databaseService.delete(`reviews/${reviewId}`);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  // Get all reviews (Admin)
  getAllReviews: async () => {
    try {
      return await databaseService.query('reviews', {
        orderBy: { type: 'child', key: 'createdAt' }
      });
    } catch (error) {
      console.error('Error getting all reviews:', error);
      throw error;
    }
  },

  // Mark review as helpful
  markReviewHelpful: async (reviewId) => {
    try {
      const result = await databaseService.read(`reviews/${reviewId}`);
      if (result.success && result.data) {
        const currentHelpful = result.data.helpful || 0;
        return await databaseService.update(`reviews/${reviewId}`, {
          helpful: currentHelpful + 1
        });
      }
      return { success: false };
    } catch (error) {
      console.error('Error marking review helpful:', error);
      throw error;
    }
  },

  // Verify review (Admin)
  verifyReview: async (reviewId, verified = true) => {
    try {
      return await databaseService.update(`reviews/${reviewId}`, {
        verified
      });
    } catch (error) {
      console.error('Error verifying review:', error);
      throw error;
    }
  },

  // Get product rating summary
  getProductRatingSummary: async (productId) => {
    try {
      const result = await reviewsAPI.getProductReviews(productId);
      if (!result.success || !result.data) {
        return { success: true, data: { averageRating: 0, totalReviews: 0, distribution: {} } };
      }

      const reviews = Object.values(result.data);
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach(review => {
        distribution[review.rating] = (distribution[review.rating] || 0) + 1;
      });

      return {
        success: true,
        data: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews,
          distribution
        }
      };
    } catch (error) {
      console.error('Error getting rating summary:', error);
      throw error;
    }
  }
};

export default reviewsAPI;