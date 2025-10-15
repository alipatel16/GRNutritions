// Application routes configuration
export const ROUTES = {
  // Public routes
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CATEGORY: '/category/:slug',
  SEARCH: '/search',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  TERMS: '/terms',
  PRIVACY: '/privacy',

  // Authentication routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // User dashboard routes
  USER_DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  ADDRESSES: '/dashboard/addresses',
  ORDERS: '/dashboard/orders',
  ORDER_DETAIL: '/dashboard/orders/:id',
  WISHLIST: '/dashboard/wishlist',
  REVIEWS: '/dashboard/reviews',
  SETTINGS: '/dashboard/settings',

  // Shopping routes
  CART: '/cart',
  CHECKOUT: '/checkout',
  PAYMENT: '/payment',
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_FAILURE: '/payment/failure',

  // Admin routes
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_ADD: '/admin/products/add',
  ADMIN_PRODUCT_EDIT: '/admin/products/:id/edit',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDER_DETAIL: '/admin/orders/:id',
  ADMIN_INVENTORY: '/admin/inventory',
  ADMIN_USERS: '/admin/users',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_ANALYTICS: '/admin/analytics',

  // Error routes
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
  MAINTENANCE: '/maintenance'
};

// Route builders for dynamic routes
export const ROUTE_BUILDERS = {
  productDetail: (id) => `/products/${id}`,
  category: (slug) => `/category/${slug}`,
  orderDetail: (id) => `/dashboard/orders/${id}`,
  adminOrderDetail: (id) => `/admin/orders/${id}`,
  adminProductEdit: (id) => `/admin/products/${id}/edit`,
  search: (query) => `/search?q=${encodeURIComponent(query)}`,
  categoryWithPage: (slug, page = 1) => `/category/${slug}?page=${page}`,
  productsWithFilters: (filters = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    return `/products${queryString ? `?${queryString}` : ''}`;
  }
};

