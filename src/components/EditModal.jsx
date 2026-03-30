import { useState } from "react";
import { STATUS_STEPS } from "../data/constants";

export default function EditModal({ order, onSave, onClose }) {
  const [status, setStatus] = useState(order.status);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3> Modifier la commande</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
          {order.id} — Passée le {order.date}
        </p>
        <div className="form-group">
          <label className="form-label">STATUT DE LA COMMANDE</label>
          <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
            {STATUS_STEPS.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button 
            className="checkout-btn" 
            style={{ flex: 1 }} 
            onClick={() => { 
              onSave(order.id, status); 
              onClose(); 
            }}
          >
            Enregistrer
          </button>
          <button 
            className="order-btn" 
            style={{ flex: 1, height: "auto", padding: "0.9rem" }} 
            onClick={onClose}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}