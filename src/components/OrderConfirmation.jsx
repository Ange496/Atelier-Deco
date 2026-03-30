// components/OrderConfirmation.jsx
import { useEffect } from "react";
import { formatPrice } from "../utils/helpers";
import "./OrderConfirmation.css";

export default function OrderConfirmation({ 
  orderData, 
  onClose, 
  onNavigateToProducts,
  onNavigateToOrderDetails 
}) {
  useEffect(() => {
    // Scroll to top when modal opens
    window.scrollTo(0, 0);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    const deliveryType = orderData?.delivery?.deliveryType || "standard";
    const daysToAdd = deliveryType === "express" ? 1 : 3;
    deliveryDate.setDate(today.getDate() + daysToAdd);
    
    return deliveryDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-modal">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h2>Commande confirmée !</h2>
          <p>Merci pour votre achat</p>
        </div>
        
        <div className="confirmation-content">
          <div className="order-number">
            <strong>Numéro de commande</strong>
            <span>#{orderData?.orderNumber || Math.floor(Math.random() * 1000000)}</span>
          </div>
          
          <div className="order-date">
            <strong>Date de commande</strong>
            <span>{formatDate(orderData?.date || new Date())}</span>
          </div>
          
          <div className="delivery-info">
            <h4>Livraison prévue</h4>
            <p className="delivery-date">{getEstimatedDelivery()}</p>
            {orderData?.delivery?.deliveryType === "express" && (
              <span className="express-badge">Livraison Express</span>
            )}
          </div>
          
          <div className="order-summary-confirmation">
            <h4>Récapitulatif de votre commande</h4>
            {orderData?.items?.map((item, index) => (
              <div className="order-item" key={index}>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">×{item.quantity}</span>
                </div>
                <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            
            <div className="order-total">
              <span>Total</span>
              <span className="total-amount">{formatPrice(orderData?.total || 0)}</span>
            </div>
          </div>
          
          {orderData?.delivery && (
            <div className="delivery-address-confirmation">
              <h4>Adresse de livraison</h4>
              <p>{orderData.delivery.firstName} {orderData.delivery.lastName}</p>
              <p>{orderData.delivery.address}</p>
              {orderData.delivery.addressComplement && <p>{orderData.delivery.addressComplement}</p>}
              <p>{orderData.delivery.city}, {orderData.delivery.country}</p>
              <p>{orderData.delivery.phone}</p>
            </div>
          )}
          
          {orderData?.payment && (
            <div className="payment-info-confirmation">
              <h4>Mode de paiement</h4>
              <p>{orderData.payment.method}</p>
              {orderData.payment.method === "cash" && (
                <p className="cash-note">Paiement à la livraison</p>
              )}
            </div>
          )}
          
          <div className="next-steps">
            <h4>Prochaines étapes</h4>
            <ul>
              <li>✓ Un email de confirmation vous a été envoyé</li>
              <li>✓ Vous serez contacté par notre service client dans les 24h</li>
              <li>✓ Un SMS de confirmation sera envoyé avant la livraison</li>
            </ul>
          </div>
        </div>
        
        <div className="confirmation-actions">
          <button className="continue-shopping" onClick={onNavigateToProducts}>
            Continuer mes achats
          </button>
          <button 
            className="track-order" 
            onClick={() => {
              onClose?.();
              onNavigateToOrderDetails?.();
            }}
          >
            Voir le détail de ma commande
          </button>
        </div>
        
        <button className="close-confirmation" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}