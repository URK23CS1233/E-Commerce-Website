import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setWishlistCount(0);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.get();
      const items = response.data.products || [];
      setWishlistItems(items);
      setWishlistCount(items.length);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistItems([]);
      setWishlistCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await wishlistAPI.add(productId);
      await fetchWishlist(); // Refresh wishlist
      return { success: true };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error adding to wishlist' 
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistAPI.remove(productId);
      setWishlistItems(prev => prev.filter(item => item.product._id !== productId));
      setWishlistCount(prev => prev - 1);
      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error removing from wishlist' 
      };
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.product._id === productId);
  };

  const value = {
    wishlistItems,
    wishlistCount,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
