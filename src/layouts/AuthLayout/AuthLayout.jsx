import React from 'react';
import { Box, Container, Paper, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const AuthContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.light}15 0%, 
    ${theme.palette.secondary.light}15 100%)`,
  position: 'relative',
  overflow: 'hidden',
  
  // Decorative background elements
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}08 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}08 0%, transparent 50%),
                 radial-gradient(circle at 40% 40%, ${theme.palette.primary.main}05 0%, transparent 50%)`,
    zIndex: 0
  }
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(2)
}));

const AuthLayout = ({ children, maxWidth = 'sm', ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AuthContainer {...props}>
      <ContentWrapper maxWidth={maxWidth}>
        <Box
          sx={{
            width: '100%',
            maxWidth: isMobile ? '100%' : 480,
            position: 'relative'
          }}
        >
          {children}
        </Box>
      </ContentWrapper>
    </AuthContainer>
  );
};

export default AuthLayout;