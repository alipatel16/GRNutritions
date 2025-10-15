import React, { createContext, useContext, useReducer, useEffect } from 'react';
import databaseService from '../../services/firebase/database';
import { PRODUCT_CATEGORIES, getAllCategories } from '../../utils/constants/categories';
import { BUSINESS_CONSTANTS } from '../../utils/constants/orderStatus';
import { toast } from 'react-toastify';

// Product context
const ProductContext = createContext();

// Product action types
const PRODUCT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_FEATURED_PRODUCTS: 'SET_FEATURED_PRODUCTS',
  SET_CURRENT_PRODUCT: 'SET_CURRENT_PRODUCT',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  REMOVE_PRODUCT: 'REMOVE_PRODUCT'
};

// Initial state
const initialState = {
  products: [],
  categories: getAllCategories(),
  featuredProducts: [],
  currentProduct: null,
  searchResults: [],
  searchTerm: '',
  filters: {
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    inStock: false,
    sortBy: 'newest',
    rating: 0
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: BUSINESS_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE
  },
  loading: false,
  error: null,
  lastUpdated: null
};

// Product reducer
const productReducer = (state, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case PRODUCT_ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      };

    case PRODUCT_ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        loading: false
      };

    case PRODUCT_ACTIONS.SET_FEATURED_PRODUCTS:
      return {
        ...state,
        featuredProducts: action.payload,
        loading: false
      };

    case PRODUCT_ACTIONS.SET_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: action.payload,
        loading: false,
        error: null
      };

    case PRODUCT_ACTIONS.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload.results,
        searchTerm: action.payload.searchTerm,
        pagination: {
          ...state.pagination,
          currentPage: action.payload.page || 1,
          totalPages: action.payload.totalPages || 1,
          totalItems: action.payload.total || 0
        },
        loading: false
      };

    case PRODUCT_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, currentPage: 1 }
      };

    case PRODUCT_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };

    case PRODUCT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case PRODUCT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case PRODUCT_ACTIONS.ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
        lastUpdated: Date.now()
      };

    case PRODUCT_ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        ),
        currentProduct: state.currentProduct?.id === action.payload.id 
          ? action.payload 
          : state.currentProduct,
        lastUpdated: Date.now()
      };

    case PRODUCT_ACTIONS.REMOVE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
        currentProduct: state.currentProduct?.id === action.payload 
          ? null 
          : state.currentProduct,
        lastUpdated: Date.now()
      };

    default:
      return state;
  }
};

