// Order status constants
export const ORDER_STATUS = {
  PENDING: {
    id: 'pending',
    label: 'Pending',
    description: 'Order received and awaiting confirmation',
    color: '#FF9800',
    icon: 'pending',
    allowedTransitions: ['confirmed', 'cancelled']
  },
  CONFIRMED: {
    id: 'confirmed',
    label: 'Confirmed',
    description: 'Order confirmed and being prepared',
    color: '#2196F3',
    icon: 'check_circle',
    allowedTransitions: ['processing', 'cancelled']
  },
  PROCESSING: {
    id: 'processing',
    label: 'Processing',
    description: 'Order is being prepared for shipment',
    color: '#9C27B0',
    icon: 'hourglass_empty',
    allowedTransitions: ['shipped', 'cancelled']
  },
  SHIPPED: {
    id: 'shipped',
    label: 'Shipped',
    description: 'Order has been shipped and is on the way',
    color: '#FF5722',
    icon: 'local_shipping',
    allowedTransitions: ['delivered', 'returned']
  },
  DELIVERED: {
    id: 'delivered',
    label: 'Delivered',
    description: 'Order has been successfully delivered',
    color: '#4CAF50',
    icon: 'done_all',
    allowedTransitions: ['returned']
  },
  CANCELLED: {
    id: 'cancelled',
    label: 'Cancelled',
    description: 'Order has been cancelled',
    color: '#F44336',
    icon: 'cancel',
    allowedTransitions: []
  },
  RETURNED: {
    id: 'returned',
    label: 'Returned',
    description: 'Order has been returned',
    color: '#795548',
    icon: 'keyboard_return',
    allowedTransitions: ['refunded']
  },
  REFUNDED: {
    id: 'refunded',
    label: 'Refunded',
    description: 'Order amount has been refunded',
    color: '#607D8B',
    icon: 'money_off',
    allowedTransitions: []
  }
};

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: {
    id: 'pending',
    label: 'Pending',
    description: 'Payment is being processed',
    color: '#FF9800',
    icon: 'pending'
  },
  COMPLETED: {
    id: 'completed',
    label: 'Completed',
    description: 'Payment has been successfully processed',
    color: '#4CAF50',
    icon: 'check_circle'
  },
  FAILED: {
    id: 'failed',
    label: 'Failed',
    description: 'Payment processing failed',
    color: '#F44336',
    icon: 'error'
  },
  REFUNDED: {
    id: 'refunded',
    label: 'Refunded',
    description: 'Payment has been refunded',
    color: '#607D8B',
    icon: 'money_off'
  },
  PARTIALLY_REFUNDED: {
    id: 'partially_refunded',
    label: 'Partially Refunded',
    description: 'Part of the payment has been refunded',
    color: '#795548',
    icon: 'partial_payment'
  }
};

// User roles
export const USER_ROLES = {
  USER: {
    id: 'user',
    label: 'Customer',
    permissions: ['read_products', 'create_order', 'manage_profile', 'write_review']
  },
  ADMIN: {
    id: 'admin',
    label: 'Administrator',
    permissions: [
      'read_products', 'write_products', 'delete_products',
      'read_orders', 'write_orders', 'delete_orders',
      'read_users', 'write_users', 'delete_users',
      'read_reviews', 'write_reviews', 'delete_reviews',
      'manage_inventory', 'manage_categories', 'view_analytics'
    ]
  },
  MODERATOR: {
    id: 'moderator',
    label: 'Moderator',
    permissions: [
      'read_products', 'write_products',
      'read_orders', 'write_orders',
      'read_reviews', 'write_reviews', 'delete_reviews',
      'manage_inventory'
    ]
  }
};

// Inventory status
export const INVENTORY_STATUS = {
  IN_STOCK: {
    id: 'in_stock',
    label: 'In Stock',
    color: '#4CAF50',
    icon: 'check_circle'
  },
  LOW_STOCK: {
    id: 'low_stock',
    label: 'Low Stock',
    color: '#FF9800',
    icon: 'warning'
  },
  OUT_OF_STOCK: {
    id: 'out_of_stock',
    label: 'Out of Stock',
    color: '#F44336',
    icon: 'remove_circle'
  },
  DISCONTINUED: {
    id: 'discontinued',
    label: 'Discontinued',
    color: '#795548',
    icon: 'block'
  }
};

