import { useState } from "react";
import TrackingModal from "../components/TrackingModal";
import EditModal from "../components/EditModal";
import { formatPrice, getStatusStyle } from "../utils/helpers";

export default function Orders({ orders, onCancelOrder, onDeleteOrder, onUpdateStatus }) {
  const [trackOrder, setTrackOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="page-title">Mes <span>Commandes</span></div>
        <div className="empty-cart">
          <div className="icon"></div>
          <h3>Aucune commande</h3>
          <p>Vous n'avez pas encore passé de commande</p>
          <button 
            className="add-cart-btn" 
            style={{ marginTop: "1.5rem", display: "inline-block", width: "auto", padding: "0.75rem 2rem" }}
            onClick={() => window.location.reload()} // This should navigate to products
          >
            Commencer mes achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="page-title">Mes <span>Commandes</span></div>
      
      {orders.map(order => {
        const statusStyle = getStatusStyle(order.status);
        
        return (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <div className="order-id">{order.id}</div>
                <div className="order-date">Passée le {order.date}</div>
              </div>
              <span 
                className="order-status"
                style={{
                  background: statusStyle.bg,
                  color: statusStyle.color
                }}
              >
                {order.status}
              </span>
            </div>
            
            <div className="order-items-list">
              {order.items.map(item => (
                <img 
                  key={item.id} 
                  className="order-item-thumb" 
                  src={item.img} 
                  alt={item.name} 
                  title={item.name} 
                />
              ))}
            </div>
            
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {order.items.length} article{order.items.length > 1 ? "s" : ""} —{" "}
              <span className="order-total">{formatPrice(order.total)}</span>
            </div>
            
            <div className="order-actions">
              <button className="order-btn primary" onClick={() => setTrackOrder(order)}>
                 Suivre
              </button>
            
              <button className="order-btn" onClick={() => onCancelOrder(order.id)}>
                 Annuler
              </button>
              <button 
                className="order-btn" 
                style={{ color: "#f44" }}
                onClick={() => onDeleteOrder(order.id)}
              >
                 Supprimer
              </button>
            </div>
          </div>
        );
      })}

      {trackOrder && (
        <TrackingModal order={trackOrder} onClose={() => setTrackOrder(null)} />
      )}
      
      {editOrder && (
        <EditModal 
          order={editOrder} 
          onSave={onUpdateStatus} 
          onClose={() => setEditOrder(null)} 
        />
      )}
    </div>
  );
}