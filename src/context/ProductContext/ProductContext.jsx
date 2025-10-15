// ==================== ProductContext.jsx (FIXED) ====================
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import databaseService from '../../services/firebase/database';
import { PRODUCT_CATEGORIES, getAllCategories } from '../../utils/constants/categories';
import { BUSINESS_CONSTANTS } from '../../utils/constants/orderStatus';
import { toast } from 'react-toastify';

const ProductContext = createContext();

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

const productReducer = (state, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case PRODUCT_ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      };

    case PRODUCT_ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload, loading: false };

    case PRODUCT_ACTIONS.SET_FEATURED_PRODUCTS:
      return { ...state, featuredProducts: action.payload, loading: false };

    case PRODUCT_ACTIONS.SET_CURRENT_PRODUCT:
      return { ...state, currentProduct: action.payload, loading: false, error: null };

    case PRODUCT_ACTIONS.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload.results,
        searchTerm: action.payload.searchTerm,
        loading: false
      };

    case PRODUCT_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case PRODUCT_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };

    case PRODUCT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case PRODUCT_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

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

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // FIX: Wrap all data loading functions in useCallback to prevent recreating on every render
  const loadProducts = useCallback(async (filters = {}) => {
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
  }, [state.pagination.itemsPerPage]);

  const loadCategories = useCallback(async () => {
    try {
      const result = await databaseService.getCategories();
      
      if (result.success) {
        const dbCategories = result.data || [];
        const allCategories = [...getAllCategories(), ...dbCategories];
        dispatch({ type: PRODUCT_ACTIONS.SET_CATEGORIES, payload: allCategories });
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      dispatch({ type: PRODUCT_ACTIONS.SET_CATEGORIES, payload: getAllCategories() });
    }
  }, []);

  const loadFeaturedProducts = useCallback(async () => {
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
  }, []);

  // FIX: Use useEffect with empty dependency array, but call the useCallback functions
  useEffect(() => {
    loadProducts();
    loadCategories();
    loadFeaturedProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Get product by ID
  const getProductById = useCallback(async (productId) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      const result = await databaseService.getProductById(productId);
      
      if (result.success) {
        dispatch({ type: PRODUCT_ACTIONS.SET_CURRENT_PRODUCT, payload: result.data });
        return { success: true, data: result.data };
      } else {
        dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Product not found' });
        return { success: false };
      }
    } catch (error) {
      console.error('Error getting product:', error);
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Failed to load product' });
      return { success: false };
    }
  }, []);

  // Get products by category
  const getProductsByCategory = useCallback(async (category) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      const result = await databaseService.query('products', {
        orderBy: { type: 'child', key: 'category' },
        equalTo: category
      });
      
      if (result.success) {
        dispatch({ type: PRODUCT_ACTIONS.SET_PRODUCTS, payload: result.data || [] });
        return { success: true, data: result.data };
      }
    } catch (error) {
      console.error('Error getting products by category:', error);
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Failed to load products' });
    }
  }, []);

  // Search products
  const searchProducts = useCallback(async (searchTerm) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      const allProducts = await databaseService.getProducts({});
      
      if (allProducts.success) {
        const results = (allProducts.data || []).filter(product =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        dispatch({
          type: PRODUCT_ACTIONS.SET_SEARCH_RESULTS,
          payload: { results, searchTerm }
        });
        
        return { success: true, data: results };
      }
    } catch (error) {
      console.error('Error searching products:', error);
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: 'Failed to search products' });
    }
  }, []);

  // Create product (admin)
  const createProduct = useCallback(async (productData) => {
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
  }, []);

  // Update product (admin)
  const updateProduct = useCallback(async (productId, updates) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      const result = await databaseService.updateProduct(productId, updates);
      
      if (result.success) {
        const updatedProduct = { id: productId, ...updates };
        dispatch({ type: PRODUCT_ACTIONS.UPDATE_PRODUCT, payload: updatedProduct });
        toast.success('Product updated successfully');
        return { success: true };
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
  }, []);

  // Delete product (admin)
  const deleteProduct = useCallback(async (productId) => {
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
  }, []);

  // Filter and pagination helpers
  const updateFilters = useCallback((newFilters) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: initialState.filters });
  }, []);

  const updatePagination = useCallback((newPagination) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_PAGINATION, payload: newPagination });
  }, []);

  const getFilteredProducts = useCallback(() => {
    let filtered = [...state.products];

    if (state.filters.category) {
      filtered = filtered.filter(p => p.category === state.filters.category);
    }

    if (state.filters.inStock) {
      filtered = filtered.filter(p => p.inventory > 0);
    }

    if (state.filters.minPrice > 0) {
      filtered = filtered.filter(p => p.price >= state.filters.minPrice);
    }

    if (state.filters.maxPrice < 10000) {
      filtered = filtered.filter(p => p.price <= state.filters.maxPrice);
    }

    if (state.filters.rating > 0) {
      filtered = filtered.filter(p => (p.averageRating || 0) >= state.filters.rating);
    }

    // Sort
    switch (state.filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  }, [state.products, state.filters]);

  const getPaginatedProducts = useCallback(() => {
    const filtered = getFilteredProducts();
    const start = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;
    const end = start + state.pagination.itemsPerPage;
    
    return {
      products: filtered.slice(start, end),
      totalPages: Math.ceil(filtered.length / state.pagination.itemsPerPage),
      totalItems: filtered.length
    };
  }, [getFilteredProducts, state.pagination]);

  // Product recommendations
  const getRecommendedProducts = useCallback((currentProductId, limit = 4) => {
    return state.products
      .filter(p => p.id !== currentProductId && p.inventory > 0)
      .slice(0, limit);
  }, [state.products]);

  const getNewArrivals = useCallback((limit = 8) => {
    return state.products
      .filter(p => p.inventory > 0)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }, [state.products]);

  const getBestSellers = useCallback((limit = 8) => {
    return state.products
      .filter(p => p.inventory > 0)
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, limit);
  }, [state.products]);

  const getTopRatedProducts = useCallback((limit = 8) => {
    return state.products
      .filter(p => 
        p.inventory > 0 && 
        (p.averageRating || 0) >= 4.0 &&
        (p.reviewCount || 0) >= 5
      )
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, limit);
  }, [state.products]);

  // Utility methods
  const clearError = useCallback(() => {
    dispatch({ type: PRODUCT_ACTIONS.CLEAR_ERROR });
  }, []);

  const clearCurrentProduct = useCallback(() => {
    dispatch({ type: PRODUCT_ACTIONS.SET_CURRENT_PRODUCT, payload: null });
  }, []);

  const refreshProducts = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  const value = {
    ...state,
    loadProducts,
    loadCategories,
    loadFeaturedProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateFilters,
    clearFilters,
    updatePagination,
    getFilteredProducts,
    getPaginatedProducts,
    getRecommendedProducts,
    getNewArrivals,
    getBestSellers,
    getTopRatedProducts,
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

export const useProducts = () => {
  const context = useContext(ProductContext);
  
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  
  return context;
};

export default ProductContext;