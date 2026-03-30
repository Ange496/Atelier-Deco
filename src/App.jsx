import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import Products from './pages/Products';
import Detail from './pages/Detail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Auth from './pages/Auth';
import { useCart } from './hooks/useCart';
import { useToast } from './hooks/useToast';
import { useOrders } from './hooks/useOrders';
import { useTheme } from './hooks/useTheme';
import { generateOrderId } from './utils/helpers';
import './styles/main.css';

function App() {
  const [page, setPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [user, setUser] = useState(null);
  const [pendingOrder, setPendingOrder] = useState(null);
  
  const { cart, addToCart, updateQuantity, removeFromCart, cartTotal, cartCount, clearCart } = useCart();
  const { orders, placeOrder, cancelOrder, deleteOrder, updateOrderStatus, getOrderById } = useOrders();
  const { showToast, toastMessage } = useToast();
  const { darkMode, toggleTheme } = useTheme();

  // Check for existing user session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    showToast(`Bienvenue ${userData.name || userData.email.split('@')[0]} !`);
    
    if (pendingOrder) {
      setPage('cart');
      setPendingOrder(null);
    } else if (page === 'auth') {
      setPage('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    showToast('Déconnexion réussie');
    setPage('home');
  };

  const handlePlaceOrder = (orderData) => {
    console.log("App - handlePlaceOrder reçu:", orderData);
    
    if (cart.length === 0) {
      console.warn("App - Panier vide!");
      return;
    }
    
    if (!user) {
      console.log("App - Utilisateur non connecté, redirection auth");
      setPendingOrder({
        items: cart,
        total: cartTotal,
        paymentData: orderData
      });
      showToast('Veuillez vous connecter pour finaliser votre commande');
      setPage('auth');
      return;
    }
    
    // Place order using the hook with complete data
    console.log("App - Création de la commande avec useOrders");
    const createdOrder = placeOrder(orderData);
    console.log("App - Commande créée:", createdOrder);
    
    // Save order to user's order history
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      if (!users[userIndex].orders) users[userIndex].orders = [];
      users[userIndex].orders.push(createdOrder);
      localStorage.setItem("users", JSON.stringify(users));
    }
    
    clearCart();
    showToast("Commande passée avec succès !");
    
    // Set the order to view details
    setSelectedOrderId(createdOrder.id);
    console.log("App - Navigation vers order-details, ID:", createdOrder.id);
    setPage('order-details');
  };

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <Navbar
        page={page}
        setPage={setPage}
        user={user}
        cartCount={cartCount}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogout={handleLogout}
      />

      <main>
        {page === 'home' && (
          <Home
            cartCount={cartCount}
            onProductSelect={(product) => {
              setSelectedProduct(product);
              setPage('detail');
            }}
            onNavigateToProducts={() => setPage('products')}
          />
        )}

        {page === 'products' && (
          <Products
            searchQuery={searchQuery}
            onProductSelect={(product) => {
              setSelectedProduct(product);
              setPage('detail');
            }}
          />
        )}

        {page === 'detail' && selectedProduct && (
          <Detail
            product={selectedProduct}
            onAddToCart={addToCart}
            onBack={() => setPage('products')}
          />
        )}

        {page === 'cart' && (
          <Cart
            cart={cart}
            cartTotal={cartTotal}
            updateQty={updateQuantity}
            removeFromCart={removeFromCart}
            onCheckout={handlePlaceOrder}
            onNavigateToProducts={() => setPage('products')}
            onNavigateToOrderDetails={() => {
              if (selectedOrderId) {
                setPage('order-details');
              }
            }}
            user={user}
          />
        )}

        {page === 'orders' && (
          <Orders
            orders={orders}
            onCancelOrder={cancelOrder}
            onDeleteOrder={deleteOrder}
            onUpdateStatus={updateOrderStatus}
          />
        )}

        {page === 'order-details' && selectedOrderId && (
          <OrderDetails
            orderId={selectedOrderId}
            orders={orders}
            onBack={() => setPage('orders')}
            onNavigateToProducts={() => setPage('products')}
          />
        )}

        {page === 'auth' && (
          <Auth 
            onAuth={handleAuth} 
            onNavigateToCart={() => setPage('cart')}
            pendingOrder={pendingOrder}
          />
        )}
      </main>

      <Footer />
      <Toast message={toastMessage} />
    </div>
  );
}

export default App;