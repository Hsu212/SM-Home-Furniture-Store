import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { type Product } from '../types/Product';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/ProductCarousel.css';

const ProductCarousel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/products')
      .then((res) => res.json())
      .then((data) => {
        // Slice to get only the first 5 items for the carousel
        setProducts(data.slice(0, 5));
      })
      .catch((err) => console.error('Error fetching carousel products:', err));
  }, []);

  const settings = {
    dots: true,
    infinite: products.length > 1, // Only loop if we have enough items
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    centerMode: true,
    centerPadding: '0px',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: '0px',
        },
      },
    ],
  };

  if (products.length === 0) {
    return null; // Don't render empty carousel
  }

  return (
    <div className="product-carousel">
      <h2>Featured Products</h2>
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="carousel-slide">
            <img src={product.image} alt={product.name} className="carousel-image" />
            <div className="carousel-content">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;