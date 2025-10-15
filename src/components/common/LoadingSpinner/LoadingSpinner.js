import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const SpinnerContainer = styled(Box)(({ theme, fullscreen }) => ({
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
  fullScreen = false,
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
          backgroundColor: fullScreen ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.5)',
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

// Loading skeleton component for better UX
export const LoadingSkeleton = ({ 
  lines = 3, 
  width = '100%', 
  height = 20, 
  spacing = 1,
  animated = true 
}) => {
  const SkeletonLine = styled(Box)(({ theme, animated }) => ({
    backgroundColor: theme.palette.grey[300],
    borderRadius: 4,
    ...(animated && {
      '@keyframes skeleton-loading': {
        '0%': {
          backgroundColor: theme.palette.grey[300],
        },
        '50%': {
          backgroundColor: theme.palette.grey[200],
        },
        '100%': {
          backgroundColor: theme.palette.grey[300],
        },
      },
      animation: 'skeleton-loading 1.5s ease-in-out infinite',
    })
  }));

  return (
    <Box>
      {Array.from({ length: lines }, (_, index) => (
        <SkeletonLine
          key={index}
          animated={animated}
          sx={{
            width: index === lines - 1 ? '60%' : width,
            height,
            marginBottom: index === lines - 1 ? 0 : spacing,
          }}
        />
      ))}
    </Box>
  );
};

// Product card loading skeleton
export const ProductCardSkeleton = () => (
  <Box sx={{ padding: 2 }}>
    <LoadingSkeleton height={200} lines={1} spacing={2} />
    <LoadingSkeleton height={16} lines={2} spacing={1} />
    <LoadingSkeleton height={20} lines={1} width="40%" />
  </Box>
);

// Loading overlay for existing content
export const LoadingOverlay = ({ 
  loading, 
  children, 
  message = 'Loading...', 
  blur = true 
}) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          ...(loading && blur && {
            filter: 'blur(2px)',
            opacity: 0.6,
            pointerEvents: 'none'
          })
        }}
      >
        {children}
      </Box>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1
          }}
        >
          <LoadingSpinner message={message} />
        </Box>
      )}
    </Box>
  );
};

// Custom hook for loading states
export const useLoading = (initialState = false) => {
  const [loading, setLoading] = React.useState(initialState);

  const startLoading = React.useCallback(() => setLoading(true), []);
  const stopLoading = React.useCallback(() => setLoading(false), []);
  const toggleLoading = React.useCallback(() => setLoading(prev => !prev), []);

  return {
    loading,
    startLoading,
    stopLoading,
    toggleLoading,
    setLoading
  };
};

// Loading context for global loading state
const LoadingContext = React.createContext();

export const LoadingProvider = ({ children }) => {
  const loadingState = useLoading();

  return (
    <LoadingContext.Provider value={loadingState}>
      {children}
      {loadingState.loading && <FullScreenSpinner />}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const context = React.useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a LoadingProvider');
  }
  return context;
};

// Higher-order component for loading states
export const withLoading = (WrappedComponent, loadingProps = {}) => {
  return function LoadingComponent(props) {
    const { loading, ...otherProps } = props;
    
    if (loading) {
      return <LoadingSpinner {...loadingProps} />;
    }
    
    return <WrappedComponent {...otherProps} />;
  };
};

export default LoadingSpinner;