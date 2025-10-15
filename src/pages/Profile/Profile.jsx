// ==================== Profile.jsx (page) ====================
import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Person,
  LocationOn,
  ShoppingBag,
  Settings,
  Logout
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { ROUTES } from '../../utils/constants/routes';

const SidebarCard = styled(Card)(({ theme }) => ({
  position: 'sticky',
  top: theme.spacing(10)
}));

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Profile', icon: <Person />, path: ROUTES.PROFILE },
    { label: 'Addresses', icon: <LocationOn />, path: ROUTES.ADDRESSES },
    { label: 'Orders', icon: <ShoppingBag />, path: ROUTES.ORDERS },
    { label: 'Settings', icon: <Settings />, path: ROUTES.SETTINGS }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <SidebarCard>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                My Account
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                {menuItems.map((item) => (
                  <ListItem
                    key={item.path}
                    button
                    selected={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        '& .MuiListItemIcon-root': {
                          color: 'white'
                        }
                      }
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItem>
                ))}
                <ListItem
                  button
                  onClick={handleLogout}
                  sx={{ borderRadius: 1, color: 'error.main' }}
                >
                  <ListItemIcon sx={{ color: 'error.main' }}>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </CardContent>
          </SidebarCard>
        </Grid>

        <Grid item xs={12} md={9}>
          <Outlet />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;