import { toast as toastify } from 'react-toastify';

// Toast configuration
const defaultOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light'
};

// Toast service
const toast = {
  // Success toast
  success: (message, options = {}) => {
    toastify.success(message, {
      ...defaultOptions,
      ...options
    });
  },

  // Error toast
  error: (message, options = {}) => {
    toastify.error(message, {
      ...defaultOptions,
      autoClose: 5000,
      ...options
    });
  },

  // Warning toast
  warning: (message, options = {}) => {
    toastify.warning(message, {
      ...defaultOptions,
      ...options
    });
  },

  // Info toast
  info: (message, options = {}) => {
    toastify.info(message, {
      ...defaultOptions,
      ...options
    });
  },

  // Loading toast (shows until dismissed or updated)
  loading: (message, options = {}) => {
    return toastify.loading(message, {
      ...defaultOptions,
      autoClose: false,
      ...options
    });
  },

  // Update an existing toast
  update: (toastId, options) => {
    toastify.update(toastId, {
      ...defaultOptions,
      ...options
    });
  },

  // Dismiss a toast
  dismiss: (toastId) => {
    if (toastId) {
      toastify.dismiss(toastId);
    } else {
      toastify.dismiss();
    }
  },

  // Promise-based toast (shows loading, then success/error)
  promise: (promise, messages, options = {}) => {
    return toastify.promise(
      promise,
      {
        pending: messages.pending || 'Processing...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong'
      },
      {
        ...defaultOptions,
        ...options
      }
    );
  },

  // Custom toast with JSX content
  custom: (content, options = {}) => {
    toastify(content, {
      ...defaultOptions,
      ...options
    });
  },

  // Predefined messages for common actions
  messages: {
    // Auth messages
    loginSuccess: () => toast.success('Successfully logged in!'),
    loginError: (error) => toast.error(error || 'Login failed. Please try again.'),
    logoutSuccess: () => toast.success('Successfully logged out!'),
    registerSuccess: () => toast.success('Account created successfully!'),
    registerError: (error) => toast.error(error || 'Registration failed. Please try again.'),
    
    // Cart messages
    addToCart: (productName) => toast.success(`${productName} added to cart!`),
    removeFromCart: (productName) => toast.success(`${productName} removed from cart`),
    updateCartItem: () => toast.success('Cart updated'),
    clearCart: () => toast.success('Cart cleared'),
    cartError: (error) => toast.error(error || 'Failed to update cart'),
    
    // Order messages
    orderPlaced: () => toast.success('Order placed successfully!'),
    orderCancelled: () => toast.success('Order cancelled'),
    orderError: (error) => toast.error(error || 'Failed to process order'),
    paymentSuccess: () => toast.success('Payment successful!'),
    paymentFailed: (error) => toast.error(error || 'Payment failed. Please try again.'),
    
    // Product messages
    productAdded: () => toast.success('Product added successfully!'),
    productUpdated: () => toast.success('Product updated successfully!'),
    productDeleted: () => toast.success('Product deleted'),
    productError: (error) => toast.error(error || 'Failed to process product operation'),
    
    // Review messages
    reviewSubmitted: () => toast.success('Review submitted successfully!'),
    reviewUpdated: () => toast.success('Review updated'),
    reviewDeleted: () => toast.success('Review deleted'),
    reviewError: (error) => toast.error(error || 'Failed to process review'),
    
    // Address messages
    addressAdded: () => toast.success('Address added successfully!'),
    addressUpdated: () => toast.success('Address updated'),
    addressDeleted: () => toast.success('Address deleted'),
    addressError: (error) => toast.error(error || 'Failed to process address'),
    
    // Profile messages
    profileUpdated: () => toast.success('Profile updated successfully!'),
    profileError: (error) => toast.error(error || 'Failed to update profile'),
    passwordChanged: () => toast.success('Password changed successfully!'),
    passwordError: (error) => toast.error(error || 'Failed to change password'),
    
    // Admin messages
    inventoryUpdated: () => toast.success('Inventory updated'),
    categoryAdded: () => toast.success('Category added'),
    categoryUpdated: () => toast.success('Category updated'),
    categoryDeleted: () => toast.success('Category deleted'),
    orderStatusUpdated: () => toast.success('Order status updated'),
    
    // Generic messages
    saveSuccess: () => toast.success('Saved successfully!'),
    saveError: (error) => toast.error(error || 'Failed to save'),
    deleteSuccess: () => toast.success('Deleted successfully!'),
    deleteError: (error) => toast.error(error || 'Failed to delete'),
    updateSuccess: () => toast.success('Updated successfully!'),
    updateError: (error) => toast.error(error || 'Failed to update'),
    loadError: (error) => toast.error(error || 'Failed to load data'),
    networkError: () => toast.error('Network error. Please check your connection.'),
    permissionDenied: () => toast.error('You don\'t have permission to perform this action'),
    sessionExpired: () => toast.error('Your session has expired. Please log in again.'),
    
    // Form validation messages
    validationError: () => toast.error('Please check the form for errors'),
    requiredFields: () => toast.error('Please fill in all required fields'),
    
    // File upload messages
    uploadSuccess: () => toast.success('File uploaded successfully!'),
    uploadError: (error) => toast.error(error || 'Failed to upload file'),
    fileTooLarge: () => toast.error('File size is too large'),
    invalidFileType: () => toast.error('Invalid file type'),
    
    // Copy/clipboard messages
    copiedToClipboard: () => toast.success('Copied to clipboard!'),
    
    // Search messages
    noResults: () => toast.info('No results found'),
    
    // Stock messages
    outOfStock: () => toast.error('This product is out of stock'),
    lowStock: (quantity) => toast.warning(`Only ${quantity} items left in stock!`)
  }
};

export default toast;