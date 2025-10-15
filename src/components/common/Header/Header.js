import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  InputBase,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  FavoriteBorder as WishlistIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';

// Hooks and contexts
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { useCart } from '../../../context/CartContext/CartContext';
import { useApp } from '../../../context/AppContext/AppProvider';
import { ROUTES } from '../../../utils/constants/routes';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  zIndex: theme.zIndex.drawer + 1
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    textDecoration: 'none'
  }
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.25rem'
  }
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.grey[500], 0.08),
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[500], 0.12),
  },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: '100%',
  maxWidth: 400,
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%'
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08)
  }
}));

const UserMenuButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  marginLeft: theme.spacing(1)
}));

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // Context hooks
  const { user, isAuthenticated, isAdmin, logout, getDisplayName } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const { toggleDrawer, toggleSearch } = useApp();

  // Local state
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  // User menu handlers
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await logout();
    navigate(ROUTES.HOME);
  };

  // Search handlers
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };

  const handleMobileSearchOpen = () => {
    toggleSearch(true);
  };

  // Navigation handlers
  const handleLogoClick = () => {
    navigate(ROUTES.HOME);
  };

  const handleMenuClick = () => {
    toggleDrawer(true);
  };

  return (
    <StyledAppBar position="fixed" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
        {/* Left Section - Menu & Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuClick}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <LogoContainer component={Link} to={ROUTES.HOME}>
            <LogoText variant="h6" component="div">
              🍃 NutriShop
            </LogoText>
          </LogoContainer>
        </Box>

        {/* Center Section - Navigation & Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', ml: 4 }}>
              <NavButton component={Link} to={ROUTES.HOME}>
                Home
              </NavButton>
              <NavButton component={Link} to={ROUTES.PRODUCTS}>
                Products
              </NavButton>
              <NavButton component={Link} to="/category/protein">
                Protein
              </NavButton>
              <NavButton component={Link} to="/category/vitamins-minerals">
                Vitamins
              </NavButton>
              <NavButton component={Link} to="/about">
                About
              </NavButton>
            </Box>
          )}

          {/* Desktop Search */}
          <SearchContainer>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <form onSubmit={handleSearchSubmit}>
              <StyledInputBase
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                inputProps={{ 'aria-label': 'search' }}
              />
            </form>
          </SearchContainer>
        </Box>

        {/* Right Section - Actions & User */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Mobile Search Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleMobileSearchOpen}
              sx={{ mr: 1 }}
            >
              <SearchIcon />
            </IconButton>
          )}

          {/* Cart Button */}
          <IconButton
            color="inherit"
            onClick={() => toggleCart(true)}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={totalItems} color="secondary">
              <CartIcon />
            </Badge>
          </IconButton>

          {/* User Section */}
          {isAuthenticated ? (
            <>
              {/* Notifications (placeholder) */}
              <IconButton color="inherit" sx={{ mr: 1 }}>
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* User Menu */}
              <UserMenuButton onClick={handleUserMenuOpen}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '0.875rem'
                  }}
                >
                  {getDisplayName().charAt(0).toUpperCase()}
                </Avatar>
              </UserMenuButton>

              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                onClick={handleUserMenuClose}
                PaperProps={{
                  elevation: 8,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                    mt: 1.5,
                    minWidth: 220,
                    '& .MuiAvatar-root': {
                      width: 24,
                      height: 24,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {getDisplayName()}
                </MenuItem>
                <Divider />
                
                <MenuItem onClick={() => navigate(ROUTES.PROFILE)}>
                  <PersonIcon sx={{ mr: 2 }} />
                  My Profile
                </MenuItem>
                
                <MenuItem onClick={() => navigate(ROUTES.ORDERS)}>
                  <DashboardIcon sx={{ mr: 2 }} />
                  My Orders
                </MenuItem>
                
                <MenuItem onClick={() => navigate(ROUTES.WISHLIST)}>
                  <WishlistIcon sx={{ mr: 2 }} />
                  Wishlist
                </MenuItem>

                {isAdmin && (
                  <>
                    <Divider />
                    <MenuItem onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}>
                      <SettingsIcon sx={{ mr: 2 }} />
                      Admin Panel
                    </MenuItem>
                  </>
                )}
                
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <LogoutIcon sx={{ mr: 2 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                onClick={() => navigate(ROUTES.LOGIN)}
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate(ROUTES.REGISTER)}
                sx={{ 
                  textTransform: 'none',
                  display: { xs: 'none', sm: 'inline-flex' }
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;