// Product provider component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Load initial data
  useEffect(() => {
    loadProducts();
    loadCategories();
    loadFeaturedProducts();
  }, []);

  // Load products
  const loadProducts = async (filters = {}) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      const queryFilters = {
        ...filters,
        limit: filters.limit || state.pagination.itemsPerPage
      };
      
      const result = await databaseService.getProducts(queryFilters);
      
      if (result.success) {
        dispatch({ type: PRODUCT_ACTIONS.SET_PRODUCTS, payload: result.data || [] });
      } else {
        dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Failed to load products' });
      }
    } catch (error) {
      console.error('Error loading products:', error);
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Failed to load products' });
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const result = await databaseService.getCategories();
      
      if (result.success) {
        // Merge with predefined categories
        const dbCategories = result.data || [];
        const allCategories = [...getAllCategories(), ...dbCategories];
        dispatch({ type: PRODUCT_ACTIONS.SET_CATEGORIES, payload: allCategories });
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Use predefined categories as fallback
      dispatch({ type: PRODUCT_ACTIONS.SET_CATEGORIES, payload: getAllCategories() });
    }
  };

  // Load featured products
  const loadFeaturedProducts = async () => {
    try {
      const result = await databaseService.query('products', {
        orderBy: { type: 'child', key: 'featured' },
        equalTo: true,
        limitToFirst: 8
      });
      
      if (result.success) {
        dispatch({ type: PRODUCT_ACTIONS.SET_FEATURED_PRODUCTS, payload: result.data || [] });
      }
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  };

  // Get product by ID
  const getProductById = async (productId) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      const result = await databaseService.getProductById(productId);
      
      if (result.success && result.data) {
        dispatch({ type: PRODUCT_ACTIONS.SET_CURRENT_PRODUCT, payload: result.data });
        return { success: true, data: result.data };
      } else {
        dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Product not found' });
        return { success: false, error: 'Product not found' };
      }
    } catch (error) {
      console.error('Error getting product:', error);
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Failed to load product' });
      return { success: false, error: 'Failed to load product' };
    }
  };

  // Get products by category
  const getProductsByCategory = async (categoryId, page = 1) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      const limit = state.pagination.itemsPerPage;
      const result = await databaseService.getProductsByCategory(categoryId, limit);
      
      if (result.success) {
        dispatch({ type: PRODUCT_ACTIONS.SET_PRODUCTS, payload: result.data || [] });
        dispatch({
          type: PRODUCT_ACTIONS.SET_PAGINATION,
          payload: {
            currentPage: page,
            totalItems: result.data?.length || 0
          }
        });
        return { success: true };
      } else {
        dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Failed to load category products' });
        return { success: false };
      }
    } catch (error) {
      console.error('Error getting products by category:', error);
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Failed to load category products' });
      return { success: false };
    }
  };

  // Search products
  const searchProducts = async (searchTerm, filters = {}, page = 1) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      const searchFilters = {
        ...state.filters,
        ...filters,
        page,
        limit: state.pagination.itemsPerPage
      };
      
      const result = await databaseService.searchProducts(searchTerm, searchFilters);
      
      if (result.success) {
        dispatch({
          type: PRODUCT_ACTIONS.SET_SEARCH_RESULTS,
          payload: {
            results: result.data || [],
            searchTerm,
            page: result.page || 1,
            totalPages: result.totalPages || 1,
            total: result.total || 0
          }
        });
        return { success: true, data: result };
      } else {
        dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Search failed' });
        return { success: false };
      }
    } catch (error) {
      console.error('Error searching products:', error);
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Search failed' });
      return { success: false };
    }
  };

  // Create product (admin only)
  const createProduct = async (productData) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      const result = await databaseService.createProduct(productData);
      
      if (result.success) {
        dispatch({ type: PRODUCT_ACTIONS.ADD_PRODUCT, payload: result.data });
        toast.success('Product created successfully');
        return { success: true, data: result.data };
      } else {
        dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Failed to create product' });
        toast.error('Failed to create product');
        return { success: false };
      }
    } catch (error) {
      console.error('Error creating product:', error);
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Failed to create product' });
      toast.error('Failed to create product');
      return { success: false };
    }
  };

  // Update product (admin only)
  const updateProduct = async (productId, updates) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      const result = await databaseService.updateProduct(productId, updates);
      
      if (result.success) {
        const updatedProduct = { id: productId, ...updates };
        dispatch({ type: PRODUCT_ACTIONS.UPDATE_PRODUCT, payload: updatedProduct });
        toast.success('Product updated successfully');
        return { success: true, data: updatedProduct };
      } else {
        dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Failed to update product' });
        toast.error('Failed to update product');
        return { success: false };
      }
    } catch (error) {
      console.error('Error updating product:', error);
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Failed to update product' });
      toast.error('Failed to update product');
      return { success: false };
    }
  };

  // Delete product (admin only)
  const deleteProduct = async (productId) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      const result = await databaseService.deleteProduct(productId);
      
      if (result.success) {
        dispatch({ type: PRODUCT_ACTIONS.REMOVE_PRODUCT, payload: productId });
        toast.success('Product deleted successfully');
        return { success: true };
      } else {
        dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Failed to delete product' });
        toast.error('Failed to delete product');
        return { success: false };
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Failed to delete product' });
      toast.error('Failed to delete product');
      return { success: false };
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: newFilters });
  };

  // Clear filters
  const clearFilters = () => {
    dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: initialState.filters });
  };

  // Update pagination
  const updatePagination = (paginationData) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_PAGINATION, payload: paginationData });
  };

  // Get filtered and sorted products
  const getFilteredProducts = () => {
    let filteredProducts = [...state.products];

    // Apply category filter
    if (state.filters.category) {
      filteredProducts = filteredProducts.filter(
        product => product.category === state.filters.category
      );
    }

    // Apply price filter
    filteredProducts = filteredProducts.filter(
      product => product.price >= state.filters.minPrice && 
                 product.price <= state.filters.maxPrice
    );

    // Apply stock filter
    if (state.filters.inStock) {
      filteredProducts = filteredProducts.filter(
        product => product.inventory > 0
      );
    }

    // Apply rating filter
    if (state.filters.rating > 0) {
      filteredProducts = filteredProducts.filter(
        product => (product.averageRating || 0) >= state.filters.rating
      );
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      switch (state.filters.sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    return filteredProducts;
  };

  // Get products for current page
  const getPaginatedProducts = () => {
    const filteredProducts = getFilteredProducts();
    const startIndex = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;
    const endIndex = startIndex + state.pagination.itemsPerPage;
    
    return {
      products: filteredProducts.slice(startIndex, endIndex),
      totalItems: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / state.pagination.itemsPerPage)
    };
  };

  // Get product recommendations
  const getRecommendedProducts = (currentProductId, category, limit = 6) => {
    return state.products
      .filter(product => 
        product.id !== currentProductId && 
        product.category === category &&
        product.inventory > 0
      )
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, limit);
  };

  // Get new arrivals
  const getNewArrivals = (limit = 8) => {
    return state.products
      .filter(product => product.inventory > 0)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  // Get best sellers (based on sales count)
  const getBestSellers = (limit = 8) => {
    return state.products
      .filter(product => product.inventory > 0)
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, limit);
  };

  // Get top rated products
  const getTopRatedProducts = (limit = 8) => {
    return state.products
      .filter(product => 
        product.inventory > 0 && 
        (product.averageRating || 0) >= 4.0 &&
        (product.reviewCount || 0) >= 5
      )
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, limit);
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: PRODUCT_ACTIONS.CLEAR_ERROR });
  };

  // Clear current product
  const clearCurrentProduct = () => {
    dispatch({ type: PRODUCT_ACTIONS.SET_CURRENT_PRODUCT, payload: null });
  };

  // Refresh products
  const refreshProducts = () => {
    loadProducts();
  };

  // Context value
  const value = {
    // State
    ...state,
    
    // Data loading methods
    loadProducts,
    loadCategories,
    loadFeaturedProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    
    // Product CRUD (admin)
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Filter and pagination
    updateFilters,
    clearFilters,
    updatePagination,
    getFilteredProducts,
    getPaginatedProducts,
    
    // Product recommendations and lists
    getRecommendedProducts,
    getNewArrivals,
    getBestSellers,
    getTopRatedProducts,
    
    // Utility methods
    clearError,
    clearCurrentProduct,
    refreshProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  
  return context;
};

export default ProductContext;