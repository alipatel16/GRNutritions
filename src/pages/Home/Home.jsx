import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  ArrowForward,
  Star,
  LocalShipping,
  Security,
  SupportAgent,
  Verified,
  TrendingUp,
  NewReleases,
  WorkspacePremium
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Components
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import ProductCard from '../../components/product/ProductCard/ProductCard';
import ErrorBoundary from '../../components/common/ErrorBoundary/ErrorBoundary';

// Hooks and contexts
import { useProducts } from '../../context/ProductContext/ProductContext';
import { useAuth } from '../../context/AuthContext/AuthContext';

// Constants
import { PRODUCT_CATEGORIES, getAllCategories } from '../../utils/constants/categories';
import { ROUTES } from '../../utils/constants/routes';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${alpha(theme.palette.primary.main, 0.1)} 0%, 
    ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 0, 4, 0)
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: 200,
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    '& .category-overlay': {
      backgroundColor: alpha(theme.palette.primary.main, 0.8)
    }
  }
}));

const CategoryOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: alpha(theme.palette.primary.main, 0.6),
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'backgroundColor 0.3s ease-in-out'
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 60,
    height: 3,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2
  }
}));

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // Context hooks
  const { 
    featuredProducts, 
    getNewArrivals, 
    getBestSellers, 
    getTopRatedProducts,
    loading, 
    error 
  } = useProducts();
  
  const { isAuthenticated } = useAuth();

  // Get product lists
  const newArrivals = getNewArrivals(4);
  const bestSellers = getBestSellers(4);
  const topRated = getTopRatedProducts(4);

  // Features for the home page
  const features = [
    {
      icon: Security,
      title: 'Secure Payments',
      description: 'Your transactions are protected with bank-level security'
    },
    {
      icon: LocalShipping,
      title: 'Free Shipping',
      description: 'Free delivery on orders above ₹999 across India'
    },
    {
      icon: Verified,
      title: 'Authentic Products',
      description: '100% genuine products from verified brands'
    },
    {
      icon: SupportAgent,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs'
    }
  ];

  // Get main categories for display
  const mainCategories = [
    PRODUCT_CATEGORIES.PROTEIN,
    PRODUCT_CATEGORIES.MASS_GAINER,
    PRODUCT_CATEGORIES.VITAMINS_MINERALS,
    PRODUCT_CATEGORIES.DETOX_CLEANSE
  ];

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.slug}`);
  };

  const handleShopNow = () => {
    navigate(ROUTES.PRODUCTS);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(ROUTES.PRODUCTS);
    } else {
      navigate(ROUTES.REGISTER);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading home page..." />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Unable to load content
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Please try refreshing the page or contact support if the problem persists.
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Typography 
            variant={isMobile ? "h3" : "h2"} 
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 700, mb: 3 }}
          >
            Premium Nutrition for Your
            <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
              Health & Fitness Goals
            </Box>
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary" 
            paragraph
            sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
          >
            Discover high-quality supplements, proteins, and vitamins from trusted brands. 
            Start your journey to better health today.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={handleShopNow}
              sx={{ minWidth: 160 }}
            >
              Shop Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleGetStarted}
              sx={{ minWidth: 160 }}
            >
              {isAuthenticated ? 'Explore Products' : 'Get Started'}
            </Button>
          </Box>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard elevation={2}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <feature.icon 
                    sx={{ 
                      fontSize: 48, 
                      color: 'primary.main', 
                      mb: 2 
                    }} 
                  />
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h4" component="h2">
            Shop by Category
          </SectionTitle>
          
          <Grid container spacing={3}>
            {mainCategories.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <CategoryCard onClick={() => handleCategoryClick(category)}>
                  <Box
                    sx={{
                      height: '100%',
                      background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h1" sx={{ fontSize: '4rem', opacity: 0.3 }}>
                      {category.icon}
                    </Typography>
                  </Box>
                  <CategoryOverlay className="category-overlay">
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', px: 2 }}>
                      {category.description}
                    </Typography>
                  </CategoryOverlay>
                </CategoryCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Products Section */}
      {featuredProducts && featuredProducts.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <SectionTitle variant="h4" component="h2" sx={{ mb: 0, '&::after': { display: 'none' } }}>
              Featured Products
            </SectionTitle>
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              onClick={() => navigate(ROUTES.PRODUCTS)}
            >
              View All
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {featuredProducts.slice(0, 4).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ErrorBoundary>
                  <ProductCard product={product} />
                </ErrorBoundary>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* New Arrivals Section */}
      {newArrivals && newArrivals.length > 0 && (
        <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
              <NewReleases sx={{ mr: 1, color: 'primary.main' }} />
              <SectionTitle variant="h4" component="h2" sx={{ mb: 0, '&::after': { display: 'none' } }}>
                New Arrivals
              </SectionTitle>
            </Box>
            
            <Grid container spacing={3}>
              {newArrivals.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <ErrorBoundary>
                    <ProductCard product={product} showNewBadge />
                  </ErrorBoundary>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Best Sellers Section */}
      {bestSellers && bestSellers.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
            <SectionTitle variant="h4" component="h2" sx={{ mb: 0, '&::after': { display: 'none' } }}>
              Best Sellers
            </SectionTitle>
          </Box>
          
          <Grid container spacing={3}>
            {bestSellers.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ErrorBoundary>
                  <ProductCard product={product} showBestSellerBadge />
                </ErrorBoundary>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Top Rated Section */}
      {topRated && topRated.length > 0 && (
        <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
              <WorkspacePremium sx={{ mr: 1, color: 'primary.main' }} />
              <SectionTitle variant="h4" component="h2" sx={{ mb: 0, '&::after': { display: 'none' } }}>
                Top Rated Products
              </SectionTitle>
            </Box>
            
            <Grid container spacing={3}>
              {topRated.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <ErrorBoundary>
                    <ProductCard product={product} showRating />
                  </ErrorBoundary>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Call to Action Section */}
      <Box sx={{ backgroundColor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Ready to Transform Your Health?
          </Typography>
          <Typography variant="h6" paragraph sx={{ opacity: 0.9 }}>
            Join thousands of satisfied customers who trust us for their nutrition needs.
            Start your journey today!
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ 
              backgroundColor: 'white', 
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100'
              }
            }}
            onClick={handleGetStarted}
          >
            {isAuthenticated ? 'Start Shopping' : 'Create Account'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;