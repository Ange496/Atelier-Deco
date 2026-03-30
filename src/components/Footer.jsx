import { useState } from "react";

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear());


  const quickLinks = [
    { name: "À propos", url: "#" },
    { name: "Contact", url: "#" },
    { name: "Livraison", url: "#" },
  ];

  const contactInfo = [
    {  text: "Abidjan, Côte d'Ivoire" },
    {  text: "+225 27 22 52 14 00" },
    {  text: "contact@atelierdeco.ci" },
    {  text: "Lun-Ven: 8h-18h | Sam: 9h-13h" }
  ];


  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-section">
          <div className="footer-logo">
            <span className="footer-brand">ATELIER DECO</span>
            <span className="footer-tagline">Électronique </span>
          </div>
          <p className="footer-description">
            Votre destination de confiance pour les produits électroniques haut de gamme 
            en Côte d'Ivoire. Qualité, service et innovation à votre service.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-title">Liens Rapides</h4>
          <ul className="footer-links">
            {quickLinks.map(link => (
              <li key={link.name}>
                <a href={link.url} className="footer-link">
                  → {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4 className="footer-title">Contact</h4>
          <ul className="footer-contact">
            {contactInfo.map(info => (
              <li key={info.text} className="contact-item">
                <span className="contact-icon">{info.icon}</span>
                <span>{info.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter & Payments */}
        <div className="footer-section">
          <h4 className="footer-title">Newsletter</h4>
          <p className="footer-newsletter-text">
            Recevez nos offres exclusives
          </p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Votre email" 
              className="newsletter-input"
              aria-label="Email pour newsletter"
            />
            <button type="submit" className="newsletter-btn">
              S'abonner
            </button>
          </form>
          
        
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-copyright">
          © {currentYear} Atelier Deco. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}