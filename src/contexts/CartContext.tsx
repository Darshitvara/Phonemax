import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { CartItem, CartState, Product } from '../types';

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction = 
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.product.id === action.payload.product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === action.payload.product.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, {
          id: Date.now().toString(),
          product: action.payload.product,
          quantity: action.payload.quantity,
        }];
      }
      
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: newItems, total, itemCount };
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.product.id !== action.payload);
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: newItems, total, itemCount };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: newItems, total, itemCount };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
    
    case 'LOAD_CART': {
      const total = action.payload.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: action.payload, total, itemCount };
    }
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (isAuthenticated) {
      // Load cart from API
      api.get('/cart')
        .then(cartData => {
          dispatch({ type: 'LOAD_CART', payload: cartData.items || [] });
        })
        .catch(error => {
          console.error('Error loading cart:', error);
          // Fallback to localStorage for guest users
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
          }
        });
    } else {
      // Load from localStorage for guest users
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Always save to localStorage as backup
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (isAuthenticated) {
      api.post('/cart', { productId: product.id, quantity })
        .then(() => {
          dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
          addNotification({
            type: 'success',
            title: 'Added to Cart',
            message: `${product.name} has been added to your cart successfully!`,
            duration: 3000
          });
        })
        .catch(error => {
          console.error('Error adding to cart:', error);
          // Fallback to local state
          dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
          addNotification({
            type: 'success',
            title: 'Added to Cart',
            message: `${product.name} has been added to your cart successfully!`,
            duration: 3000
          });
        });
    } else {
      dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
      addNotification({
        type: 'success',
        title: 'Added to Cart',
        message: `${product.name} has been added to your cart successfully!`,
        duration: 3000
      });
    }
  };

  const removeFromCart = (productId: string) => {
    // Get product name before removing for notification
    const product = state.items.find(item => item.product.id === productId);
    const productName = product?.product.name || 'Product';

    if (isAuthenticated) {
      api.delete(`/cart/${productId}`)
        .then(() => {
          dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
          addNotification({
            type: 'info',
            title: 'Removed from Cart',
            message: `${productName} has been removed from your cart.`,
            duration: 3000
          });
        })
        .catch(error => {
          console.error('Error removing from cart:', error);
          // Fallback to local state
          dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
          addNotification({
            type: 'info',
            title: 'Removed from Cart',
            message: `${productName} has been removed from your cart.`,
            duration: 3000
          });
        });
    } else {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
      addNotification({
        type: 'info',
        title: 'Removed from Cart',
        message: `${productName} has been removed from your cart.`,
        duration: 3000
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    // Get product name for notification
    const product = state.items.find(item => item.product.id === productId);
    const productName = product?.product.name || 'Product';

    if (isAuthenticated) {
      api.put(`/cart/${productId}`, { quantity })
        .then(() => {
          dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
          if (quantity === 0) {
            addNotification({
              type: 'info',
              title: 'Removed from Cart',
              message: `${productName} has been removed from your cart.`,
              duration: 3000
            });
          } else {
            addNotification({
              type: 'success',
              title: 'Quantity Updated',
              message: `${productName} quantity updated to ${quantity}.`,
              duration: 2000
            });
          }
        })
        .catch(error => {
          console.error('Error updating cart:', error);
          // Fallback to local state
          dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
          if (quantity === 0) {
            addNotification({
              type: 'info',
              title: 'Removed from Cart',
              message: `${productName} has been removed from your cart.`,
              duration: 3000
            });
          } else {
            addNotification({
              type: 'success',
              title: 'Quantity Updated',
              message: `${productName} quantity updated to ${quantity}.`,
              duration: 2000
            });
          }
        });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
      if (quantity === 0) {
        addNotification({
          type: 'info',
          title: 'Removed from Cart',
          message: `${productName} has been removed from your cart.`,
          duration: 3000
        });
      } else {
        addNotification({
          type: 'success',
          title: 'Quantity Updated',
          message: `${productName} quantity updated to ${quantity}.`,
          duration: 2000
        });
      }
    }
  };

  const clearCart = () => {
    if (isAuthenticated) {
      api.delete('/cart')
        .then(() => {
          dispatch({ type: 'CLEAR_CART' });
          addNotification({
            type: 'info',
            title: 'Cart Cleared',
            message: 'All items have been removed from your cart.',
            duration: 3000
          });
        })
        .catch(error => {
          console.error('Error clearing cart:', error);
          // Fallback to local state
          dispatch({ type: 'CLEAR_CART' });
          addNotification({
            type: 'info',
            title: 'Cart Cleared',
            message: 'All items have been removed from your cart.',
            duration: 3000
          });
        });
    } else {
      dispatch({ type: 'CLEAR_CART' });
      addNotification({
        type: 'info',
        title: 'Cart Cleared',
        message: 'All items have been removed from your cart.',
        duration: 3000
      });
    }
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};