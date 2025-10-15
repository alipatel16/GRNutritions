import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  Collapse,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  Assessment as AnalyticsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationIcon,
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  Category as CategoryIcon,
  Warehouse as InventoryIcon,
  RateReview as ReviewsIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

// Hooks and contexts
import { useAuth } from '../../context/AuthContext/AuthContext';
import { ROUTES, NAVIGATION } from '../../utils/constants/routes';

// Constants
const DRAWER_WIDTH = 280;
const MOBILE_DRAWER_WIDTH = '100%';

// Styled components
const AdminContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[50]
}));

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    [theme.breakpoints.up('md')]: {
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }
  }),
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('md')]: {
      width: MOBILE_DRAWER_WIDTH,
    }
  },
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  ...theme.mixins.toolbar,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: 64, // Account for AppBar height
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  }
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  // Context hooks
  const { user, logout, getDisplayName } = useAuth();
  
  // Local state
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState({});

  // Navigation items
  const navigationItems = [
    {
      title: 'Dashboard',
      path: ROUTES.ADMIN_DASHBOARD,
      icon: DashboardIcon
    },
    {
      title: 'Products',
      icon: ProductsIcon,
      children: [
        {
          title: 'All Products',
          path: ROUTES.ADMIN_PRODUCTS,
          icon: ProductsIcon
        },
        {
          title: 'Add Product',
          path: ROUTES.ADMIN_PRODUCT_ADD,
          icon: AddIcon
        },
        {
          title: 'Categories',
          path: ROUTES.ADMIN_CATEGORIES,
          icon: CategoryIcon
        }
      ]
    },
    {
      title: 'Orders',
      path: ROUTES.ADMIN_ORDERS,
      icon: OrdersIcon,
      badge: 5 // Example: 5 pending orders
    },
    {
      title: 'Inventory',
      path: ROUTES.ADMIN_INVENTORY,
      icon: InventoryIcon
    },
    {
      title: 'Users',
      path: ROUTES.ADMIN_USERS,
      icon: UsersIcon
    },
    {
      title: 'Reviews',
      path: ROUTES.ADMIN_REVIEWS,
      icon: ReviewsIcon
    },
    {
      title: 'Analytics',
      path: ROUTES.ADMIN_ANALYTICS,
      icon: AnalyticsIcon
    },
    {
      title: 'Settings',
      path: ROUTES.ADMIN_SETTINGS,
      icon: SettingsIcon
    }
  ];

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Handle user menu
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  // Handle logout
  const handleLogout = async () => {
    handleUserMenuClose();
    await logout();
    navigate(ROUTES.HOME);
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  // Handle submenu toggle
  const handleSubmenuToggle = (title) => {
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Check if route is active
  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Render navigation item
  const renderNavigationItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus[item.title];
    const isActive = item.path ? isActiveRoute(item.path) : false;

    return (
      <React.Fragment key={item.title}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={hasChildren 
              ? () => handleSubmenuToggle(item.title)
              : () => handleNavigation(item.path)
            }
            selected={isActive}
            sx={{
              minHeight: 48,
              px: 2.5,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main + '10',
                borderRight: `3px solid ${theme.palette.primary.main}`,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main
                },
                '& .MuiListItemText-primary': {
                  color: theme.palette.primary.main,
                  fontWeight: 600
                }
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 2,
                justifyContent: 'center',
              }}
            >
              {item.badge ? (
                <Badge badgeContent={item.badge} color="error">
                  <item.icon />
                </Badge>
              ) : (
                <item.icon />
              )}
            </ListItemIcon>
            <ListItemText 
              primary={item.title}
              primaryTypographyProps={{
                fontSize: '0.875rem'
              }}
            />
            {hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <ListItem key={child.title} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(child.path)}
                    selected={isActiveRoute(child.path)}
                    sx={{
                      pl: 4,
                      minHeight: 40,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main + '08',
                        '& .MuiListItemIcon-root': {
                          color: theme.palette.primary.main
                        },
                        '& .MuiListItemText-primary': {
                          color: theme.palette.primary.main,
                          fontWeight: 500
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                      <child.icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={child.title}
                      primaryTypographyProps={{
                        fontSize: '0.8125rem'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <AdminContainer>
      {/* App Bar */}
      <StyledAppBar position="fixed" open={drawerOpen && !isMobile} elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>

          {/* Notifications */}
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <NotificationIcon />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {getDisplayName().charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose}
            PaperProps={{
              elevation: 8,
              sx: {
                mt: 1.5,
                minWidth: 200,
                '& .MuiAvatar-root': {
                  width: 24,
                  height: 24,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
          >
            <MenuItem>
              <AdminIcon sx={{ mr: 2 }} />
              {getDisplayName()}
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => navigate(ROUTES.HOME)}>
              View Store
            </MenuItem>
            <MenuItem onClick={() => navigate(ROUTES.PROFILE)}>
              Profile Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogoutIcon sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </StyledAppBar>

      {/* Sidebar */}
      <StyledDrawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        {/* Logo */}
        <DrawerHeader>
          <LogoContainer>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              🍃 NutriShop
            </Typography>
            <Chip 
              label="Admin" 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </LogoContainer>
        </DrawerHeader>

        {/* Navigation */}
        <List sx={{ px: 1, py: 2 }}>
          {navigationItems.map(renderNavigationItem)}
        </List>

        {/* Quick Stats */}
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Quick Stats
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">Total Products:</Typography>
              <Typography variant="caption" fontWeight={600}>1,245</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">Pending Orders:</Typography>
              <Typography variant="caption" fontWeight={600} color="warning.main">
                23
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">Revenue Today:</Typography>
              <Typography variant="caption" fontWeight={600} color="success.main">
                ₹45,680
              </Typography>
            </Box>
          </Box>
        </Box>
      </StyledDrawer>

      {/* Main Content */}
      <MainContent>
        {children}
      </MainContent>
    </AdminContainer>
  );
};

export default AdminLayout;