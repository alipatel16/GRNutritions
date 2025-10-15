import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import databaseService from '../../services/firebase/database';
import { BUSINESS_CONSTANTS } from '../../utils/constants/orderStatus';
import { toast } from 'react-toastify';

// Cart context
const CartContext = createContext();

// Cart action types
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_SYNCING: 'SET_SYNCING'
};

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  loading: false,
  syncing: false,
  error: null,
  lastUpdated: null
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case CART_ACTIONS.SET_SYNCING:
      return {
        ...state,
        syncing: action.payload
      };

    case CART_ACTIONS.SET_CART:
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      };

    case CART_ACTIONS.ADD_ITEM:
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }

      return {
        ...state,
        items: newItems,
        ...calculateCartTotals(newItems),
        lastUpdated: Date.now()
      };

    case CART_ACTIONS.UPDATE_ITEM:
      const updatedItems = state.items.map(item =>
        item.productId === action.payload.productId
          ? { ...item, ...action.payload.updates }
          : item
      );

      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
        lastUpdated: Date.now()
      };

    case CART_ACTIONS.REMOVE_ITEM:
      const filteredItems = state.items.filter(
        item => item.productId !== action.payload.productId
      );

      return {
        ...state,
        items: filteredItems,
        ...calculateCartTotals(filteredItems),
        lastUpdated: Date.now()
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...initialState,
        lastUpdated: Date.now()
      };

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
        syncing: false
      };

    case CART_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Calculate cart totals
const calculateCartTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const tax = Math.round(subtotal * BUSINESS_CONSTANTS.TAX.GST_RATE * 100) / 100;
  
  // Calculate shipping (free shipping over minimum amount)
  let shipping = 0;
  if (subtotal > 0 && subtotal < BUSINESS_CONSTANTS.ORDER_LIMITS.MIN_ORDER_AMOUNT) {
    shipping = 50; // Default shipping cost
  }

  const totalAmount = subtotal + tax + shipping;

  return {
    totalItems,
    subtotal,
    tax,
    shipping,
    totalAmount,
    discount: 0 // Can be enhanced with coupon system
  };
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Load cart data when user changes
  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      loadCart();
    } else {
      // Load from localStorage for guest users
      loadLocalCart();
    }
  }, [isAuthenticated, user?.uid]);

  // Sync cart to database when items change
  useEffect(() => {
    if (isAuthenticated && user?.uid && state.lastUpdated) {
      syncCartToDatabase();
    } else if (!isAuthenticated && state.lastUpdated) {
      // Save to localStorage for guest users
      saveLocalCart();
    }
  }, [state.items, isAuthenticated, user?.uid]);

  // Load cart from database
  const loadCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const result = await databaseService.getCart(user.uid);
      
      if (result.success && result.data) {
        const cartItems = Object.entries(result.data).map(([productId, itemData]) => ({
          productId,
          ...itemData
        }));

        // Fetch product details for each cart item
        const itemsWithDetails = await Promise.all(
          cartItems.map(async (item) => {
            const productResult = await databaseService.getProductById(item.productId);
            if (productResult.success && productResult.data) {
              return {
                ...item,
                name: productResult.data.name,
                price: productResult.data.price,
                image: productResult.data.images?.[0] || '',
                inStock: productResult.data.inventory > 0,
                maxQuantity: productResult.data.inventory
              };
            }
            return null;
          })
        );

        // Filter out items where product no longer exists
        const validItems = itemsWithDetails.filter(item => item !== null);

        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: {
            items: validItems,
            ...calculateCartTotals(validItems)
          }
        });
      } else {
        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: initialState
        });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to load cart' });
    }
  };

  // Load cart from localStorage
  const loadLocalCart = () => {
    try {
      const savedCart = localStorage.getItem('nutrition_shop_cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: {
            ...cartData,
            ...calculateCartTotals(cartData.items || [])
          }
        });
      }
    } catch (error) {
      console.error('Error loading local cart:', error);
    }
  };

  // Save cart to localStorage
  const saveLocalCart = () => {
    try {
      localStorage.setItem('nutrition_shop_cart', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  };

  // Sync cart to database
  const syncCartToDatabase = async () => {
    try {
      if (state.syncing) return; // Prevent duplicate syncs
      
      dispatch({ type: CART_ACTIONS.SET_SYNCING, payload: true });

      const cartData = state.items.reduce((acc, item) => {
        acc[item.productId] = {
          quantity: item.quantity,
          addedAt: item.addedAt || Date.now()
        };
        return acc;
      }, {});

      await databaseService.updateCart(user.uid, cartData);
    } catch (error) {
      console.error('Error syncing cart:', error);
    } finally {
      dispatch({ type: CART_ACTIONS.SET_SYNCING, payload: false });
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      // Validate quantity
      if (quantity <= 0) {
        toast.error('Invalid quantity');
        return { success: false };
      }

      if (quantity > BUSINESS_CONSTANTS.ORDER_LIMITS.MAX_QUANTITY_PER_ITEM) {
        toast.error(`Maximum quantity per item is ${BUSINESS_CONSTANTS.ORDER_LIMITS.MAX_QUANTITY_PER_ITEM}`);
        return { success: false };
      }

      // Check if product is in stock
      if (!product.inventory || product.inventory <= 0) {
        toast.error('Product is out of stock');
        return { success: false };
      }

      // Check if quantity exceeds available stock
      const existingItem = state.items.find(item => item.productId === product.id);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const newTotalQuantity = currentQuantity + quantity;

      if (newTotalQuantity > product.inventory) {
        toast.error(`Only ${product.inventory} items available in stock`);
        return { success: false };
      }

      const cartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        quantity,
        addedAt: Date.now(),
        inStock: true,
        maxQuantity: product.inventory
      };

      dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem });
      
      toast.success(`${product.name} added to cart`);
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
      return { success: false };
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        return removeFromCart(productId);
      }

      const item = state.items.find(item => item.productId === productId);
      if (!item) {
        toast.error('Item not found in cart');
        return { success: false };
      }

      if (newQuantity > item.maxQuantity) {
        toast.error(`Only ${item.maxQuantity} items available`);
        return { success: false };
      }

      dispatch({
        type: CART_ACTIONS.UPDATE_ITEM,
        payload: {
          productId,
          updates: { quantity: newQuantity }
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      return { success: false };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { productId } });
      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
      return { success: false };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      
      if (isAuthenticated && user?.uid) {
        await databaseService.clearCart(user.uid);
      } else {
        localStorage.removeItem('nutrition_shop_cart');
      }
      
      toast.success('Cart cleared');
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      return { success: false };
    }
  };

  // Get item quantity
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return state.items.some(item => item.productId === productId);
  };

  // Get cart summary
  const getCartSummary = () => {
    return {
      items: state.items,
      totalItems: state.totalItems,
      subtotal: state.subtotal,
      tax: state.tax,
      shipping: state.shipping,
      discount: state.discount,
      totalAmount: state.totalAmount
    };
  };

  // Validate cart before checkout
  const validateCart = async () => {
    try {
      const validationErrors = [];

      // Check minimum order amount
      if (state.subtotal < BUSINESS_CONSTANTS.ORDER_LIMITS.MIN_ORDER_AMOUNT) {
        validationErrors.push(
          `Minimum order amount is ₹${BUSINESS_CONSTANTS.ORDER_LIMITS.MIN_ORDER_AMOUNT}`
        );
      }

      // Check maximum order amount
      if (state.subtotal > BUSINESS_CONSTANTS.ORDER_LIMITS.MAX_ORDER_AMOUNT) {
        validationErrors.push(
          `Maximum order amount is ₹${BUSINESS_CONSTANTS.ORDER_LIMITS.MAX_ORDER_AMOUNT}`
        );
      }

      // Check item count
      if (state.items.length > BUSINESS_CONSTANTS.ORDER_LIMITS.MAX_ITEMS_PER_ORDER) {
        validationErrors.push(
          `Maximum ${BUSINESS_CONSTANTS.ORDER_LIMITS.MAX_ITEMS_PER_ORDER} items per order`
        );
      }

      // Validate each item's stock
      for (const item of state.items) {
        const productResult = await databaseService.getProductById(item.productId);
        if (!productResult.success || !productResult.data) {
          validationErrors.push(`Product ${item.name} is no longer available`);
          continue;
        }

        const product = productResult.data;
        if (product.inventory < item.quantity) {
          validationErrors.push(
            `Only ${product.inventory} units of ${item.name} available`
          );
        }
      }

      return {
        valid: validationErrors.length === 0,
        errors: validationErrors
      };
    } catch (error) {
      console.error('Error validating cart:', error);
      return {
        valid: false,
        errors: ['Failed to validate cart. Please try again.']
      };
    }
  };

  // Merge guest cart with user cart after login
  const mergeGuestCart = async () => {
    try {
      const guestCart = localStorage.getItem('nutrition_shop_cart');
      if (guestCart && isAuthenticated && user?.uid) {
        const guestCartData = JSON.parse(guestCart);
        const guestItems = guestCartData.items || [];

        // Merge with existing cart
        for (const guestItem of guestItems) {
          await addToCart({
            id: guestItem.productId,
            name: guestItem.name,
            price: guestItem.price,
            images: [guestItem.image],
            inventory: guestItem.maxQuantity
          }, guestItem.quantity);
        }

        // Clear guest cart
        localStorage.removeItem('nutrition_shop_cart');
      }
    } catch (error) {
      console.error('Error merging guest cart:', error);
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    // State
    ...state,
    
    // Cart methods
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    validateCart,
    mergeGuestCart,
    
    // Utility methods
    getItemQuantity,
    isInCart,
    getCartSummary,
    clearError
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

export default CartContext;