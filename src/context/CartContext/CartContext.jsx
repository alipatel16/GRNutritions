import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import databaseService from '../../services/firebase/database';
import { BUSINESS_CONSTANTS } from '../../utils/constants/orderStatus';
import { toast } from 'react-toastify';

const CartContext = createContext();

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

const calculateCartTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const tax = Math.round(subtotal * BUSINESS_CONSTANTS.TAX.GST_RATE * 100) / 100;
  
  let shipping = 0;
  if (subtotal > 0 && subtotal < BUSINESS_CONSTANTS.ORDER_LIMITS.MIN_ORDER_AMOUNT) {
    shipping = 50;
  }

  const totalAmount = subtotal + tax + shipping;

  return {
    totalItems,
    subtotal,
    tax,
    shipping,
    totalAmount,
    discount: 0
  };
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case CART_ACTIONS.SET_SYNCING:
      return { ...state, syncing: action.payload };

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
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
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
      return { ...state, error: null };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  
  // CRITICAL FIX: Use refs to prevent infinite loops
  const initialLoadRef = useRef(false);
  const syncTimeoutRef = useRef(null);
  const lastSyncedItemsRef = useRef(null);

  // Load cart from database
  const loadCart = useCallback(async () => {
    if (!isAuthenticated || !user?.uid) {
      return;
    }

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const result = await databaseService.getCart(user.uid);
      
      if (result.success && result.data) {
        const cartItems = Object.entries(result.data).map(([productId, itemData]) => ({
          productId,
          ...itemData
        }));

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

        const validItems = itemsWithDetails.filter(item => item !== null);

        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: {
            items: validItems,
            ...calculateCartTotals(validItems)
          }
        });
        
        // Store synced items reference
        lastSyncedItemsRef.current = JSON.stringify(validItems);
      } else {
        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: initialState
        });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      if (error.message && !error.message.includes('Permission denied')) {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to load cart' });
      }
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  }, [isAuthenticated, user?.uid]);

  // Load cart from localStorage
  const loadLocalCart = useCallback(() => {
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
  }, []);

  // CRITICAL FIX: Load cart ONCE on mount or auth change
  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      loadCart();
    } else {
      loadLocalCart();
    }
    // Mark as initialized after first load
    initialLoadRef.current = true;
  }, [isAuthenticated, user?.uid, loadCart, loadLocalCart]);

  // CRITICAL FIX: Sync to database with proper checks
  useEffect(() => {
    // Don't sync on initial load or if not authenticated
    if (!initialLoadRef.current || !isAuthenticated || !user?.uid || !state.lastUpdated) {
      return;
    }

    // Don't sync if items haven't changed
    const currentItems = JSON.stringify(state.items);
    if (currentItems === lastSyncedItemsRef.current) {
      return;
    }

    // Don't sync if already syncing
    if (state.syncing) {
      return;
    }

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Debounce sync - wait 1 second after last change
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        dispatch({ type: CART_ACTIONS.SET_SYNCING, payload: true });

        const cartData = state.items.reduce((acc, item) => {
          acc[item.productId] = {
            quantity: item.quantity,
            addedAt: item.addedAt || Date.now()
          };
          return acc;
        }, {});

        await databaseService.updateCart(user.uid, cartData);
        
        // Update synced reference
        lastSyncedItemsRef.current = currentItems;
        
        console.log('✅ Cart synced to Firebase');
      } catch (error) {
        console.error('Error syncing cart:', error);
      } finally {
        dispatch({ type: CART_ACTIONS.SET_SYNCING, payload: false });
      }
    }, 1000); // 1 second debounce

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isAuthenticated, user?.uid, state.items, state.lastUpdated, state.syncing]);

  // CRITICAL FIX: Save to localStorage for guest users
  useEffect(() => {
    // Skip if authenticated or initial load
    if (isAuthenticated || !initialLoadRef.current || !state.lastUpdated) {
      return;
    }

    try {
      localStorage.setItem('nutrition_shop_cart', JSON.stringify(state));
      console.log('✅ Cart saved to localStorage');
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  }, [state, isAuthenticated]);

  // Cart operations
  const addToCart = async (product, quantity = 1) => {
    try {
      if (quantity <= 0) {
        toast.error('Invalid quantity');
        return { success: false };
      }

      if (quantity > BUSINESS_CONSTANTS.ORDER_LIMITS.MAX_QUANTITY_PER_ITEM) {
        toast.error(`Maximum quantity per item is ${BUSINESS_CONSTANTS.ORDER_LIMITS.MAX_QUANTITY_PER_ITEM}`);
        return { success: false };
      }

      if (!product.inventory || product.inventory <= 0) {
        toast.error('Product is out of stock');
        return { success: false };
      }

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
        quantity: quantity,
        inStock: product.inventory > 0,
        maxQuantity: product.inventory,
        addedAt: Date.now()
      };

      dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem });
      toast.success('Item added to cart');
      
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
      return { success: false };
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        return removeFromCart(productId);
      }

      const item = state.items.find(i => i.productId === productId);
      if (!item) {
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
      return { success: false };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      dispatch({
        type: CART_ACTIONS.REMOVE_ITEM,
        payload: { productId }
      });
      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      
      if (isAuthenticated && user?.uid) {
        await databaseService.updateCart(user.uid, {});
      } else {
        localStorage.removeItem('nutrition_shop_cart');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false };
    }
  };

  const validateCart = async () => {
    try {
      const invalidItems = [];
      
      for (const item of state.items) {
        const productResult = await databaseService.getProductById(item.productId);
        
        if (!productResult.success || !productResult.data) {
          invalidItems.push(item.productId);
        } else if (productResult.data.inventory < item.quantity) {
          invalidItems.push(item.productId);
        }
      }

      if (invalidItems.length > 0) {
        for (const productId of invalidItems) {
          await removeFromCart(productId);
        }
      }

      return {
        success: true,
        hasInvalidItems: invalidItems.length > 0,
        message: invalidItems.length > 0 
          ? 'Some items in your cart are no longer available' 
          : 'Cart is valid'
      };
    } catch (error) {
      console.error('Error validating cart:', error);
      return {
        success: false,
        error: 'Failed to validate cart. Please try again.'
      };
    }
  };

  const mergeGuestCart = async () => {
    try {
      const guestCart = localStorage.getItem('nutrition_shop_cart');
      if (guestCart && isAuthenticated && user?.uid) {
        const guestCartData = JSON.parse(guestCart);
        const guestItems = guestCartData.items || [];

        for (const guestItem of guestItems) {
          await addToCart({
            id: guestItem.productId,
            name: guestItem.name,
            price: guestItem.price,
            images: [guestItem.image],
            inventory: guestItem.maxQuantity
          }, guestItem.quantity);
        }

        localStorage.removeItem('nutrition_shop_cart');
      }
    } catch (error) {
      console.error('Error merging guest cart:', error);
    }
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.productId === productId);
  };

  const getCartSummary = () => {
    return {
      totalItems: state.totalItems,
      subtotal: state.subtotal,
      tax: state.tax,
      shipping: state.shipping,
      discount: state.discount,
      totalAmount: state.totalAmount
    };
  };

  const clearError = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    validateCart,
    mergeGuestCart,
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

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

export default CartContext;