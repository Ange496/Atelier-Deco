export function generateOrderId() {
  return "AD-" + Date.now().toString(36).toUpperCase();
}

export function getCurrentDate() {
  return new Date().toLocaleDateString("fr-FR");
}

export function formatPrice(price) {
  return `${price.toLocaleString("fr-FR")} FCFA`;
}

export const getStatusStyle = (status) => {
  const styles = {
    'Confirmée': { bg: 'rgba(255,107,0,0.15)', color: '#FF6B00' },
    'En préparation': { bg: 'rgba(255,200,0,0.15)', color: '#f5c300' },
    'Expédiée': { bg: 'rgba(100,150,255,0.15)', color: '#6496ff' },
    'En livraison': { bg: 'rgba(150,100,255,0.15)', color: '#9664ff' },
    'Livrée': { bg: 'rgba(50,200,100,0.15)', color: '#32c864' }
  };
  return styles[status] || styles['Confirmée'];
};