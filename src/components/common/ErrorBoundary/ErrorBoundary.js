import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container,
  Alert,
  AlertTitle,
  Collapse,
  IconButton
} from '@mui/material';
import { 
  ErrorOutline,
  Refresh,
  Home,
  ExpandMore,
  ExpandLess,
  BugReport
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const ErrorContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(3),
  textAlign: 'center'
}));

const ErrorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  width: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[8]
}));

const ErrorIcon = styled(ErrorOutline)(({ theme }) => ({
  fontSize: 80,
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2)
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  marginTop: theme.spacing(3),
  flexWrap: 'wrap'
}));

// Error fallback component
const ErrorFallback = ({ 
  error, 
  resetErrorBoundary, 
  title = "Something went wrong",
  subtitle = "We're sorry, but something unexpected happened.",
  showDetails = false,
  showHomeButton = true,
  showRefreshButton = true,
  showReportButton = false,
  onReport = null
}) => {
  const [showErrorDetails, setShowErrorDetails] = React.useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handleRefresh = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReport = () => {
    if (onReport) {
      onReport(error);
    } else {
      // Default report behavior - could send to analytics
      console.log('Error reported:', error);
    }
  };

  return (
    <ErrorContainer>
      <ErrorPaper elevation={8}>
        <ErrorIcon />
        
        <Typography variant="h4" component="h1" gutterBottom color="error">
          {title}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          {subtitle}
        </Typography>

        {isDevelopment && error && (
          <Alert severity="error" sx={{ marginBottom: 2, textAlign: 'left' }}>
            <AlertTitle>Development Error Details</AlertTitle>
            <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
              {error.toString()}
            </Typography>
          </Alert>
        )}

        {(showDetails || isDevelopment) && error && (
          <Box sx={{ marginTop: 2, marginBottom: 2 }}>
            <Button
              onClick={() => setShowErrorDetails(!showErrorDetails)}
              startIcon={showErrorDetails ? <ExpandLess /> : <ExpandMore />}
              variant="text"
              size="small"
            >
              {showErrorDetails ? 'Hide' : 'Show'} Error Details
            </Button>
            
            <Collapse in={showErrorDetails}>
              <Alert severity="warning" sx={{ marginTop: 1, textAlign: 'left' }}>
                <Typography variant="body2" component="pre" sx={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {error.stack || error.toString()}
                </Typography>
              </Alert>
            </Collapse>
          </Box>
        )}

        <ButtonContainer>
          {showRefreshButton && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              size="large"
            >
              Try Again
            </Button>
          )}
          
          {showHomeButton && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Home />}
              onClick={handleGoHome}
              size="large"
            >
              Go Home
            </Button>
          )}
          
          {showReportButton && (
            <Button
              variant="text"
              color="secondary"
              startIcon={<BugReport />}
              onClick={handleReport}
              size="large"
            >
              Report Issue
            </Button>
          )}
        </ButtonContainer>

        <Typography variant="caption" color="text.secondary" sx={{ marginTop: 3, display: 'block' }}>
          Error ID: {Date.now().toString(36)}
        </Typography>
      </ErrorPaper>
    </ErrorContainer>
  );
};

// Main Error Boundary class component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      eventId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // This would send error to your error monitoring service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.props.userId || 'anonymous'
      };

      // Send to monitoring service
      // Example: Sentry.captureException(error, { extra: errorData });
      console.log('Error logged to service:', errorData);
    } catch (logError) {
      console.error('Failed to log error to service:', logError);
    }
  };

  resetErrorBoundary = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      eventId: null
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetErrorBoundary);
      }

      // Use FallbackComponent if provided
      if (this.props.FallbackComponent) {
        return (
          <this.props.FallbackComponent
            error={this.state.error}
            resetErrorBoundary={this.resetErrorBoundary}
            {...this.props.fallbackProps}
          />
        );
      }

      // Default fallback
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
          {...this.props.fallbackProps}
        />
      );
    }

    return this.props.children;
  }
}

// Hook for error handling
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error, errorInfo = {}) => {
    console.error('Error captured:', error, errorInfo);
    setError(error);
    
    // Log to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to error monitoring service
    }
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

// Higher-order component for error boundaries
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Async error boundary for handling async errors
export const AsyncErrorBoundary = ({ children, onError, ...props }) => {
  const { captureError } = useErrorHandler();

  React.useEffect(() => {
    const handleUnhandledRejection = (event) => {
      captureError(event.reason);
      if (onError) {
        onError(event.reason);
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [captureError, onError]);

  return (
    <ErrorBoundary onError={onError} {...props}>
      {children}
    </ErrorBoundary>
  );
};

// Specialized error boundaries
export const PageErrorBoundary = ({ children, ...props }) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    fallbackProps={{
      title: "Page Error",
      subtitle: "There was an error loading this page.",
      showHomeButton: true,
      showRefreshButton: true
    }}
    {...props}
  >
    {children}
  </ErrorBoundary>
);

export const ComponentErrorBoundary = ({ children, componentName, ...props }) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    fallbackProps={{
      title: `${componentName} Error`,
      subtitle: `There was an error in the ${componentName} component.`,
      showHomeButton: false,
      showRefreshButton: true
    }}
    {...props}
  >
    {children}
  </ErrorBoundary>
);

export const APIErrorBoundary = ({ children, ...props }) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    fallbackProps={{
      title: "Connection Error",
      subtitle: "There was an error connecting to our servers. Please check your internet connection and try again.",
      showHomeButton: true,
      showRefreshButton: true,
      showReportButton: true
    }}
    {...props}
  >
    {children}
  </ErrorBoundary>
);

export { ErrorFallback };
export default ErrorBoundary;