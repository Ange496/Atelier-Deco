import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Slider from '../components/Slider';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, SLIDES } from '../data/constants';

export default function Home({ cartCount, onProductSelect, onNavigateToProducts }) {
  const featuredProducts = PRODUCTS.slice(0, 6);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home-page">
      <Hero cartCount={cartCount} />
      <Slider
        slides={SLIDES}
        currentSlide={currentSlide}
        onSlideChange={goToSlide}
      />
      
      <div className="section-head">
        <h2>Produits <span>Vedette</span></h2>
        <button className="see-all-btn" onClick={onNavigateToProducts}>
          Voir tout ›
        </button>
      </div>
      
      <div className="products-grid">
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onProductSelect(product)}
          />
        ))}
      </div>
    </div>
  );
}