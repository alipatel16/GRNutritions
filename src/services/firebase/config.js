import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'databaseURL',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
  }
};

// Validate configuration
validateFirebaseConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

// Development environment emulator connections
if (process.env.NODE_ENV === 'development') {
  // Check if emulators are running and connect
  try {
    // Auth emulator
    if (process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true') {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectDatabaseEmulator(database, 'localhost', 9000);
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('🔥 Connected to Firebase emulators');
    }
  } catch (error) {
    console.warn('Firebase emulators not available:', error.message);
  }
}

// Export the app instance
export default app;

// Helper function to get current environment
export const getEnvironment = () => {
  return process.env.REACT_APP_ENVIRONMENT || 'development';
};

// Helper function to check if in production
export const isProduction = () => {
  return getEnvironment() === 'production';
};

// App constants
export const APP_CONFIG = {
  name: process.env.REACT_APP_APP_NAME || 'Nutrition Shop',
  version: process.env.REACT_APP_APP_VERSION || '1.0.0',
  environment: getEnvironment(),
  isProduction: isProduction(),
  itemsPerPage: parseInt(process.env.REACT_APP_ITEMS_PER_PAGE) || 12,
  maxCartQuantity: parseInt(process.env.REACT_APP_MAX_CART_QUANTITY) || 99,
  minOrderAmount: parseInt(process.env.REACT_APP_MIN_ORDER_AMOUNT) || 500,
  adminEmail: process.env.REACT_APP_ADMIN_EMAIL || 'admin@nutritionshop.com'
};