import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false); // ← ADD THIS

  // Load cart from localStorage on mount only
  useEffect(() => {
    const savedCart = localStorage.getItem('nearcart_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    setIsLoaded(true); // ← ADD THIS
  }, []);

  // Update totals whenever cartItems changes, but only after initial load
  useEffect(() => {
    if (isLoaded) { // ← ADD THIS CONDITION
      const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const price = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setTotalItems(total);
      setTotalPrice(price);
      
      // Save to localStorage
      localStorage.setItem('nearcart_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]); // ← ADD isLoaded TO DEPENDENCIES

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.productId === product.id);
      
      if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
          toast.error('Not enough stock available');
          return prev;
        }
        
        const updated = prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success(`Added ${quantity} more ${product.name} to cart`);
        return updated;
      } else {
        if (quantity > product.stock) {
          toast.error('Not enough stock available');
          return prev;
        }
        toast.success(`Added ${product.name} to cart`);
        return [...prev, {
          productId: product.id,
          name: product.name,
          price: product.price,
          mrp: product.mrp,
          quantity,
          image: product.images?.[0] || null,
          shopId: product.shopId,
          maxStock: product.stock
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
    toast.success('Removed from cart');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev => {
      const item = prev.find(i => i.productId === productId);
      if (!item) return prev;
      
      if (quantity > item.maxStock) {
        toast.error('Not enough stock available');
        return prev;
      }

      return prev.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    isEmpty: cartItems.length === 0
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};