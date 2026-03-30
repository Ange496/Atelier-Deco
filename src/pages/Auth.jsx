import { useState } from "react";

export default function Auth({ onAuth, onNavigateToCart, pendingOrder }) {
  const [authMode, setAuthMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const newErrors = {};

    if (authMode === "register") {
      if (!formData.name.trim()) {
        newErrors.name = "Le nom est requis";
      } else if (formData.name.length < 2) {
        newErrors.name = "Le nom doit contenir au moins 2 caractères";
      }
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (authMode === "register") {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if user exists in localStorage
  const getUserByEmail = (email) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    return users.find(user => user.email === email);
  };

  const saveUser = (userData) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
      orders: []
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return newUser;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (authMode === "login") {
      // Login logic
      const user = getUserByEmail(formData.email);
      if (user && user.password === formData.password) {
        const { password, ...userWithoutPassword } = user;
        onAuth(userWithoutPassword);
        // If there was a pending order, redirect to cart
        if (pendingOrder) {
          onNavigateToCart();
        }
      } else {
        setErrors({ general: "Email ou mot de passe incorrect" });
      }
    } else {
      // Register logic
      const existingUser = getUserByEmail(formData.email);
      if (existingUser) {
        setErrors({ email: "Un compte existe déjà avec cet email" });
      } else {
        const newUser = saveUser({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        const { password, ...userWithoutPassword } = newUser;
        onAuth(userWithoutPassword);
        // If there was a pending order, redirect to cart
        if (pendingOrder) {
          onNavigateToCart();
        }
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{authMode === "login" ? "Connexion" : "Inscription"}</h2>
        <p>
          {authMode === "login" 
            ? "Accédez à votre compte Atelier Deco" 
            : "Créez votre compte Atelier Deco"}
        </p>
        
        {pendingOrder && (
          <div className="auth-warning">
            ⚠️ Connectez-vous pour finaliser votre commande
          </div>
        )}
        
        {errors.general && (
          <div className="error-message-box">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {authMode === "register" && (
            <div className="form-group">
              <label className="form-label">NOM COMPLET</label>
              <input 
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder="Votre nom" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">EMAIL</label>
            <input 
              className={`form-input ${errors.email ? "error" : ""}`}
              type="email" 
              placeholder="votre@email.com" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">MOT DE PASSE</label>
            <input 
              className={`form-input ${errors.password ? "error" : ""}`}
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              disabled={isLoading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            {authMode === "register" && (
              <small className="input-hint">Minimum 6 caractères</small>
            )}
          </div>
          
          {authMode === "register" && (
            <div className="form-group">
              <label className="form-label">CONFIRMER MOT DE PASSE</label>
              <input 
                className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                type="password" 
                placeholder="••••••••" 
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={isLoading}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          )}
          
          {authMode === "login" && (
            <div className="forgot-password">
              <a href="#" onClick={(e) => e.preventDefault()}>
                Mot de passe oublié ?
              </a>
            </div>
          )}
          
          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? "⏳ Chargement..." : (authMode === "login" ? "Se connecter" : "Créer mon compte")}
          </button>
        </form>
   
        <div className="auth-toggle">
          {authMode === "login" ? (
            <>Pas encore de compte ? <span onClick={() => setAuthMode("register")}>S'inscrire</span></>
          ) : (
            <>Déjà un compte ? <span onClick={() => setAuthMode("login")}>Se connecter</span></>
          )}
        </div>
        
      </div>
    </div>
  );
}