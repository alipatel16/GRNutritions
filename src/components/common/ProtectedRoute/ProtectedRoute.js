import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Lock, 
  Login, 
  AdminPanelSettings,
  VerifiedUser,
  Email
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Hooks and contexts
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { ROUTES } from '../../../utils/constants/routes';

// Styled components
const AccessDeniedContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(3),
  textAlign: 'center'
}));

const AccessDeniedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 500,
  width: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4]
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  gap: theme.spacing(2)
}));

// Access denied component
const AccessDenied = ({ 
  type = 'login', 
  title, 
  message, 
  actionButton,
  onAction,
  icon: IconComponent 
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'admin':
        return {
          title: 'Admin Access Required',
          message: 'You need administrator privileges to access this page.',
          icon: AdminPanelSettings,
          actionText: 'Go to Home',
          actionPath: ROUTES.HOME
        };
      case 'verification':
        return {
          title: 'Email Verification Required',
          message: 'Please verify your email address to access this feature.',
          icon: Email,
          actionText: 'Resend Verification',
          actionPath: null
        };
      case 'premium':
        return {
          title: 'Premium Access Required',
          message: 'This feature is only available to premium members.',
          icon: VerifiedUser,
          actionText: 'Upgrade Account',
          actionPath: '/upgrade'
        };
      default:
        return {
          title: 'Login Required',
          message: 'Please log in to access this page.',
          icon: Lock,
          actionText: 'Go to Login',
          actionPath: ROUTES.LOGIN
        };
    }
  };

  const defaults = getDefaultContent();
  const Icon = IconComponent || defaults.icon;

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (defaults.actionPath) {
      window.location.href = defaults.actionPath;
    }
  };

  return (
    <AccessDeniedContainer>
      <AccessDeniedPaper>
        <Icon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        
        <Typography variant="h4" component="h1" gutterBottom color="error">
          {title || defaults.title}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          {message || defaults.message}
        </Typography>

        {(actionButton || defaults.actionText) && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAction}
            sx={{ mt: 2 }}
          >
            {actionButton || defaults.actionText}
          </Button>
        )}
      </AccessDeniedPaper>
    </AccessDeniedContainer>
  );
};

// Loading component for auth checks
const AuthLoading = ({ message = 'Checking authentication...' }) => (
  <LoadingContainer>
    <CircularProgress size={40} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </LoadingContainer>
);

// Main ProtectedRoute component
const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireEmailVerification = false,
  requireSubscription = false,
  redirectTo = null,
  fallback = null,
  permissions = [],
  roles = [],
  customCheck = null,
  onAccessDenied = null
}) => {
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    loading, 
    initialized, 
    hasPermission,
    isEmailVerified
  } = useAuth();
  
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // Wait for auth to initialize
  useEffect(() => {
    if (initialized) {
      setIsChecking(false);
    }
  }, [initialized]);

  // Show loading while checking auth
  if (loading || isChecking || !initialized) {
    return <AuthLoading />;
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    if (onAccessDenied) {
      onAccessDenied('authentication', { user, location });
    }
    
    if (fallback) {
      return fallback;
    }
    
    if (redirectTo) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
    
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check admin requirements
  if (requireAdmin && !isAdmin) {
    if (onAccessDenied) {
      onAccessDenied('admin', { user, location });
    }
    
    return (
      <AccessDenied 
        type="admin"
        onAction={() => window.location.href = ROUTES.HOME}
      />
    );
  }

  // Check email verification
  if (requireEmailVerification && !isEmailVerified()) {
    if (onAccessDenied) {
      onAccessDenied('verification', { user, location });
    }
    
    return <AccessDenied type="verification" />;
  }

  // Check subscription requirements
  if (requireSubscription && !user?.subscription?.active) {
    if (onAccessDenied) {
      onAccessDenied('subscription', { user, location });
    }
    
    return <AccessDenied type="premium" />;
  }

  // Check specific permissions
  if (permissions.length > 0) {
    const hasRequiredPermissions = permissions.every(permission => 
      hasPermission(permission)
    );
    
    if (!hasRequiredPermissions) {
      if (onAccessDenied) {
        onAccessDenied('permissions', { user, location, permissions });
      }
      
      return (
        <AccessDenied 
          title="Insufficient Permissions"
          message="You don't have the required permissions to access this page."
        />
      );
    }
  }

  // Check user roles
  if (roles.length > 0) {
    const hasRequiredRole = roles.includes(user?.role);
    
    if (!hasRequiredRole) {
      if (onAccessDenied) {
        onAccessDenied('role', { user, location, roles });
      }
      
      return (
        <AccessDenied 
          title="Access Restricted"
          message="Your account role doesn't have access to this page."
        />
      );
    }
  }

  // Custom access check
  if (customCheck) {
    const customCheckResult = customCheck(user, location);
    
    if (customCheckResult !== true) {
      if (onAccessDenied) {
        onAccessDenied('custom', { user, location, result: customCheckResult });
      }
      
      if (typeof customCheckResult === 'string') {
        return (
          <AccessDenied 
            title="Access Denied"
            message={customCheckResult}
          />
        );
      }
      
      return (
        <AccessDenied 
          title="Access Denied"
          message="You don't have access to this page."
        />
      );
    }
  }

  // All checks passed, render children
  return <>{children}</>;
};

