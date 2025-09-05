import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
  itemCount: number;
}

interface WishlistContextType extends WishlistState {
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

type WishlistAction = 
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: Product[] };

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST': {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (exists) return state;
      
      const newItems = [...state.items, action.payload];
      return { items: newItems, itemCount: newItems.length };
    }
    
    case 'REMOVE_FROM_WISHLIST': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return { items: newItems, itemCount: newItems.length };
    }
    
    case 'CLEAR_WISHLIST':
      return { items: [], itemCount: 0 };
    
    case 'LOAD_WISHLIST':
      return { items: action.payload, itemCount: action.payload.length };
    
    default:
      return state;
  }
};

const initialState: WishlistState = {
  items: [],
  itemCount: 0,
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Load wishlist from API
      api.get('/wishlist')
        .then(wishlistData => {
          dispatch({ type: 'LOAD_WISHLIST', payload: wishlistData.items || [] });
        })
        .catch(error => {
          console.error('Error loading wishlist:', error);
          // Fallback to localStorage
          const savedWishlist = localStorage.getItem('wishlist');
          if (savedWishlist) {
            dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(savedWishlist) });
          }
        });
    } else {
      // Load from localStorage for guest users
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(savedWishlist) });
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Always save to localStorage as backup
    localStorage.setItem('wishlist', JSON.stringify(state.items));
  }, [state.items]);

  const addToWishlist = (product: Product) => {
    if (isAuthenticated) {
      api.post('/wishlist', { productId: product.id })
        .then(() => {
          dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
        })
        .catch(error => {
          console.error('Error adding to wishlist:', error);
          // Fallback to local state
          dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
        });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    }
  };

  const removeFromWishlist = (productId: string) => {
    if (isAuthenticated) {
      api.delete(`/wishlist/${productId}`)
        .then(() => {
          dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
        })
        .catch(error => {
          console.error('Error removing from wishlist:', error);
          // Fallback to local state
          dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
        });
    } else {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    }
  };

  const isInWishlist = (productId: string) => {
    return state.items.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    if (isAuthenticated) {
      api.delete('/wishlist')
        .then(() => {
          dispatch({ type: 'CLEAR_WISHLIST' });
        })
        .catch(error => {
          console.error('Error clearing wishlist:', error);
          // Fallback to local state
          dispatch({ type: 'CLEAR_WISHLIST' });
        });
    } else {
      dispatch({ type: 'CLEAR_WISHLIST' });
    }
  };

  return (
    <WishlistContext.Provider value={{
      ...state,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};