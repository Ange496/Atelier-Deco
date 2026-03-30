// src/components/PaymentModal.jsx
import { useState } from "react";
import DeliveryForm from "./DeliveryForm";
import PaymentMethodSelector from "./PaymentMethodSelector";
import "./PaymentModal.css";

export default function PaymentModal({ cartTotal, deliveryCost, onConfirm, onClose }) {
  const [step, setStep] = useState(1); // 1: Delivery, 2: Payment
  const [deliveryDetails, setDeliveryDetails] = useState(null);

  const handleDeliveryNext = (details) => {
    setDeliveryDetails(details);
    setStep(2);
  };

  const handleDeliveryBack = () => {
    setStep(1);
  };

  const handlePaymentConfirm = (paymentData) => {
    console.log("🔄 PaymentModal - Données reçues de PaymentMethodSelector:", paymentData);
    console.log("🔄 PaymentModal - Détails livraison:", deliveryDetails);
    
    // Combine delivery details and payment method
    const orderData = {
      delivery: deliveryDetails,
      payment: paymentData.payment,
      total: paymentData.total,
    };
    
    console.log("📤 PaymentModal - Données complètes envoyées au Cart:", orderData);
    onConfirm(orderData);
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-steps">
          <div className={`step ${step === 1 ? "active" : step > 1 ? "completed" : ""}`}>
            <div className="step-number">1</div>
            <div className="step-label">Livraison</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step === 2 ? "active" : step > 2 ? "completed" : ""}`}>
            <div className="step-number">2</div>
            <div className="step-label">Paiement</div>
          </div>
        </div>

        <div className="modal-content">
          {step === 1 && (
            <DeliveryForm
              onNext={handleDeliveryNext}
              onBack={onClose}
              initialData={deliveryDetails}
            />
          )}
          
          {step === 2 && (
            <PaymentMethodSelector
              cartTotal={cartTotal}
              deliveryCost={deliveryCost}
              onConfirm={handlePaymentConfirm}
              onBack={handleDeliveryBack}
              deliveryDetails={deliveryDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
}