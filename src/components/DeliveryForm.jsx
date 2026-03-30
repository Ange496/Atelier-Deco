// components/DeliveryForm.jsx
import { useState } from "react";
import "./DeliveryForm.css";

export default function DeliveryForm({ onNext, onBack, initialData }) {
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    alternativePhone: initialData?.alternativePhone || "",
    
    // Adresse de livraison
    address: initialData?.address || "",
    addressComplement: initialData?.addressComplement || "",
    city: initialData?.city || "",
    postalCode: initialData?.postalCode || "",
    country: initialData?.country || "Côte d'Ivoire",
    
    // Type de livraison
    deliveryType: initialData?.deliveryType || "standard",
    
    // Instructions
    deliveryInstructions: initialData?.deliveryInstructions || "",
    
    // Point de repère
    landmark: initialData?.landmark || "",
    
    // Informations supplémentaires
    company: initialData?.company || "",
    isBusiness: initialData?.isBusiness || false,
    
    // Préférences de livraison
    preferredDeliveryTime: initialData?.preferredDeliveryTime || "",
    leaveAtDoor: initialData?.leaveAtDoor || false,
    
    // Newsletter
    subscribeToNewsletter: initialData?.subscribeToNewsletter || false,
    
    // Notes
    notes: initialData?.notes || ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const countries = [
    "Côte d'Ivoire",
    "Sénégal",
    "Cameroun",
    "Mali",
    "Burkina Faso",
    "Niger",
    "Bénin",
    "Togo",
    "Guinée",
    "Autre"
  ];

  const cities = {
    "Côte d'Ivoire": ["Abidjan", "Bouaké", "Daloa", "Yamoussoukro", "San-Pédro", "Korhogo", "Autre"],
    "Sénégal": ["Dakar", "Thiès", "Mbour", "Saint-Louis", "Ziguinchor", "Autre"],
    "Cameroun": ["Douala", "Yaoundé", "Garoua", "Bamenda", "Maroua", "Autre"],
    "Autre": ["Autre"]
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validation du prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Prénom requis";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "Prénom trop court (minimum 2 caractères)";
    }
    
    // Validation du nom
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Nom requis";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Nom trop court (minimum 2 caractères)";
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = "Email requis";
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide (exemple: nom@domaine.com)";
    }
    
    // Validation du téléphone
    if (!formData.phone.trim()) {
      newErrors.phone = "Numéro de téléphone requis";
    } else if (!/^[0-9+\s]{8,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Numéro de téléphone invalide (minimum 8 chiffres)";
    }
    
    // Validation de l'adresse
    if (!formData.address.trim()) {
      newErrors.address = "Adresse requise";
    }
    
    // Validation de la ville
    if (!formData.city.trim()) {
      newErrors.city = "Ville requise";
    }
    
    // Validation du code postal
    if (formData.postalCode && !/^[0-9]{4,6}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Code postal invalide (4-6 chiffres)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext(formData);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const getCitiesForCountry = () => {
    if (formData.country === "Autre") return ["Autre"];
    return cities[formData.country] || cities["Autre"];
  };

  return (
    <div className="delivery-form-container">
      <div className="form-header">
        <h3>Détails de livraison</h3>
        <p className="form-subtitle">
          Veuillez remplir toutes les informations nécessaires pour la livraison de votre commande
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Section 1: Informations personnelles */}
        <div className="form-section">
          <div className="section-title">
            <span className="section-number">1</span>
            <h4>Informations personnelles</h4>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                Prénom <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jean"
                className={errors.firstName ? "error" : ""}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">
                Nom <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Dupont"
                className={errors.lastName ? "error" : ""}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean.dupont@email.com"
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">
                Téléphone <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01 23 45 67 89"
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="alternativePhone">
              Téléphone secondaire (optionnel)
            </label>
            <input
              type="tel"
              id="alternativePhone"
              name="alternativePhone"
              value={formData.alternativePhone}
              onChange={handleChange}
              placeholder="Autre numéro pour vous contacter"
            />
          </div>
        </div>

        {/* Section 2: Adresse de livraison */}
        <div className="form-section">
          <div className="section-title">
            <span className="section-number">2</span>
            <h4>Adresse de livraison</h4>
          </div>
          
          <div className="form-group">
            <label htmlFor="address">
              Adresse <span className="required">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Numéro, rue, quartier"
              className={errors.address ? "error" : ""}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="addressComplement">
              Complément d'adresse (optionnel)
            </label>
            <input
              type="text"
              id="addressComplement"
              name="addressComplement"
              value={formData.addressComplement}
              onChange={handleChange}
              placeholder="Appartement, bâtiment, étage, résidence"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country">
                Pays <span className="required">*</span>
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="city">
                Ville <span className="required">*</span>
              </label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? "error" : ""}
              >
                <option value="">Sélectionnez une ville</option>
                {getCitiesForCountry().map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postalCode">
                Code postal (optionnel)
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Ex: 00225"
                className={errors.postalCode ? "error" : ""}
              />
              {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="landmark">
                Point de repère (optionnel)
              </label>
              <input
                type="text"
                id="landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Près de l'église, en face du marché..."
              />
            </div>
          </div>
        </div>

        {/* Section 3: Type de livraison */}
        <div className="form-section">
          <div className="section-title">
            <span className="section-number">3</span>
            <h4>Type de livraison</h4>
          </div>
          
          <div className="delivery-options">
            <div 
              className={`delivery-option ${formData.deliveryType === "standard" ? "selected" : ""}`}
              onClick={() => setFormData(prev => ({ ...prev, deliveryType: "standard" }))}
            >
              <div className="option-icon">🚚</div>
              <div className="option-info">
                <div className="option-title">Livraison standard</div>
                <div className="option-desc">Délai: immediate</div>
                <div className="option-price">1 500 Fcfa</div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Section 4: Préférences de livraison */}
        <div className="form-section">
          <div className="section-title">
            <span className="section-number">4</span>
            <h4>Préférences de livraison</h4>
          </div>
          
          <div className="form-group">
            <label htmlFor="preferredDeliveryTime">
              Créneau horaire préféré (optionnel)
            </label>
            <select
              id="preferredDeliveryTime"
              name="preferredDeliveryTime"
              value={formData.preferredDeliveryTime}
              onChange={handleChange}
            >
              <option value="">Aucune préférence</option>
              <option value="morning">Matin (8h - 12h)</option>
              <option value="afternoon">Après-midi (12h - 17h)</option>
              <option value="evening">Soirée (17h - 20h)</option>
            </select>
          </div>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="leaveAtDoor"
                checked={formData.leaveAtDoor}
                onChange={handleChange}
              />
              <span>Je donne l'autorisation de laisser le colis à la porte en mon absence</span>
            </label>
          </div>
        </div>

        {/* Section 5: Instructions supplémentaires */}
        <div className="form-section">
          <div className="section-title">
            <span className="section-number">5</span>
            <h4>Instructions supplémentaires</h4>
          </div>
          
          <div className="form-group">
            <label htmlFor="deliveryInstructions">
              Instructions spéciales pour le livreur (optionnel)
            </label>
            <textarea
              id="deliveryInstructions"
              name="deliveryInstructions"
              value={formData.deliveryInstructions}
              onChange={handleChange}
              placeholder="Sonner à la porte de derrière, appeler avant d'arriver, code d'accès..."
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">
              Notes additionnelles (optionnel)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Autres informations importantes concernant votre commande..."
              rows="2"
            />
          </div>
        </div>

        {/* Section 6: Options supplémentaires */}
        <div className="form-section">
          <div className="section-title">
            <span className="section-number">6</span>
            <h4>Options supplémentaires</h4>
          </div>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isBusiness"
                checked={formData.isBusiness}
                onChange={handleChange}
              />
              <span>Il s'agit d'une commande professionnelle</span>
            </label>
          </div>
          
          {formData.isBusiness && (
            <div className="form-group">
              <label htmlFor="company">
                Nom de l'entreprise / Société
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Nom de votre entreprise"
              />
            </div>
          )}
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="subscribeToNewsletter"
                checked={formData.subscribeToNewsletter}
                onChange={handleChange}
              />
              <span>Je souhaite recevoir les offres et actualités par email</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onBack}>
            Retour au panier
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Traitement en cours..." : "Continuer vers le paiement"}
          </button>
        </div>
      </form>
    </div>
  );
}