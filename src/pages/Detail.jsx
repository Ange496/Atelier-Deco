import { useState } from "react";
import { formatPrice } from "../utils/helpers";

export default function Detail({ product, onAddToCart, onBack }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity);
    onBack(); // This will navigate back to products, but you might want to go to cart
  };

  const renderStars = (rating) => {
    return "⭐".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "" : "");
  };

  const getStockStatus = (stock) => {
    if (stock <= 5) return { text: "Stock limité", color: "#e74c3c" };
    if (stock <= 15) return { text: "Disponible", color: "#f39c12" };
    return { text: "En stock", color: "#27ae60" };
  };

  const stockStatus = getStockStatus(product.stock);
  const canAddToCart = quantity > 0 && product.stock > 0;

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={onBack}>
        ← Retour aux produits
      </button>
      
      <div className="detail-grid">
        {/* Image section */}
        <div className="detail-image-section">
          {product.badge && (
            <span className="detail-badge" style={{
              backgroundColor: 
                product.badge === "Nouveau" ? "#e74c3c" :
                product.badge === "Bestseller" ? "#f39c12" :
                product.badge === "Populaire" ? "#3498db" :
                product.badge === "Pro" ? "#9b59b6" :
                product.badge === "Premium" ? "#f1c40f" :
                product.badge === "Gaming" ? "#c0392b" :
                product.badge === "Sécurité" ? "#16a085" :
                product.badge === "Officiel" ? "#27ae60" :
                product.badge === "Promo" ? "#e67e22" : "#95a5a6"
            }}>
              {product.badge}
            </span>
          )}
          <img className="detail-img" src={product.img} alt={product.name} />
          <div className="detail-stock-status" style={{ backgroundColor: stockStatus.color }}>
            {stockStatus.text} ({product.stock} en stock)
          </div>
        </div>
        
        <div className="detail-info">
          {/* Header */}
          <div className="detail-category">{product.category}</div>
          <h1 className="detail-name">{product.name}</h1>
          
          {/* Rating */}
          {product.rating && (
            <div className="detail-rating">
              <span className="stars-display">{renderStars(product.rating)}</span>
              <span className="rating-value">{product.rating.toFixed(1)}</span>
              <span className="rating-count">({product.reviews} avis)</span>
            </div>
          )}

          {/* Price */}
          <div className="detail-price-section">
            <span className="detail-price">{formatPrice(product.price)}</span>
            <span className="price-currency">FCFA</span>
          </div>

          {/* Description */}
          <p className="detail-desc">{product.description}</p>

          {/* Spécifications */}
          {product.specs && product.specs.length > 0 && (
            <div className="detail-specs">
              <h3>Spécifications principales</h3>
              <ul>
                {product.specs.map((spec, idx) => (
                  <li key={idx}>✓ {spec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Couleurs disponibles */}
          {product.colors && product.colors.length > 0 && (
            <div className="detail-colors">
              <h3>Couleur disponible</h3>
              <div className="colors-selector">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-option ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  >
                    {color}
                  </button>
                ))}
              </div>
              <span className="selected-color">Couleur sélectionnée: <strong>{selectedColor}</strong></span>
            </div>
          )}

          {/* Quantity */}
          <div className="detail-quantity-section">
            <label>Quantité</label>
            <div className="quantity-control">
              <button 
                className="qty-btn-decrease" 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                title="Diminuer la quantité"
              >
                −
              </button>
              <input 
                type="number" 
                className="qty-input" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stock}
              />
              <button 
                className="qty-btn-increase" 
                onClick={() => setQuantity(q => q + 1)}
                disabled={quantity >= product.stock}
                title="Augmenter la quantité"
              >
                +
              </button>
            </div>
            <span className="qty-info">
              Max {product.stock} article{product.stock > 1 ? 's' : ''}
            </span>
          </div>

          {/* Action buttons */}
          <div className="detail-actions">
            <button 
              className="btn-primary" 
              onClick={handleAddToCart}
              disabled={!canAddToCart}
            >
              🛒 Ajouter au panier
            </button>
            
     
          </div>
        </div>
      </div>
    </div>
  );
}