// Higher-order component version
export const withProtectedRoute = (Component, protectionOptions = {}) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...protectionOptions}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Specialized protected route components
export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute requireAdmin={true} {...props}>
    {children}
  </ProtectedRoute>
);

export const AuthRoute = ({ children, ...props }) => (
  <ProtectedRoute requireAuth={true} {...props}>
    {children}
  </ProtectedRoute>
);

export const VerifiedRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requireAuth={true} 
    requireEmailVerification={true} 
    {...props}
  >
    {children}
  </ProtectedRoute>
);

export const PremiumRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requireAuth={true} 
    requireSubscription={true} 
    {...props}
  >
    {children}
  </ProtectedRoute>
);

// Route guard hook
export const useRouteGuard = (requirements = {}) => {
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    hasPermission, 
    isEmailVerified 
  } = useAuth();

  const checkAccess = React.useCallback(() => {
    const {
      requireAuth = false,
      requireAdmin = false,
      requireEmailVerification = false,
      requireSubscription = false,
      permissions = [],
      roles = [],
      customCheck = null
    } = requirements;

    // Authentication check
    if (requireAuth && !isAuthenticated) {
      return { hasAccess: false, reason: 'authentication' };
    }

    // Admin check
    if (requireAdmin && !isAdmin) {
      return { hasAccess: false, reason: 'admin' };
    }

    // Email verification check
    if (requireEmailVerification && !isEmailVerified()) {
      return { hasAccess: false, reason: 'verification' };
    }

    // Subscription check
    if (requireSubscription && !user?.subscription?.active) {
      return { hasAccess: false, reason: 'subscription' };
    }

    // Permissions check
    if (permissions.length > 0) {
      const hasRequiredPermissions = permissions.every(permission => 
        hasPermission(permission)
      );
      if (!hasRequiredPermissions) {
        return { hasAccess: false, reason: 'permissions' };
      }
    }

    // Role check
    if (roles.length > 0) {
      const hasRequiredRole = roles.includes(user?.role);
      if (!hasRequiredRole) {
        return { hasAccess: false, reason: 'role' };
      }
    }

    // Custom check
    if (customCheck) {
      const result = customCheck(user);
      if (result !== true) {
        return { hasAccess: false, reason: 'custom', details: result };
      }
    }

    return { hasAccess: true };
  }, [
    user, 
    isAuthenticated, 
    isAdmin, 
    hasPermission, 
    isEmailVerified, 
    requirements
  ]);

  return checkAccess();
};

// Conditional rendering based on permissions
export const PermissionGate = ({ 
  children, 
  permission, 
  role, 
  requireAdmin = false,
  fallback = null,
  inverse = false 
}) => {
  const { hasPermission, isAdmin, user } = useAuth();

  let hasAccess = true;

  if (requireAdmin) {
    hasAccess = isAdmin;
  } else if (permission) {
    hasAccess = hasPermission(permission);
  } else if (role) {
    hasAccess = user?.role === role;
  }

  // Inverse the logic if specified
  if (inverse) {
    hasAccess = !hasAccess;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return fallback;
};

export { AccessDenied, AuthLoading };
export default ProtectedRoute;