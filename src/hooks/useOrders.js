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

  const cancelOrder = (id) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status: 'Annulée' } : order
      )
    );
  };

  const deleteOrder = (id) => {
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
    getOrderById
  };
}