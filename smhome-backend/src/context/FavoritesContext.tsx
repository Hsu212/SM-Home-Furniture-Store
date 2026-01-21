/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Product } from '../types/Product';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const token = localStorage.getItem('token');

  // Load Favorites on Mount or Auth Change
  useEffect(() => {
    if (token) {
      // 1. If Logged In: Fetch from Backend
      fetch('http://127.0.0.1:8000/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        // Backend returns a list of wrapper objects with a "product" key
        // We map it to get just the Product array
        const products = data.map((item: any) => item.product);
        setFavorites(products);
      })
      .catch(err => console.error("Failed to load favorites from server", err));
    } else {
      // 2. If Guest: Load from LocalStorage
      const saved = localStorage.getItem('favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    }
  }, [token]);

  // Save to LocalStorage (Only for Guests)
  useEffect(() => {
    if (!token) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, token]);

  const addToFavorites = async (product: Product) => {
    // Optimistic Update: Update UI immediately
    setFavorites((prev) => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });

    // If logged in, sync with server
    if (token) {
      try {
        await fetch('http://127.0.0.1:8000/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ product_id: product.id })
        });
      } catch (err) {
        console.error("Failed to add favorite to server", err);
      }
    }
  };

  const removeFromFavorites = async (id: number) => {
    // Optimistic Update
    setFavorites((prev) => prev.filter(p => p.id !== id));

    // If logged in, sync with server
    if (token) {
      try {
        await fetch(`http://127.0.0.1:8000/favorites/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to remove favorite from server", err);
      }
    }
  };

  const isFavorite = (id: number) => {
    return favorites.some(p => p.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};