import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../../services/firebase/auth';
import { toast } from 'react-toastify';

// Auth context
const AuthContext = createContext();

// Auth action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_INITIALIZED: 'SET_INITIALIZED'
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  error: null,
  initialized: false
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isAdmin: action.payload?.role === 'admin' || false,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AUTH_ACTIONS.SET_INITIALIZED:
      return {
        ...state,
        initialized: true,
        loading: false
      };
    
    default:
      return state;
  }
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = authService.addAuthListener((user) => {
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
      
      if (!state.initialized) {
        dispatch({ type: AUTH_ACTIONS.SET_INITIALIZED });
      }
    });

    return unsubscribe;
  }, [state.initialized]);

  // Register new user
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const result = await authService.register(
        userData.email,
        userData.password,
        {
          displayName: userData.displayName,
          phoneNumber: userData.phoneNumber
        }
      );
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const result = await authService.login(email, password);
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Logout user
  const logout = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const result = await authService.logout();
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || 'Logout failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const result = await authService.resetPassword(email);
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || 'Password reset failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Send email verification
  const sendEmailVerification = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const result = await authService.sendEmailVerification();
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to send verification email';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const result = await authService.updateUserProfile(updates);
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Update user email
  const updateEmail = async (newEmail, currentPassword) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const result = await authService.updateUserEmail(newEmail, currentPassword);
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || 'Email update failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Update user password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const result = await authService.updateUserPassword(currentPassword, newPassword);
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || 'Password update failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Delete user account
  const deleteAccount = async (currentPassword) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const result = await authService.deleteAccount(currentPassword);
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || 'Account deletion failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Check if user is admin
  const checkAdminStatus = async (uid = null) => {
    try {
      const isAdmin = await authService.isAdmin(uid);
      return isAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      if (state.user?.uid) {
        const userProfile = await authService.getUserProfile(state.user.uid);
        if (userProfile) {
          dispatch({
            type: AUTH_ACTIONS.SET_USER,
            payload: { ...state.user, ...userProfile }
          });
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!state.user) return false;
    
    // Admin has all permissions
    if (state.isAdmin) return true;
    
    // Check user-specific permissions
    const userPermissions = state.user.permissions || [];
    return userPermissions.includes(permission);
  };

  // Check if email is verified
  const isEmailVerified = () => {
    return state.user?.emailVerified || false;
  };

  // Get user display name
  const getDisplayName = () => {
    if (!state.user) return '';
    return state.user.displayName || state.user.email?.split('@')[0] || 'User';
  };

  // Context value
  const value = {
    // State
    ...state,
    
    // Authentication methods
    register,
    login,
    logout,
    resetPassword,
    sendEmailVerification,
    
    // Profile management
    updateProfile,
    updateEmail,
    updatePassword,
    deleteAccount,
    refreshUser,
    
    // Utility methods
    checkAdminStatus,
    hasPermission,
    isEmailVerified,
    getDisplayName,
    clearError,
    
    // Auth service reference (for advanced use cases)
    authService
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Higher-order component for protected routes
export const withAuth = (WrappedComponent, requireAdmin = false) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isAdmin, loading, initialized } = useAuth();
    
    // Show loading while auth is initializing
    if (!initialized || loading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          Loading...
        </div>
      );
    }
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }
    
    // Check admin requirement
    if (requireAdmin && !isAdmin) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column'
        }}>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
};

export default AuthContext;