import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { CATEGORIES, PRODUCTS } from "../data/constants";

export default function Products({ searchQuery, onProductSelect }) {
  const [filterCat, setFilterCat] = useState("Tous");

  const filteredProducts = PRODUCTS.filter(product => {
    const categoryMatch = filterCat === "Tous" || product.category === filterCat;
    const searchMatch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="page-wrap">
      <div className="page-title">
        Tous nos <span>Produits</span>
      </div>
      
      <div className="cat-filter">
        {CATEGORIES.map(category => (
          <button
            key={category}
            className={`cat-btn ${filterCat === category ? "active" : ""}`}
            onClick={() => setFilterCat(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem" }}>
          Aucun produit trouvé.
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onProductSelect(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}