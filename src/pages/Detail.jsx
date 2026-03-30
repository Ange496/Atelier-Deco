import { useState } from "react";
import { formatPrice } from "../utils/helpers";

export default function Detail({ product, onAddToCart, onBack }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity);
    onBack(); // This will navigate back to products, but you might want to go to cart
  };

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={onBack}>
        ← Retour aux produits
      </button>
      
      <div className="detail-grid">
        <div>
          <img className="detail-img" src={product.img} alt={product.name} />
        </div>
        
        <div className="detail-info">
          <div className="detail-category">{product.category}</div>
          <div className="detail-name">{product.name}</div>
          <div className="detail-price">{formatPrice(product.price)}</div>
          <div className="detail-desc">{product.description}</div>
          
          <div>
            <div style={{ 
              fontSize: "0.82rem", 
              color: "var(--text-muted)", 
              marginBottom: "0.5rem", 
              fontWeight: 600, 
              letterSpacing: "0.04em" 
            }}>
              QUANTITÉ
            </div>
            <div className="qty-row">
              <button 
                className="qty-btn" 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="qty-val">{quantity}</span>
              <button 
                className="qty-btn" 
                onClick={() => setQuantity(q => q + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          <button className="add-cart-btn" onClick={handleAddToCart}>
            🛒 Ajouter au panier
          </button>
          
          <button 
            className="add-cart-btn" 
            style={{ background: "transparent", border: "1px solid var(--orange)", color: "var(--orange)" }}
            onClick={handleBuyNow}
          >
            Commander maintenant
          </button>
        </div>
      </div>
    </div>
  );
}