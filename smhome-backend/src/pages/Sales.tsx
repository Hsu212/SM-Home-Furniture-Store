import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { type Product } from '../types/Product';
import '../styles/Products.css';

interface SalesProps {
  addToCart: (product: Product) => void;
}

const Sales: React.FC<SalesProps> = ({ addToCart }) => {
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

  // Filter for items that have a discount greater than 0
  const salesProducts = products.filter(p => p.discountPercent && p.discountPercent > 0);

  if (loading) {
    return (
      <div className="products">
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading sales...</p>
      </div>
    );
  }

  if (salesProducts.length === 0) {
    return (
      <div className="products">
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>No products on sale at the moment.</p>
      </div>
    );
  }

  return (
    <div className="products">
      <div className="product-list">
        {salesProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default Sales;