import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { type Product } from '../types/Product';
import '../styles/Products.css';

interface BathroomProps {
  addToCart: (product: Product) => void;
}

const Bathroom: React.FC<BathroomProps> = ({ addToCart }) => {
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

  // Filter for Bathroom category
  const bathroomProducts = products.filter(p => p.category === 'Bathroom');

  if (loading) {
    return (
      <div className="products">
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading bathroom collection...</p>
      </div>
    );
  }

  return (
    <div className="products">
      <div className="product-list">
        {bathroomProducts.length > 0 ? (
          bathroomProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        ) : (
          <p>No bathroom products found.</p>
        )}
      </div>
    </div>
  );
};

export default Bathroom;