import { useState, useEffect } from "react";
import { formatPrice } from "../utils/helpers";
import { STATUS_STEPS } from "../data/constants";
import "../styles/order-details.css";

export default function OrderDetails({ 
  orderId, 
  onClose, 
  onBack,
  onNavigateToProducts,
  orders 
}) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const foundOrder = orders.find(o => o.id === orderId || o.orderNumber === orderId);
      setOrder(foundOrder);
      setIsLoading(false);
    }, 500);
  }, [orderId, orders]);

  if (isLoading) {
    return (
      <div className="order-details-container">
        <div className="loading-state">Chargement de votre commande...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-container">
        <div className="error-state">Commande introuvable</div>
      </div>
    );
  }

  const currentStatusIdx = STATUS_STEPS.indexOf(order.status);
  const deliveryDate = order.delivery?.deliveryType === "express" 
    ? new Date(new Date(order.date).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date(new Date(order.date).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const GetStatusColor = (status) => {
    const colors = {
      'Confirmée': '#FF6B00',
      'En préparation': '#f5c300',
      'Expédiée': '#6496ff',
      'En livraison': '#9664ff',
      'Livrée': '#32c864'
    };
    return colors[status] || '#FF6B00';
  };

  const subtitles = [
    "Votre commande a été confirmée",
    "Nos équipes préparent votre colis",
    "Colis remis au transporteur",
    "Votre colis est en route",
    "Livré à destination ✓",
  ];

  return (
    <div className="order-details-page">
      <div className="od-header">
        <div>
          <h1>Détails de la commande</h1>
          <p className="od-order-number">#{order.orderNumber}</p>
        </div>
        <button className="od-close" onClick={onBack || onClose}>✕</button>
      </div>

      <div className="od-content">
        {/* Status Badge */}
        <div className="od-status-badge" style={{ borderLeftColor: GetStatusColor(order.status) }}>
          <div className="status-dot" style={{ backgroundColor: GetStatusColor(order.status) }}></div>
          <span>{order.status}</span>
          <span className="status-date">{formatDateTime(order.date)}</span>
        </div>

        {/* Timeline Tracking */}
        <section className="od-section">
          <h2>Suivi de votre commande</h2>
          <div className="od-timeline">
            {STATUS_STEPS.map((step, i) => {
              const done = i < currentStatusIdx;
              const current = i === currentStatusIdx;
              const isLast = i === STATUS_STEPS.length - 1;
              
              return (
                <div className="od-timeline-item" key={step}>
                  <div className="od-timeline-line">
                    <div 
                      className={`od-timeline-dot ${done ? "done" : current ? "current" : ""}`}
                      style={{
                        backgroundColor: done || current ? GetStatusColor(step) : '#e0e0e0',
                        borderColor: done || current ? GetStatusColor(step) : '#d0d0d0'
                      }}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    {!isLast && (
                      <div 
                        className={`od-timeline-vline ${done ? "done" : ""}`}
                        style={{ backgroundColor: done ? GetStatusColor(step) : '#e0e0e0' }}
                      />
                    )}
                  </div>
                  <div className="od-timeline-info">
                    <div className="od-timeline-label" style={{ color: done || current ? GetStatusColor(step) : "#999" }}>
                      {step}
                    </div>
                    <div className="od-timeline-sub">{subtitles[i]}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Delivery Info */}
        <section className="od-section">
          <h2>Information de livraison</h2>
          <div className="od-delivery-info">
            <div className="delivery-item">
              <div>
                <div className="delivery-label">Type de livraison</div>
                <div className="delivery-value">
                  {order.delivery?.deliveryType === "express" ? "Livraison Express (1 jour)" : "Standard (3 jours)"}
                </div>
              </div>
            </div>

            <div className="delivery-item">
              <div>
                <div className="delivery-label">Date estimée</div>
                <div className="delivery-value">{deliveryDate}</div>
              </div>
            </div>

            <div className="delivery-item">
              <div>
                <div className="delivery-label">Adresse de livraison</div>
                <div className="delivery-value">
                  {order.delivery?.firstName} {order.delivery?.lastName}<br />
                  {order.delivery?.address}<br />
                  {order.delivery?.addressComplement && <>{order.delivery?.addressComplement}<br /></>}
                  {order.delivery?.city}, {order.delivery?.country}
                </div>
              </div>
            </div>

            <div className="delivery-item">
              <div>
                <div className="delivery-label">Numéro de contact</div>
                <div className="delivery-value">{order.delivery?.phone}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Order Items */}
        <section className="od-section">
          <h2>Produits commandés</h2>
          <div className="od-items-list">
            {order.items?.map((item, idx) => (
              <div key={idx} className="od-item-row">
                <img src={item.img} alt={item.name} className="od-item-img" />
                <div className="od-item-details">
                  <div className="od-item-name">{item.name}</div>
                  <div className="od-item-qty">Quantité: {item.quantity}</div>
                </div>
                <div className="od-item-price">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Price Breakdown */}
        <section className="od-section od-price-section">
          <div className="od-price-row">
            <span>Sous-total</span>
            <span>{formatPrice(order.subtotal || 0)}</span>
          </div>
          <div className="od-price-row">
            <span>Livraison</span>
            <span>{formatPrice(1500)}</span>
          </div>
          <div className="od-price-row od-total">
            <span>Total</span>
            <span>{formatPrice(order.total || 0)}</span>
          </div>
        </section>

        {/* Payment Info */}
        <section className="od-section">
          <h2>Mode de paiement</h2>
          <div className="od-payment-info">
            <div className="payment-method">{order.payment?.method}</div>
            {order.payment?.method === "cash" && (
              <div className="payment-note"> Paiement à la livraison</div>
            )}
          </div>
        </section>

        {/* Actions */}
        <div className="od-actions">
          <button className="od-btn primary" onClick={onNavigateToProducts}>
            Continuer mes achats
          </button>
          <button className="od-btn secondary" onClick={onBack || onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
