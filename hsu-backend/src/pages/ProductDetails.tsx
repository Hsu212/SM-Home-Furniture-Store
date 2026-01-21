import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { type Product } from '../types/Product';
import '../styles/ProductDetails.css';

interface ProductDetailsProps {
  // We removed 'products' from props because we fetch it now
  addToCart: (product: Product) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // State for selections
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product from backend
  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        // Default to first color if available
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="product-details-loading">Loading product details...</div>;
  }

  if (!product || !selectedColor) {
    return <div className="product-details-error">Product not found</div>;
  }

  // Use the images from the selected color
  const currentImages = selectedColor.images || [];
  const currentImage = currentImages[selectedImageIndex] || product.image;

  return (
    <div className="product-details">
      <div className="product-details-grid">

        {/* Left: Image Gallery */}
        <div className="product-gallery">
          <div className="main-image-wrapper">
            <img 
              src={currentImage} 
              alt={`${product.name} - ${selectedColor.name}`} 
              className="main-image" 
            />
          </div>

          <div className="thumbnail-strip">
            {currentImages.map((img: string, idx: number) => (
              <button
                key={idx}
                className={`thumbnail ${selectedImageIndex === idx ? 'active' : ''}`}
                onClick={() => setSelectedImageIndex(idx)}
              >
                <img src={img} alt={`View ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="product-info-wrapper">
          <h1>{product.name}</h1>
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
          
          <div className="color-selector">
            <p className="color-label">Color:</p>
            <div className="color-options">
              {product.colors && product.colors.map((c: any) => (
                <button
                  key={c.name}
                  className={`color-swatch ${selectedColor.name === c.name ? 'selected' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  onClick={() => {
                    setSelectedColor(c);
                    setSelectedImageIndex(0); // Reset image index on color change
                  }}
                />
              ))}
            </div>
            <p className="selected-color-name">{selectedColor.name}</p>
          </div>

          <div className="product-details-buttons">
            <button
              className="add-to-cart-btn"
              onClick={() => {
                // Construct the product object with the specific color choice
                const productWithColor = {
                  ...product,
                  selectedColor: {
                    name: selectedColor.name,
                    hex: selectedColor.hex,
                    image: currentImage,
                  },
                };
                addToCart(productWithColor);
                alert("Added to cart!");
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;