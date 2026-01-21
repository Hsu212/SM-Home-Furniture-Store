/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Product } from '../types/Product';

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product, selectedColor?: any) => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const token = localStorage.getItem('token');

  // Load Cart
  useEffect(() => {
    if (token) {
      // Server-side
      fetch('http://127.0.0.1:8000/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        // Transform backend response to Product format
        const products = data.map((item: any) => ({
          ...item.product,
          selectedColor: item.selected_color // Restore selected color
        }));
        setCartItems(products);
      })
      .catch(err => console.error("Failed to load cart", err));
    } else {
      // Client-side
      const saved = localStorage.getItem('cart');
      if (saved) setCartItems(JSON.parse(saved));
    }
  }, [token]);

  // Save Client-side Cart
  useEffect(() => {
    if (!token) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  const addToCart = async (product: Product, selectedColor?: any) => {
    // Optimistic Update
    const productWithColor = { ...product, selectedColor };
    setCartItems(prev => [...prev, productWithColor]);

    if (token) {
      // Sync with Server
      try {
        await fetch('http://127.0.0.1:8000/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity: 1,
            selected_color: selectedColor
          })
        });
      } catch (err) {
        console.error("Failed to sync add-to-cart", err);
      }
    }
  };

  const removeFromCart = async (id: number) => {
    setCartItems(prev => prev.filter(p => p.id !== id));

    if (token) {
      try {
        await fetch(`http://127.0.0.1:8000/cart/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to sync remove-from-cart", err);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};