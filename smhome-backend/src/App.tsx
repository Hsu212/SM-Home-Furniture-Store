import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import LivingRoom from './pages/LivingRoom';
import Bedroom from './pages/Bedroom';
import Kitchen from './pages/Kitchen';
import Bathroom from './pages/Bathroom';
import Sales from './pages/Sales';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/App.css';
import AuthWrapper from './components/auth/AuthWrapper';
import Favorites from './pages/Favorites';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider, useCart } from './context/CartContext';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Internal component to handle logic that requires Context access
const AppContent: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Use the Cart Context hook to get real data and functions
  const { cartItems, addToCart } = useCart();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app" data-theme={theme}>
      <Header cartCount={cartItems.length} toggleTheme={toggleTheme} theme={theme} />
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products addToCart={addToCart} />} />
          <Route 
            path="/products/:id" 
            element={<ProductDetails addToCart={addToCart} />} 
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/living-room" element={<LivingRoom addToCart={addToCart} />} />
          <Route path="/bedroom" element={<Bedroom addToCart={addToCart} />} />
          <Route path="/kitchen" element={<Kitchen addToCart={addToCart} />} />
          <Route path="/bathroom" element={<Bathroom addToCart={addToCart} />} />
          <Route path="/sales" element={<Sales addToCart={addToCart} />} />
          <Route path="/profile" element={<AuthWrapper />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <FavoritesProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </FavoritesProvider>
    </ErrorBoundary>
  );
};

export default App;