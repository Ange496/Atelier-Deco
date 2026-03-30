// Cart.jsx mis à jour
import { useState } from "react";
import { formatPrice } from "../utils/helpers";
import PaymentModal from "../components/PaymentModal";
import OrderConfirmation from "../components/OrderConfirmation";

export default function Cart({ 
  cart, 
  cartTotal, 
  updateQty, 
  removeFromCart, 
  onCheckout, 
  onNavigateToProducts,
  onNavigateToOrderDetails
}) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async (paymentData) => {
    console.log("🔄 Cart - handlePaymentConfirm reçu:", paymentData);
    
    // Combiner les données de livraison et de paiement
    const orderData = {
      items: cart,
      subtotal: cartTotal,
      delivery: paymentData.delivery,
      payment: {
        method: paymentData.payment?.method || 'Inconnue',
        methodId: paymentData.payment?.methodId,
        phoneNumber: paymentData.payment?.phoneNumber,
        timestamp: paymentData.payment?.timestamp
      },
      total: paymentData.total,
      date: new Date().toISOString(),
      status: "Confirmée"
    };
    
    console.log("📤 Cart - Données complètes avant onCheckout:", orderData);
    
    // Appeler la fonction onCheckout du parent
    if (!onCheckout) {
      console.error("❌ Cart - onCheckout n'existe pas!");
      return;
    }
    
    await onCheckout(orderData);
    
    console.log("✅ Cart - onCheckout appelé");
    
    // Fermer le modal de paiement
    setShowPaymentModal(false);
    
    // Afficher la confirmation
    setOrderSummary(orderData);
    setShowConfirmation(true);
    
    console.log("✅ Cart - Modal de confirmation affiché");
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    // Optionnel: rediriger vers la page des produits
    onNavigateToProducts();
  };

  const handleNavigateToOrderDetails = () => {
    setShowConfirmation(false);
    onNavigateToOrderDetails?.();
  };

  const deliveryCost = 1500;

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="page-title">Mon <span>Panier</span></div>
        <div className="empty-cart">
          <div className="icon">🛒</div>
          <h3>Votre panier est vide</h3>
          <p>Ajoutez des produits pour commencer vos achats</p>
          <button 
            className="add-cart-btn" 
            style={{ marginTop: "1.5rem", display: "inline-block", width: "auto", padding: "0.75rem 2rem" }}
            onClick={onNavigateToProducts}
          >
            Voir les produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="cart-page">
        <div className="page-title">Mon <span>Panier</span></div>
        
        <div className="cart-layout">
          <div>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img className="cart-item-img" src={item.img} alt={item.name} />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">{formatPrice(item.price * item.quantity)}</div>
                  <div className="cart-item-actions">
                    <button 
                      className="qty-btn" 
                      style={{ width: 28, height: 28 }} 
                      onClick={() => updateQty(item.id, -1)}
                    >
                      −
                    </button>
                    <span className="qty-val" style={{ fontSize: "0.9rem" }}>{item.quantity}</span>
                    <button 
                      className="qty-btn" 
                      style={{ width: 28, height: 28 }} 
                      onClick={() => updateQty(item.id, 1)}
                    >
                      +
                    </button>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      ✕ Supprimer
                    </button>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: "var(--orange)", fontFamily: "Syne,sans-serif", flexShrink: 0 }}>
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <div className="order-summary">
              <h3>Récapitulatif</h3>
              {cart.map(item => (
                <div className="summary-row" key={item.id}>
                  <span>{item.name} ×{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="summary-row">
                <span>Livraison</span>
                <span style={{ color: "var(--orange)" }}>{formatPrice(deliveryCost)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span className="val">{formatPrice(cartTotal + deliveryCost)}</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Passer la commande
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          cartTotal={cartTotal}
          deliveryCost={deliveryCost}
          onConfirm={handlePaymentConfirm}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showConfirmation && orderSummary && (
        <OrderConfirmation
          orderData={orderSummary}
          onClose={handleCloseConfirmation}
          onNavigateToProducts={onNavigateToProducts}
          onNavigateToOrderDetails={handleNavigateToOrderDetails}
        />
      )}
    </>
  );
}