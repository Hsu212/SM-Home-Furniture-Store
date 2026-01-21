import React from 'react';
import { type Product } from '../types/Product';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { FaHeart } from 'react-icons/fa';
import '../styles/ProductCard.css';

interface ProductCardProps {
  product?: Product;
  addToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  if (!product) {
    return <div className="product-card-placeholder">Loading...</div>;
  }

  const goToDetails = () => {
    navigate(`/products/${product.id}`);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  // Safe check for colors array existence
  const hasMultipleColors = product.colors && product.colors.length > 1;

  return (
    <div className="product-card" onClick={goToDetails} style={{ cursor: 'pointer' }}>
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-image" />
        
        {hasMultipleColors && (
          <div className="color-badge">
            View {product.colors.length} colors
          </div>
        )}

        <button
          className={`favorite-btn ${isFavorite(product.id) ? 'active' : ''}`}
          onClick={toggleFavorite}
          title={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FaHeart />
        </button>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">
          Price:{' '}
          {product.discountPercent ? (
            <>
              <span className="original-price">
                ${product.price.toFixed(2)}
              </span>{' '}
              <span className="discounted-price">
                ${(product.price * (1 - product.discountPercent / 100)).toFixed(2)}
              </span>
              <span className="discount-badge">
                -{product.discountPercent}%
              </span>
            </>
          ) : (
            <span>${product.price.toFixed(2)}</span>
          )}
        </div>
        <p className="product-category">Category: {product.category}</p>
      </div>
    </div>
  );
};

export default ProductCard;