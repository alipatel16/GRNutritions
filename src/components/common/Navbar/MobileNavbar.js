import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  Paper,
  useTheme
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

// Hooks and contexts
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { useCart } from '../../../context/CartContext/CartContext';
import { useApp } from '../../../context/AppContext/AppProvider';
import { ROUTES } from '../../../utils/constants/routes';

// Styled components
const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar,
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
  '& .MuiBottomNavigationAction-root': {
    minWidth: 'auto',
    padding: theme.spacing(0.5, 0.75),
    '&.Mui-selected': {
      color: theme.palette.primary.main
    }
  },
  '& .MuiBottomNavigationAction-label': {
    fontSize: '0.75rem',
    fontWeight: 500,
    '&.Mui-selected': {
      fontSize: '0.75rem'
    }
  }
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 2,
    fontSize: '0.625rem',
    height: 16,
    minWidth: 16
  }
}));

const MobileNavbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Context hooks
  const { isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { toggleSearch, toggleCart } = useApp();

  // Determine current route for highlighting
  const getCurrentValue = () => {
    const pathname = location.pathname;
    
    if (pathname === ROUTES.HOME) return 0;
    if (pathname === '/search' || pathname.startsWith('/category')) return 1;
    if (pathname === ROUTES.CART) return 2;
    if (pathname.startsWith('/dashboard') || pathname === ROUTES.PROFILE || pathname === ROUTES.ORDERS) return 3;
    
    return 0; // Default to home
  };

  const handleNavigation = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate(ROUTES.HOME);
        break;
      case 1:
        toggleSearch(true);
        break;
      case 2:
        if (totalItems > 0) {
          toggleCart(true);
        } else {
          navigate(ROUTES.PRODUCTS);
        }
        break;
      case 3:
        if (isAuthenticated) {
          navigate(ROUTES.PROFILE);
        } else {
          navigate(ROUTES.LOGIN);
        }
        break;
      default:
        break;
    }
  };

  // Don't show on certain pages
  const hiddenRoutes = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.ADMIN_LOGIN,
    '/admin'
  ];

  if (hiddenRoutes.some(route => location.pathname.startsWith(route))) {
    return null;
  }

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: theme.zIndex.appBar }}>
      <StyledBottomNavigation
        value={getCurrentValue()}
        onChange={handleNavigation}
        showLabels
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
        />
        
        <BottomNavigationAction
          label="Search"
          icon={<SearchIcon />}
        />
        
        <BottomNavigationAction
          label="Cart"
          icon={
            <StyledBadge badgeContent={totalItems} color="secondary">
              <CartIcon />
            </StyledBadge>
          }
        />
        
        <BottomNavigationAction
          label={isAuthenticated ? "Profile" : "Login"}
          icon={<PersonIcon />}
        />
      </StyledBottomNavigation>
    </Paper>
  );
};

export default MobileNavbar;