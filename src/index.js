import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/styles/global.css';

// Performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Service worker registration for PWA capabilities
const isProduction = process.env.NODE_ENV === 'production';

// Web Vitals reporting
function sendToAnalytics(metric) {
  // In production, you would send these metrics to your analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metric);
  }
  
  // Example: Send to Google Analytics
  // gtag('event', metric.name, {
  //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  //   event_category: 'Web Vitals',
  //   event_label: metric.id,
  //   non_interaction: true,
  // });
}

// Register web vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// Get the root element
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found. Make sure you have a div with id="root" in your index.html');
}

// Create root and render app
const root = createRoot(container);

// Error boundary for the entire app
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service
    if (isProduction) {
      // Example: Send to error monitoring service
      // Sentry.captureException(error, { extra: errorInfo });
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
          fontFamily: 'Roboto, sans-serif',
          textAlign: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxWidth: '500px'
          }}>
            <h1 style={{ color: '#d32f2f', marginBottom: '16px' }}>
              Oops! Something went wrong
            </h1>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#2E7D32',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                marginRight: '12px'
              }}
            >
              Refresh Page
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                backgroundColor: 'transparent',
                color: '#2E7D32',
                border: '1px solid #2E7D32',
                padding: '12px 24px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Go Home
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '20px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px'
                }}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Render the app
root.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);

// Service Worker registration for PWA
if (isProduction && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                if (window.confirm('New version available! Refresh to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Hot module replacement for development
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    root.render(
      <React.StrictMode>
        <AppErrorBoundary>
          <NextApp />
        </AppErrorBoundary>
      </React.StrictMode>
    );
  });
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  if (isProduction) {
    // Send to error monitoring service
    // Sentry.captureException(event.error);
  }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  if (isProduction) {
    // Send to error monitoring service
    // Sentry.captureException(event.reason);
  }
  
  // Prevent the default browser behavior
  event.preventDefault();
});

// Development helpers
if (process.env.NODE_ENV === 'development') {
  // Add helpful global variables for debugging
  window.__APP_VERSION__ = process.env.REACT_APP_VERSION || '1.0.0';
  window.__BUILD_DATE__ = process.env.REACT_APP_BUILD_DATE || new Date().toISOString();
  
  console.log('%c🍃 Nutrition Shop App', 'color: #2E7D32; font-size: 16px; font-weight: bold;');
  console.log(`Version: ${window.__APP_VERSION__}`);
  console.log(`Build Date: ${window.__BUILD_DATE__}`);
  console.log('Running in development mode');
}

// Performance observer for monitoring
if ('PerformanceObserver' in window) {
  // Monitor long tasks
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('Long task detected:', entry);
        }
      }
    });
    observer.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    // PerformanceObserver not supported
  }
}

// Disable console in production
if (isProduction) {
  console.log = function() {};
  console.warn = function() {};
  console.error = function() {};
}