// Navigation structure for main menu
export const NAVIGATION = {
  MAIN: [
    {
      title: 'Home',
      path: ROUTES.HOME,
      icon: 'home',
      public: true
    },
    {
      title: 'Products',
      path: ROUTES.PRODUCTS,
      icon: 'shopping_bag',
      public: true,
      children: [
        {
          title: 'All Products',
          path: ROUTES.PRODUCTS
        },
        {
          title: 'Protein',
          path: ROUTE_BUILDERS.category('protein')
        },
        {
          title: 'Mass Gainer',
          path: ROUTE_BUILDERS.category('mass-gainer')
        },
        {
          title: 'Vitamins & Minerals',
          path: ROUTE_BUILDERS.category('vitamins-minerals')
        },
        {
          title: 'Detox & Cleanse',
          path: ROUTE_BUILDERS.category('detox-cleanse')
        }
      ]
    },
    {
      title: 'Categories',
      path: '#',
      icon: 'category',
      public: true,
      dropdown: true
    },
    {
      title: 'About',
      path: ROUTES.ABOUT,
      icon: 'info',
      public: true
    },
    {
      title: 'Contact',
      path: ROUTES.CONTACT,
      icon: 'contact_mail',
      public: true
    }
  ],

  USER_DASHBOARD: [
    {
      title: 'Dashboard',
      path: ROUTES.USER_DASHBOARD,
      icon: 'dashboard'
    },
    {
      title: 'Profile',
      path: ROUTES.PROFILE,
      icon: 'person'
    },
    {
      title: 'Orders',
      path: ROUTES.ORDERS,
      icon: 'shopping_basket'
    },
    {
      title: 'Addresses',
      path: ROUTES.ADDRESSES,
      icon: 'location_on'
    },
    {
      title: 'Wishlist',
      path: ROUTES.WISHLIST,
      icon: 'favorite'
    },
    {
      title: 'Reviews',
      path: ROUTES.REVIEWS,
      icon: 'rate_review'
    },
    {
      title: 'Settings',
      path: ROUTES.SETTINGS,
      icon: 'settings'
    }
  ],

  ADMIN: [
    {
      title: 'Dashboard',
      path: ROUTES.ADMIN_DASHBOARD,
      icon: 'dashboard'
    },
    {
      title: 'Products',
      path: ROUTES.ADMIN_PRODUCTS,
      icon: 'inventory',
      children: [
        {
          title: 'All Products',
          path: ROUTES.ADMIN_PRODUCTS
        },
        {
          title: 'Add Product',
          path: ROUTES.ADMIN_PRODUCT_ADD
        },
        {
          title: 'Categories',
          path: ROUTES.ADMIN_CATEGORIES
        }
      ]
    },
    {
      title: 'Orders',
      path: ROUTES.ADMIN_ORDERS,
      icon: 'receipt_long'
    },
    {
      title: 'Inventory',
      path: ROUTES.ADMIN_INVENTORY,
      icon: 'warehouse'
    },
    {
      title: 'Users',
      path: ROUTES.ADMIN_USERS,
      icon: 'people'
    },
    {
      title: 'Reviews',
      path: ROUTES.ADMIN_REVIEWS,
      icon: 'reviews'
    },
    {
      title: 'Analytics',
      path: ROUTES.ADMIN_ANALYTICS,
      icon: 'analytics'
    },
    {
      title: 'Settings',
      path: ROUTES.ADMIN_SETTINGS,
      icon: 'admin_panel_settings'
    }
  ],

  FOOTER: [
    {
      title: 'Customer Service',
      links: [
        { title: 'Contact Us', path: ROUTES.CONTACT },
        { title: 'FAQ', path: ROUTES.FAQ },
        { title: 'Shipping Info', path: '/shipping' },
        { title: 'Returns', path: '/returns' }
      ]
    },
    {
      title: 'About',
      links: [
        { title: 'Our Story', path: ROUTES.ABOUT },
        { title: 'Careers', path: '/careers' },
        { title: 'Press', path: '/press' },
        { title: 'Blog', path: '/blog' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { title: 'Terms of Service', path: ROUTES.TERMS },
        { title: 'Privacy Policy', path: ROUTES.PRIVACY },
        { title: 'Cookie Policy', path: '/cookies' },
        { title: 'Disclaimer', path: '/disclaimer' }
      ]
    }
  ]
};

// Protected routes configuration
export const PROTECTED_ROUTES = {
  USER: [
    ROUTES.USER_DASHBOARD,
    ROUTES.PROFILE,
    ROUTES.ADDRESSES,
    ROUTES.ORDERS,
    ROUTES.ORDER_DETAIL,
    ROUTES.WISHLIST,
    ROUTES.REVIEWS,
    ROUTES.SETTINGS,
    ROUTES.CHECKOUT,
    ROUTES.PAYMENT
  ],
  ADMIN: [
    ROUTES.ADMIN,
    ROUTES.ADMIN_DASHBOARD,
    ROUTES.ADMIN_PRODUCTS,
    ROUTES.ADMIN_PRODUCT_ADD,
    ROUTES.ADMIN_PRODUCT_EDIT,
    ROUTES.ADMIN_CATEGORIES,
    ROUTES.ADMIN_ORDERS,
    ROUTES.ADMIN_ORDER_DETAIL,
    ROUTES.ADMIN_INVENTORY,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_REVIEWS,
    ROUTES.ADMIN_SETTINGS,
    ROUTES.ADMIN_ANALYTICS
  ],
  PUBLIC: [
    ROUTES.HOME,
    ROUTES.PRODUCTS,
    ROUTES.PRODUCT_DETAIL,
    ROUTES.CATEGORY,
    ROUTES.SEARCH,
    ROUTES.ABOUT,
    ROUTES.CONTACT,
    ROUTES.FAQ,
    ROUTES.TERMS,
    ROUTES.PRIVACY,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
    ROUTES.VERIFY_EMAIL,
    ROUTES.CART
  ]
};

// Route metadata for SEO and page titles
export const ROUTE_META = {
  [ROUTES.HOME]: {
    title: 'Nutrition Shop - Premium Health Supplements',
    description: 'Shop high-quality protein, vitamins, supplements and nutrition products for your health and fitness goals.',
    keywords: 'nutrition, supplements, protein, vitamins, health, fitness'
  },
  [ROUTES.PRODUCTS]: {
    title: 'All Products - Nutrition Shop',
    description: 'Browse our complete collection of nutrition supplements and health products.',
    keywords: 'products, supplements, nutrition, health'
  },
  [ROUTES.LOGIN]: {
    title: 'Login - Nutrition Shop',
    description: 'Sign in to your account to access your orders, wishlist and more.',
    keywords: 'login, sign in, account'
  },
  [ROUTES.REGISTER]: {
    title: 'Create Account - Nutrition Shop',
    description: 'Join our community and enjoy exclusive benefits and faster checkout.',
    keywords: 'register, sign up, create account'
  },
  [ROUTES.CART]: {
    title: 'Shopping Cart - Nutrition Shop',
    description: 'Review your selected items and proceed to checkout.',
    keywords: 'cart, checkout, shopping'
  },
  [ROUTES.ADMIN_DASHBOARD]: {
    title: 'Admin Dashboard - Nutrition Shop',
    description: 'Manage products, orders, and store settings.',
    keywords: 'admin, dashboard, management'
  }
};

// Helper functions
export const isProtectedRoute = (path, userRole = 'user') => {
  if (userRole === 'admin') {
    return PROTECTED_ROUTES.ADMIN.some(route => path.startsWith(route.split(':')[0]));
  }
  return PROTECTED_ROUTES.USER.some(route => path.startsWith(route.split(':')[0]));
};

export const isPublicRoute = (path) => {
  return PROTECTED_ROUTES.PUBLIC.some(route => {
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    return new RegExp(`^${routePattern}$`).test(path);
  });
};

export const getRouteTitle = (path) => {
  const meta = ROUTE_META[path];
  return meta ? meta.title : 'Nutrition Shop';
};

export const getRouteDescription = (path) => {
  const meta = ROUTE_META[path];
  return meta ? meta.description : 'Premium nutrition supplements and health products';
};