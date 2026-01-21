import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { type Product } from '../types/Product';
import '../styles/Products.css';

interface KitchenProps {
  addToCart: (product: Product) => void;
}

const Kitchen: React.FC<KitchenProps> = ({ addToCart }) => {
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

  // Filter for Kitchen category
  const kitchenProducts = products.filter(p => p.category === 'Kitchen');

  if (loading) {
    return (
      <div className="products">
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading kitchen collection...</p>
      </div>
    );
  }

  return (
    <div className="products">
      <div className="product-list">
        {kitchenProducts.length > 0 ? (
          kitchenProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>No kitchen products found.</p>
        )}
      </div>
    </div>
  );
};

export default Kitchen;