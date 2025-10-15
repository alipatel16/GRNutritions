import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';
import { styled } from '@mui/material/styles';

// FIX: Use transient prop ($fullscreen) to prevent DOM warning
const SpinnerContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fullscreen'
})(({ theme, fullscreen }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  ...(fullscreen && {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 9999
  })
}));

const AnimatedSpinner = styled(CircularProgress)(({ theme }) => ({
  animationDuration: '1.5s',
  '& .MuiCircularProgress-circle': {
    strokeLinecap: 'round',
  }
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
  fontWeight: 500
}));

// Main LoadingSpinner component
const LoadingSpinner = ({ 
  size = 40,
  message = 'Loading...',
  fullScreen = false,  // Changed from fullscreen to fullScreen
  backdrop = false,
  color = 'primary',
  variant = 'indeterminate',
  showMessage = true,
  sx = {},
  ...props 
}) => {
  const SpinnerContent = () => (
    <SpinnerContainer fullscreen={fullScreen} sx={sx}>
      <AnimatedSpinner
        size={size}
        color={color}
        variant={variant}
        thickness={4}
        {...props}
      />
      {showMessage && message && (
        <LoadingText variant="body2">
          {message}
        </LoadingText>
      )}
    </SpinnerContainer>
  );

  // Render with backdrop if specified
  if (backdrop || fullScreen) {
    return (
      <Backdrop
        open={true}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: fullScreen 
            ? 'rgba(255, 255, 255, 0.9)' 
            : 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
        }}
      >
        <SpinnerContent />
      </Backdrop>
    );
  }

  return <SpinnerContent />;
};

// Specialized spinner variants
export const FullScreenSpinner = (props) => (
  <LoadingSpinner fullScreen={true} {...props} />
);

export const InlineSpinner = ({ size = 20, ...props }) => (
  <LoadingSpinner 
    size={size} 
    showMessage={false} 
    sx={{ display: 'inline-flex' }}
    {...props} 
  />
);

export const PageSpinner = ({ message = 'Loading page...', ...props }) => (
  <LoadingSpinner
    size={60}
    message={message}
    sx={{
      minHeight: '50vh',
      width: '100%'
    }}
    {...props}
  />
);

export const ButtonSpinner = ({ size = 16, ...props }) => (
  <LoadingSpinner
    size={size}
    showMessage={false}
    color="inherit"
    sx={{ display: 'inline-flex' }}
    {...props}
  />
);

export const CardSpinner = ({ message = 'Loading...', ...props }) => (
  <LoadingSpinner
    size={40}
    message={message}
    sx={{
      padding: 4,
      minHeight: 200,
      width: '100%'
    }}
    {...props}
  />
);

export default LoadingSpinner;