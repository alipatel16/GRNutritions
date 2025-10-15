import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
  ShoppingBag as ShopIcon,
  SentimentVeryDissatisfied as SadIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Constants
import { ROUTES } from '../../utils/constants/routes';

// Styled components
const NotFoundContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  textAlign: 'center',
  padding: theme.spacing(4)
}));

const ErrorCode = styled(Typography)(({ theme }) => ({
  fontSize: '8rem',
  fontWeight: 900,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: 1,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    fontSize: '6rem'
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '4rem'
  }
}));

const IllustrationBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 200,
    height: 200,
    background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
    borderRadius: '50%',
    zIndex: -1
  }
}));

const ActionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}));

const NotFound = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleShopNow = () => {
    navigate(ROUTES.PRODUCTS);
  };

  const handleSearch = () => {
    navigate('/search');
  };

  const quickActions = [
    {
      icon: HomeIcon,
      title: 'Go Home',
      description: 'Return to our homepage',
      action: handleGoHome,
      color: 'primary'
    },
    {
      icon: ShopIcon,
      title: 'Shop Products',
      description: 'Browse our nutrition products',
      action: handleShopNow,
      color: 'secondary'
    },
    {
      icon: SearchIcon,
      title: 'Search',
      description: 'Find what you\'re looking for',
      action: handleSearch,
      color: 'info'
    },
    {
      icon: BackIcon,
      title: 'Go Back',
      description: 'Return to previous page',
      action: handleGoBack,
      color: 'warning'
    }
  ];

  return (
    <NotFoundContainer maxWidth="lg">
      <IllustrationBox>
        <ErrorCode>404</ErrorCode>
        <SadIcon sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
      </IllustrationBox>

      <Typography
        variant={isMobile ? 'h4' : 'h3'}
        component="h1"
        gutterBottom
        fontWeight={700}
        color="text.primary"
      >
        Oops! Page Not Found
      </Typography>

      <Typography
        variant="h6"
        color="text.secondary"
        paragraph
        sx={{ maxWidth: 600, mb: 4 }}
      >
        The page you're looking for seems to have vanished into thin air. 
        Don't worry, it happens to the best of us!
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        paragraph
        sx={{ maxWidth: 500, mb: 6 }}
      >
        Here are some quick actions to get you back on track:
      </Typography>

      {/* Quick Actions Grid */}
      <Grid container spacing={3} sx={{ maxWidth: 800, mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ActionCard
              elevation={2}
              onClick={action.action}
            >
              <action.icon
                sx={{
                  fontSize: '3rem',
                  color: `${action.color}.main`,
                  mb: 2
                }}
              />
              <Typography
                variant="h6"
                gutterBottom
                fontWeight={600}
              >
                {action.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {action.description}
              </Typography>
            </ActionCard>
          </Grid>
        ))}
      </Grid>

      {/* Popular Links */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Popular Pages:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="text"
            onClick={() => navigate('/category/protein')}
          >
            Protein Supplements
          </Button>
          <Button
            variant="text"
            onClick={() => navigate('/category/vitamins-minerals')}
          >
            Vitamins & Minerals
          </Button>
          <Button
            variant="text"
            onClick={() => navigate('/category/mass-gainer')}
          >
            Mass Gainers
          </Button>
          <Button
            variant="text"
            onClick={() => navigate('/about')}
          >
            About Us
          </Button>
          <Button
            variant="text"
            onClick={() => navigate('/contact')}
          >
            Contact Support
          </Button>
        </Box>
      </Box>

      {/* Help Text */}
      <Box sx={{ mt: 6, p: 3, backgroundColor: alpha(theme.palette.info.main, 0.08), borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Still can't find what you're looking for?</strong>
          <br />
          Contact our support team at{' '}
          <a href="mailto:support@nutritionshop.com" style={{ color: theme.palette.primary.main }}>
            support@nutritionshop.com
          </a>
          {' '}or call us at{' '}
          <a href="tel:+919876543210" style={{ color: theme.palette.primary.main }}>
            +91-9876543210
          </a>
        </Typography>
      </Box>
    </NotFoundContainer>
  );
};

export default NotFound;