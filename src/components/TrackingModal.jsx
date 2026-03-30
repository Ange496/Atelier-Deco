import { STATUS_STEPS } from "../data/constants";
import { getStatusStyle } from "../utils/helpers";

export default function TrackingModal({ order, onClose }) {
  const currentIdx = STATUS_STEPS.indexOf(order.status);
  const subtitles = [
    "Votre commande a été confirmée",
    "Nos équipes préparent votre colis",
    "Colis remis au transporteur",
    "Votre colis est en route",
    "Livré à destination ✓",
  ];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3> Suivi de commande</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
          Commande <strong style={{ color: "var(--orange)" }}>{order.id}</strong>
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
          Passée le {order.date}
        </p>
        <div className="tracking-steps">
          {STATUS_STEPS.map((step, i) => {
            const done = i < currentIdx;
            const current = i === currentIdx;
            const isLast = i === STATUS_STEPS.length - 1;
            
            return (
              <div className="tracking-step" key={step}>
                <div className="step-line-wrap">
                  <div className={`step-dot ${done ? "done" : current ? "current" : ""}`}>
                    {done ? "✓" : i + 1}
                  </div>
                  {!isLast && <div className={`step-vline ${done ? "done" : ""}`} />}
                </div>
                <div className="step-info">
                  <div className="step-label" style={{ color: done || current ? "var(--text)" : "var(--text-muted)" }}>
                    {step}
                  </div>
                  <div className="step-sub">{subtitles[i]}</div>
                </div>
              </div>
            );
          })}
        </div>
        <button className="checkout-btn" style={{ marginTop: "1.5rem" }} onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}