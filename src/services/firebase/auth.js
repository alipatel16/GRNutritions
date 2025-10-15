import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  updateEmail,
  deleteUser
} from 'firebase/auth';
import { ref, set, get, update, serverTimestamp } from 'firebase/database';
import { auth, database } from './config';
import { USER_ROLES } from '../../utils/constants/orderStatus';

// Authentication service class
class AuthService {
  constructor() {
    this.currentUser = null;
    this.authListeners = [];
    this.isInitialized = false;
    
    // Initialize auth state listener
    this.initializeAuthListener();
  }

  // Initialize authentication state listener
  initializeAuthListener() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        try {
          const userProfile = await this.getUserProfile(user.uid);
          this.currentUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            ...userProfile
          };
        } catch (error) {
          console.error('Error fetching user profile:', error);
          this.currentUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL
          };
        }
      } else {
        // User is signed out
        this.currentUser = null;
      }
      
      this.isInitialized = true;
      this.notifyAuthListeners();
    });
  }

  // Add auth state listener
  addAuthListener(callback) {
    this.authListeners.push(callback);
    
    // If already initialized, call immediately
    if (this.isInitialized) {
      callback(this.currentUser);
    }
    
    // Return unsubscribe function
    return () => {
      this.authListeners = this.authListeners.filter(listener => listener !== callback);
    };
  }

  // Notify all auth listeners
  notifyAuthListeners() {
    this.authListeners.forEach(callback => {
      try {
        callback(this.currentUser);
      } catch (error) {
        console.error('Error in auth listener:', error);
      }
    });
  }

  // Register new user
  async register(email, password, userData = {}) {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name if provided
      if (userData.displayName) {
        await updateProfile(user, {
          displayName: userData.displayName
        });
      }

      // Create user profile in database
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName || '',
        phoneNumber: userData.phoneNumber || '',
        role: USER_ROLES.USER.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        emailVerified: false,
        isActive: true,
        addresses: {},
        preferences: {
          notifications: true,
          marketing: false
        }
      };

      await set(ref(database, `users/${user.uid}`), userProfile);

      // Send email verification
      await this.sendEmailVerification();

      return {
        success: true,
        user: userCredential.user,
        message: 'Account created successfully. Please verify your email.'
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign in user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login time
      await update(ref(database, `users/${user.uid}`), {
        lastLoginAt: serverTimestamp()
      });

      return {
        success: true,
        user: userCredential.user,
        message: 'Logged in successfully'
      };
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign out user
  async logout() {
    try {
      await signOut(auth);
      this.currentUser = null;
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Send password reset email
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent successfully'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Send email verification
  async sendEmailVerification() {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return {
          success: true,
          message: 'Verification email sent successfully'
        };
      }
      throw new Error('No user is currently signed in');
    } catch (error) {
      console.error('Email verification error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Update user profile
  async updateUserProfile(updates) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user is currently signed in');

      // Update Firebase Auth profile
      const authUpdates = {};
      if (updates.displayName !== undefined) authUpdates.displayName = updates.displayName;
      if (updates.photoURL !== undefined) authUpdates.photoURL = updates.photoURL;

      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(user, authUpdates);
      }

      // Update database profile
      const dbUpdates = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await update(ref(database, `users/${user.uid}`), dbUpdates);

      // Update current user state
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...updates };
        this.notifyAuthListeners();
      }

      return {
        success: true,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Profile update error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Update user email
  async updateUserEmail(newEmail, currentPassword) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user is currently signed in');

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update email
      await updateEmail(user, newEmail);

      // Update email in database
      await update(ref(database, `users/${user.uid}`), {
        email: newEmail,
        emailVerified: false,
        updatedAt: serverTimestamp()
      });

      // Send verification email for new email
      await this.sendEmailVerification();

      return {
        success: true,
        message: 'Email updated successfully. Please verify your new email.'
      };
    } catch (error) {
      console.error('Email update error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Update user password
  async updateUserPassword(currentPassword, newPassword) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user is currently signed in');

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      // Update last password change time
      await update(ref(database, `users/${user.uid}`), {
        lastPasswordChange: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      console.error('Password update error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Get user profile from database
  async getUserProfile(uid) {
    try {
      const snapshot = await get(ref(database, `users/${uid}`));
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Check if user is admin
  async isAdmin(uid = null) {
    try {
      const userId = uid || (this.currentUser ? this.currentUser.uid : null);
      if (!userId) return false;

      const adminSnapshot = await get(ref(database, `admins/${userId}`));
      const userSnapshot = await get(ref(database, `users/${userId}`));
      
      return adminSnapshot.exists() || 
             (userSnapshot.exists() && userSnapshot.val().role === USER_ROLES.ADMIN.id);
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Delete user account
  async deleteAccount(currentPassword) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user is currently signed in');

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Mark user as deleted in database (for data retention)
      await update(ref(database, `users/${user.uid}`), {
        isActive: false,
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Delete authentication account
      await deleteUser(user);

      this.currentUser = null;

      return {
        success: true,
        message: 'Account deleted successfully'
      };
    } catch (error) {
      console.error('Account deletion error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Check if user has verified email
  isEmailVerified() {
    return this.currentUser ? this.currentUser.emailVerified : false;
  }

  // Handle authentication errors
  handleAuthError(error) {
    let message = 'An error occurred. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again.';
        break;
      case 'auth/email-already-in-use':
        message = 'An account with this email address already exists.';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters long.';
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection and try again.';
        break;
      case 'auth/requires-recent-login':
        message = 'Please log in again to perform this action.';
        break;
      default:
        message = error.message || message;
        break;
    }

    return {
      code: error.code,
      message,
      originalError: error
    };
  }

  // Utility method to wait for auth initialization
  async waitForAuthInit() {
    if (this.isInitialized) return;
    
    return new Promise((resolve) => {
      const unsubscribe = this.addAuthListener(() => {
        if (this.isInitialized) {
          unsubscribe();
          resolve();
        }
      });
    });
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;