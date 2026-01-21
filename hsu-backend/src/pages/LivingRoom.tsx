import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { type Product } from '../types/Product';
import '../styles/Products.css';

interface LivingRoomProps {
  addToCart: (product: Product) => void;
}

const LivingRoom: React.FC<LivingRoomProps> = ({ addToCart }) => {
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

  // Filter for Living Room category
  const livingRoomProducts = products.filter(p => p.category === 'Living Room');

  if (loading) {
    return (
      <div className="products">
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading living room collection...</p>
      </div>
    );
  }

  return (
    <div className="products">
      <div className="product-list">
        {livingRoomProducts.length > 0 ? (
          livingRoomProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>No living room products found.</p>
        )}
      </div>
    </div>
  );
};

export default LivingRoom;