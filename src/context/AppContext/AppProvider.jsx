import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from '../AuthContext/AuthContext';
import { CartProvider } from '../CartContext/CartContext';
import { ProductProvider } from '../ProductContext/ProductContext';
import theme from '../../utils/theme/theme';
import { BUSINESS_CONSTANTS } from '../../utils/constants/orderStatus';

// App context
const AppContext = createContext();

// App action types
const APP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ONLINE: 'SET_ONLINE',
  SET_MOBILE: 'SET_MOBILE',
  SET_THEME: 'SET_THEME',
  SET_DRAWER_OPEN: 'SET_DRAWER_OPEN',
  SET_SEARCH_OPEN: 'SET_SEARCH_OPEN',
  SET_CART_OPEN: 'SET_CART_OPEN',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  loading: false,
  isOnline: navigator.onLine,
  isMobile: window.innerWidth < 768,
  theme: 'light',
  ui: {
    drawerOpen: false,
    searchOpen: false,
    cartOpen: false
  },
  notifications: [],
  error: null,
  appVersion: BUSINESS_CONSTANTS.appVersion || '1.0.0',
  lastUpdated: null
};

// App reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case APP_ACTIONS.SET_ONLINE:
      return {
        ...state,
        isOnline: action.payload
      };

    case APP_ACTIONS.SET_MOBILE:
      return {
        ...state,
        isMobile: action.payload
      };

    case APP_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };

    case APP_ACTIONS.SET_DRAWER_OPEN:
      return {
        ...state,
        ui: {
          ...state.ui,
          drawerOpen: action.payload
        }
      };

    case APP_ACTIONS.SET_SEARCH_OPEN:
      return {
        ...state,
        ui: {
          ...state.ui,
          searchOpen: action.payload
        }
      };

    case APP_ACTIONS.SET_CART_OPEN:
      return {
        ...state,
        ui: {
          ...state.ui,
          cartOpen: action.payload
        }
      };

    case APP_ACTIONS.SET_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          ...action.payload
        }]
      };

    case APP_ACTIONS.CLEAR_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };

    case APP_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };

    case APP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// App provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => dispatch({ type: APP_ACTIONS.SET_ONLINE, payload: true });
    const handleOffline = () => dispatch({ type: APP_ACTIONS.SET_ONLINE, payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      dispatch({ type: APP_ACTIONS.SET_MOBILE, payload: window.innerWidth < 768 });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('nutrition_shop_theme');
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      dispatch({ type: APP_ACTIONS.SET_THEME, payload: savedTheme });
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('nutrition_shop_theme', state.theme);
  }, [state.theme]);

  // Set global loading
  const setLoading = (loading) => {
    dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading });
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    dispatch({ type: APP_ACTIONS.SET_THEME, payload: newTheme });
  };

  // Toggle drawer
  const toggleDrawer = (open = null) => {
    const isOpen = open !== null ? open : !state.ui.drawerOpen;
    dispatch({ type: APP_ACTIONS.SET_DRAWER_OPEN, payload: isOpen });
  };

  // Toggle search
  const toggleSearch = (open = null) => {
    const isOpen = open !== null ? open : !state.ui.searchOpen;
    dispatch({ type: APP_ACTIONS.SET_SEARCH_OPEN, payload: isOpen });
  };

  // Toggle cart drawer
  const toggleCart = (open = null) => {
    const isOpen = open !== null ? open : !state.ui.cartOpen;
    dispatch({ type: APP_ACTIONS.SET_CART_OPEN, payload: isOpen });
  };

  // Add notification
  const addNotification = (notification) => {
    dispatch({ type: APP_ACTIONS.SET_NOTIFICATION, payload: notification });
    
    // Auto-remove notification after timeout
    if (notification.timeout !== 0) {
      setTimeout(() => {
        removeNotification(Date.now());
      }, notification.timeout || 5000);
    }
  };

  // Remove notification
  const removeNotification = (id) => {
    dispatch({ type: APP_ACTIONS.CLEAR_NOTIFICATION, payload: id });
  };

  // Show success notification
  const showSuccess = (message, options = {}) => {
    addNotification({
      type: 'success',
      message,
      ...options
    });
  };

  // Show error notification
  const showError = (message, options = {}) => {
    addNotification({
      type: 'error',
      message,
      ...options
    });
  };

  // Show info notification
  const showInfo = (message, options = {}) => {
    addNotification({
      type: 'info',
      message,
      ...options
    });
  };

  // Show warning notification
  const showWarning = (message, options = {}) => {
    addNotification({
      type: 'warning',
      message,
      ...options
    });
  };

  // Set global error
  const setError = (error) => {
    dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error });
  };

  // Clear global error
  const clearError = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_ERROR });
  };

  // Handle global errors
  const handleError = (error, context = '') => {
    console.error(`Error in ${context}:`, error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (error?.error) {
      errorMessage = error.error;
    }

    setError(errorMessage);
    showError(errorMessage);
  };

  // Check if device is mobile
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || state.isMobile;
  };

  // Check if app is online
  const isAppOnline = () => {
    return state.isOnline;
  };

  // Get device info
  const getDeviceInfo = () => {
    return {
      isMobile: state.isMobile,
      isOnline: state.isOnline,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      javaEnabled: navigator.javaEnabled?.() || false
    };
  };

  // Get app info
  const getAppInfo = () => {
    return {
      version: state.appVersion,
      theme: state.theme,
      environment: process.env.NODE_ENV,
      buildDate: process.env.REACT_APP_BUILD_DATE || 'Unknown'
    };
  };

  // Check if feature is enabled
  const isFeatureEnabled = (feature) => {
    // This can be enhanced with feature flags
    const features = {
      darkMode: true,
      notifications: true,
      cart: true,
      search: true,
      reviews: true,
      wishlist: true,
      recommendations: true
    };
    
    return features[feature] || false;
  };

  // Update UI state
  const updateUI = (updates) => {
    Object.entries(updates).forEach(([key, value]) => {
      switch (key) {
        case 'drawerOpen':
          dispatch({ type: APP_ACTIONS.SET_DRAWER_OPEN, payload: value });
          break;
        case 'searchOpen':
          dispatch({ type: APP_ACTIONS.SET_SEARCH_OPEN, payload: value });
          break;
        case 'cartOpen':
          dispatch({ type: APP_ACTIONS.SET_CART_OPEN, payload: value });
          break;
        default:
          break;
      }
    });
  };

  // Context value
  const appContextValue = {
    // State
    ...state,
    
    // Loading
    setLoading,
    
    // Theme
    toggleTheme,
    
    // UI controls
    toggleDrawer,
    toggleSearch,
    toggleCart,
    updateUI,
    
    // Notifications
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    
    // Error handling
    setError,
    clearError,
    handleError,
    
    // Utility methods
    isMobileDevice,
    isAppOnline,
    getDeviceInfo,
    getAppInfo,
    isFeatureEnabled
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              {children}
              
              {/* Global Toast Container */}
              <ToastContainer
                position={state.isMobile ? "bottom-center" : "top-right"}
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={state.theme}
                style={{
                  fontSize: '14px'
                }}
                toastStyle={{
                  backgroundColor: state.theme === 'dark' ? '#333' : '#fff',
                  color: state.theme === 'dark' ? '#fff' : '#333'
                }}
              />
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

// Custom hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};

// Higher-order component for error boundary
export const withErrorBoundary = (WrappedComponent) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error boundary caught an error:', error, errorInfo);
      
      // You can log the error to an error reporting service here
      if (this.context?.handleError) {
        this.context.handleError(error, 'ErrorBoundary');
      }
    }

    render() {
      if (this.state.hasError) {
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h2>Something went wrong!</h2>
            <p>We're sorry, but something unexpected happened.</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2E7D32',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Reload Page
            </button>
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

export default AppContext;