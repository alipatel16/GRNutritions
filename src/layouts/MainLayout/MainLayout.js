import React from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';

// Components
import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';
import MobileNavbar from '../../components/common/Navbar/MobileNavbar';
import CartDrawer from '../../components/cart/CartDrawer/CartDrawer';
import SearchDrawer from '../../components/common/SearchDrawer/SearchDrawer';

// Hooks and contexts
import { useApp } from '../../context/AppContext/AppProvider';
import { useAuth } from '../../context/AuthContext/AuthContext';

// Styled components
const LayoutContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  paddingTop: theme.spacing(8), // Account for fixed header
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(7),
    paddingBottom: theme.spacing(8) // Account for mobile bottom nav
  }
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  flex: 1,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

// Floating Action Button for mobile cart (if needed)
const FloatingCartButton = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(10),
  right: theme.spacing(2),
  zIndex: theme.zIndex.fab,
  [theme.breakpoints.up('md')]: {
    display: 'none'
  }
}));

// Main Layout Component
const MainLayout = ({ 
  children, 
  maxWidth = 'lg',
  disableGutters = false,
  showFooter = true,
  showMobileNav = true,
  className = '',
  containerProps = {},
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { ui } = useApp();
  const { isAuthenticated } = useAuth();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LayoutContainer className={className} {...props}>
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <MainContent component="main">
        <ContentWrapper
          maxWidth={maxWidth}
          disableGutters={disableGutters}
          {...containerProps}
        >
          {children}
        </ContentWrapper>
      </MainContent>

      {/* Footer */}
      {showFooter && <Footer />}

      {/* Mobile Bottom Navigation */}
      {isMobile && showMobileNav && <MobileNavbar />}

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Search Drawer */}
      <SearchDrawer />

      {/* Floating elements can be added here */}
    </LayoutContainer>
  );
};

// Layout variants for different page types
export const WideLayout = ({ children, ...props }) => (
  <MainLayout maxWidth="xl" {...props}>
    {children}
  </MainLayout>
);

export const NarrowLayout = ({ children, ...props }) => (
  <MainLayout maxWidth="md" {...props}>
    {children}
  </MainLayout>
);

export const FullWidthLayout = ({ children, ...props }) => (
  <MainLayout maxWidth={false} disableGutters {...props}>
    <Box sx={{ width: '100%' }}>
      {children}
    </Box>
  </MainLayout>
);

export const CenteredLayout = ({ children, ...props }) => (
  <MainLayout maxWidth="sm" {...props}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center'
      }}
    >
      {children}
    </Box>
  </MainLayout>
);

// Layout with sidebar (for categories, filters, etc.)
export const SidebarLayout = ({ 
  children, 
  sidebar, 
  sidebarWidth = 280,
  sidebarPosition = 'left',
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    // On mobile, render sidebar as drawer or stacked
    return (
      <MainLayout {...props}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sidebar}
          <Box sx={{ flex: 1 }}>
            {children}
          </Box>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout {...props}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {sidebarPosition === 'left' && (
          <Box sx={{ width: sidebarWidth, flexShrink: 0 }}>
            {sidebar}
          </Box>
        )}
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {children}
        </Box>
        
        {sidebarPosition === 'right' && (
          <Box sx={{ width: sidebarWidth, flexShrink: 0 }}>
            {sidebar}
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

// Layout hook for getting layout context
export const useLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
};

export default MainLayout;