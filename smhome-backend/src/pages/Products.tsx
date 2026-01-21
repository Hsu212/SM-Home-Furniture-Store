import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { type Product } from '../types/Product';
import '../styles/Products.css';

interface ProductsProps {
  addToCart: (product: Product) => void;
}

const Products: React.FC<ProductsProps> = ({ addToCart }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // State for fetching data from backend
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Retrieve search results passed via React Router state
  const searchState = location.state as { searchResults?: Product[]; query?: string } | undefined;
  const searchQuery = searchState?.query || '';

  // Fetch all products from the backend on mount
  useEffect(() => {
    fetch('http://127.0.0.1:8000/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // Decide what to display: Search Results OR All Fetched Products
  const displayProducts = searchState?.searchResults ? searchState.searchResults : products;

  const clearSearch = () => {
    // Clear state and reload the full list view
    navigate('/products', { replace: true, state: null });
  };

  // Show loading state only if we don't have search results to show immediately
  if (loading && !searchState) {
    return (
      <div className="products">
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products">
      {searchQuery && (
        <div className="search-header">
          <p>
            Found {displayProducts.length} result{displayProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
          <button onClick={clearSearch} className="clear-search-btn">
            Clear Search
          </button>
        </div>
      )}

      <div className="product-list">
        {displayProducts.length === 0 ? (
          <p style={{ width: '100%', textAlign: 'center' }}>
            No products found. {' '}
            {searchQuery && (
              <button onClick={clearSearch} className="clear-search-btn" style={{ marginLeft: '10px' }}>
                Show All
              </button>
            )}
          </p>
        ) : (
          displayProducts.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Products;