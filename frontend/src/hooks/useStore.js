import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export const useCart = () => {
  const context = useContext(StoreContext);
  
  if (!context) {
    throw new Error('useCart must be used within StoreContextProvider');
  }

  return {
    cartItems: context.cartItems,
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
    getTotalCartAmount: context.getTotalCartAmount,
    getTotalCartItems: context.getTotalCartItems
  };
};

export const useAuth = () => {
  const context = useContext(StoreContext);
  
  if (!context) {
    throw new Error('useAuth must be used within StoreContextProvider');
  }

  return {
    token: context.token,
    setToken: context.setToken,
    isAuthenticated: !!context.token
  };
};

export const useFoodList = () => {
  const context = useContext(StoreContext);
  
  if (!context) {
    throw new Error('useFoodList must be used within StoreContextProvider');
  }

  return {
    food_list: context.food_list,
    url: context.url
  };
};
