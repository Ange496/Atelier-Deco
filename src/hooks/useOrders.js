import { useState, useEffect } from 'react';
import { generateOrderId } from '../utils/helpers';

export function useOrders() {
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (orderData) => {
    const newOrder = {
      id: generateOrderId(),
      orderNumber: `CMD-${Date.now()}`,
      date: new Date().toISOString(),
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      delivery: orderData.delivery || {},
      payment: orderData.payment || {},
      total: orderData.total || 0,
      status: 'Confirmée',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Confirmée',
          timestamp: new Date().toISOString(),
          message: 'Votre commande a été confirmée'
        }
      ]
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const canCancelOrder = (id) => {
    const order = orders.find(o => o.id === id);
    if (!order) return false;
    
    const createdAtTime = new Date(order.createdAt).getTime();
    const nowTime = new Date().getTime();
    const elapsedSeconds = (nowTime - createdAtTime) / 1000;
    
    return elapsedSeconds < 60; // Peut annuler seulement dans les 60 premières secondes
  };

  const cancelOrder = (id) => {
    if (!canCancelOrder(id)) {
      throw new Error('Vous ne pouvez annuler une commande que dans le délai d\'une minute après sa création');
    }
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status: 'Annulée' } : order
      )
    );
  };

  const canDeleteOrder = (id) => {
    const order = orders.find(o => o.id === id);
    if (!order) return false;
    
    const createdAtTime = new Date(order.createdAt).getTime();
    const nowTime = new Date().getTime();
    const elapsedSeconds = (nowTime - createdAtTime) / 1000;
    
    return elapsedSeconds < 60; // Peut supprimer seulement dans les 60 premières secondes
  };

  const deleteOrder = (id) => {
    if (!canDeleteOrder(id)) {
      throw new Error('Vous ne pouvez supprimer une commande que dans le délai d\'une minute après sa création');
    }
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === id) {
          const newTimeline = [...(order.timeline || [])];
          newTimeline.push({
            status,
            timestamp: new Date().toISOString(),
            message: `Commande ${status.toLowerCase()}`
          });
          return { ...order, status, timeline: newTimeline };
        }
        return order;
      })
    );
  };

  const getOrderById = (id) => {
    return orders.find(order => order.id === id);
  };

  return {
    orders,
    placeOrder,
    cancelOrder,
    deleteOrder,
    updateOrderStatus,
    getOrderById,
    canDeleteOrder,
    canCancelOrder
  };
}