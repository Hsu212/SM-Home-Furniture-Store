import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { type Product } from '../types/Product';
import '../styles/Products.css';

interface BedroomProps {
  addToCart: (product: Product) => void;
}

const Bedroom: React.FC<BedroomProps> = ({ addToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // Filter for Bedroom category
  const bedroomProducts = products.filter(p => p.category === 'Bedroom');

  if (loading) {
    return (
      <div className="products">
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading bedroom collection...</p>
      </div>
    );
  }

  return (
    <div className="products">
      <div className="product-list">
        {bedroomProducts.length > 0 ? (
          bedroomProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>No bedroom products found.</p>
        )}
      </div>
    </div>
  );
};

export default Bedroom;