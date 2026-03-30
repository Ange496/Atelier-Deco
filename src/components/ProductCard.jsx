export default function ProductCard({ product, onClick }) {
  return (
    <div className="product-card" onClick={onClick}>
      {product.badge && <span className="badge">{product.badge}</span>}
      <img className="product-img" src={product.img} alt={product.name} />
      <div className="product-body">
        <div className="product-category">{product.category}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-desc">{product.description}</div>
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