// Shipping methods
export const SHIPPING_METHODS = {
  STANDARD: {
    id: 'standard',
    label: 'Standard Delivery',
    description: '5-7 business days',
    price: 50,
    estimatedDays: 7,
    icon: 'local_shipping'
  },
  EXPRESS: {
    id: 'express',
    label: 'Express Delivery',
    description: '2-3 business days',
    price: 150,
    estimatedDays: 3,
    icon: 'speed'
  },
  OVERNIGHT: {
    id: 'overnight',
    label: 'Overnight Delivery',
    description: 'Next business day',
    price: 300,
    estimatedDays: 1,
    icon: 'flight_takeoff'
  },
  FREE: {
    id: 'free',
    label: 'Free Delivery',
    description: '7-10 business days (Orders above ₹999)',
    price: 0,
    estimatedDays: 10,
    minOrderAmount: 999,
    icon: 'local_shipping'
  }
};

// Business constants
export const BUSINESS_CONSTANTS = {
  // Currency
  CURRENCY: {
    symbol: '₹',
    code: 'INR',
    name: 'Indian Rupee'
  },

  // Tax configuration
  TAX: {
    GST_RATE: 0.18, // 18% GST
    HSN_CODES: {
      SUPPLEMENTS: '21069099',
      PROTEIN_POWDER: '21069010',
      VITAMINS: '21069020'
    }
  },

  // Order limits
  ORDER_LIMITS: {
    MIN_ORDER_AMOUNT: 500,
    MAX_ORDER_AMOUNT: 50000,
    MAX_QUANTITY_PER_ITEM: 99,
    MAX_ITEMS_PER_ORDER: 20
  },

  // Inventory thresholds
  INVENTORY_THRESHOLDS: {
    LOW_STOCK_THRESHOLD: 10,
    OUT_OF_STOCK_THRESHOLD: 0,
    REORDER_POINT: 5
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 48,
    ADMIN_PAGE_SIZE: 25
  },

  // File upload limits
  FILE_LIMITS: {
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf']
  },

  // Review system
  REVIEW_SYSTEM: {
    MIN_RATING: 1,
    MAX_RATING: 5,
    MAX_REVIEW_LENGTH: 500,
    REQUIRE_PURCHASE_FOR_REVIEW: true
  },

  // Cache durations (in seconds)
  CACHE_DURATION: {
    PRODUCTS: 300, // 5 minutes
    CATEGORIES: 600, // 10 minutes
    USER_SESSION: 3600, // 1 hour
    CART: 1800 // 30 minutes
  },

  // Contact information
  CONTACT_INFO: {
    SUPPORT_EMAIL: 'support@nutritionshop.com',
    SUPPORT_PHONE: '+91-9876543210',
    BUSINESS_HOURS: 'Mon-Sat: 9:00 AM - 8:00 PM',
    ADDRESS: {
      street: '123 Health Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    }
  }
};

// Helper functions
export const getOrderStatus = (statusId) => {
  return Object.values(ORDER_STATUS).find(status => status.id === statusId);
};

export const getPaymentStatus = (statusId) => {
  return Object.values(PAYMENT_STATUS).find(status => status.id === statusId);
};

export const getUserRole = (roleId) => {
  return Object.values(USER_ROLES).find(role => role.id === roleId);
};

export const getInventoryStatus = (stock, lowStockThreshold = BUSINESS_CONSTANTS.INVENTORY_THRESHOLDS.LOW_STOCK_THRESHOLD) => {
  if (stock <= 0) return INVENTORY_STATUS.OUT_OF_STOCK;
  if (stock <= lowStockThreshold) return INVENTORY_STATUS.LOW_STOCK;
  return INVENTORY_STATUS.IN_STOCK;
};

export const canTransitionOrderStatus = (currentStatus, newStatus) => {
  const current = getOrderStatus(currentStatus);
  return current ? current.allowedTransitions.includes(newStatus) : false;
};

export const calculateShippingCost = (orderAmount, shippingMethod = 'standard') => {
  const method = SHIPPING_METHODS[shippingMethod.toUpperCase()];
  if (!method) return SHIPPING_METHODS.STANDARD.price;

  // Free shipping for orders above minimum amount
  if (method.id === 'free' && orderAmount >= method.minOrderAmount) {
    return 0;
  }

  return method.price;
};

export const calculateTax = (amount, taxRate = BUSINESS_CONSTANTS.TAX.GST_RATE) => {
  return Math.round(amount * taxRate * 100) / 100;
};

export const formatCurrency = (amount) => {
  return `${BUSINESS_CONSTANTS.CURRENCY.symbol}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};

export const hasPermission = (userRole, permission) => {
  const role = getUserRole(userRole);
  return role ? role.permissions.includes(permission) : false;
};