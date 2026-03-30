export default function Hero({ cartCount }) {
  return (
    <div className="hero-box">
      <div className="hero-welcome">
        <h2>Bienvenue chez Atelier Deco</h2>
        <p>Votre destination électronique en Côte d'Ivoire</p>
      </div>
      <div className="hero-counter">
        <span className="count">{cartCount}</span>
        <span className="label">Article{cartCount !== 1 ? "s" : ""} panier</span>
      </div>
    </div>
  );
}