import Logo from './Logo';
import { FaSun, FaMoon, FaSearch } from "react-icons/fa";

export default function Navbar({
  page,
  setPage,
  user,
  cartCount,
  darkMode,
  toggleTheme,
  showSearch,
  setShowSearch,
  searchQuery,
  setSearchQuery,
  onLogout
}) {
  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'products', label: 'Produits' },
    { id: 'cart', label: 'Panier', badge: cartCount },
    ...(user ? [{ id: 'orders', label: 'Mes Commandes' }] : [{ id: 'auth', label: 'Connexion' }])
  ];

  return (
    <>
      <nav className="navbar">
        <div className="logo-area" onClick={() => setPage('home')}>
          <Logo />
          <span className="logo-text">ATELIER DECO</span>
        </div>

        <div className="nav-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              {item.label}
              {item.badge > 0 && <span className="cart-badge">{item.badge}</span>}
            </button>
          ))}
          {user && (
            <div className="user-menu">
  <div className="user-profile">
    <div className="avatar">
      {user.name.charAt(0).toUpperCase()}
    </div>
    <span className="user-name">{user.name}</span>
  </div>

  <button className="logout-btn" onClick={onLogout}>
    Déconnexion
  </button>
</div>
          )}
        </div>

        <div className="nav-right">
  <button className="icon-btn" onClick={toggleTheme} title="Mode jour/nuit">
    {darkMode ? <FaSun /> : <FaMoon />}
  </button>

  <button className="icon-btn" onClick={() => setShowSearch(!showSearch)} title="Rechercher">
    <FaSearch />
  </button>
</div>
      </nav>

      {showSearch && (
        <div className="search-bar-wrap">
         <span className="search-icon">
  <FaSearch />
</span>
          <input
            className="search-input"
            autoFocus
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage('products');
            }}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>
      )}
    </>
  );
}