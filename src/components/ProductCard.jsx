export default function ProductCard({ product, onClick }) {
  const renderStars = (rating) => {
    return "⭐".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "" : "");
  };

  const getStockStatus = (stock) => {
    if (stock <= 5) return { text: "Stock limité", color: "#e74c3c" };
    if (stock <= 15) return { text: "Disponible", color: "#f39c12" };
    return { text: "En stock", color: "#27ae60" };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="product-card" onClick={onClick}>
      {/* Badge Promo/Nouveau */}
      <div className="product-badges">
        {product.badge && (
          <span className="badge" style={{
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
        <span className="stock-badge" style={{ backgroundColor: stockStatus.color }}>
          {stockStatus.text}
        </span>
      </div>

      {/* Image */}
      <img className="product-img" src={product.img} alt={product.name} />

      {/* Contenu principal */}
      <div className="product-body">
        {/* Catégorie */}
        <div className="product-category">{product.category}</div>
        
        {/* Nom */}
        <div className="product-name">{product.name}</div>
        
        {/* Description */}
        <div className="product-desc">{product.description}</div>

        {/* Rating & Reviews */}
        <div className="product-rating">
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="rating-value">{product.rating.toFixed(1)}</span>
          <span className="reviews">({product.reviews} avis)</span>
        </div>

        {/* Couleurs disponibles */}
        {product.colors && product.colors.length > 0 && (
          <div className="product-colors">
            <span className="colors-label">
              Couleurs: 
              {product.colors.map((color, idx) => (
                <span key={idx} className="color-dot" title={color}></span>
              ))}
            </span>
          </div>
        )}

        {/* Spécifications */}
        {product.specs && product.specs.length > 0 && (
          <div className="product-specs">
            <ul>
              {product.specs.slice(0, 2).map((spec, idx) => (
                <li key={idx}>✓ {spec}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer avec prix et bouton */}
        <div className="product-footer">
          <span className="product-price">
            {product.price.toLocaleString('fr-FR')} FCFA
          </span>
          <button
            className="detail-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Détail
          </button>
        </div>
      </div>
    </div>
  );
}