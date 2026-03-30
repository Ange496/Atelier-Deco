import { useState, useCallback, useMemo } from "react";
import "./PaymentMethodSelector.css";
import { useNavigate } from "react-router-dom";


const formatPrice = (amount) =>
  new Intl.NumberFormat("fr-CI", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);

const validatePhoneNumber = (number, countryCode = "CI") => {
  const digits = number.replace(/\D/g, "");
  // Côte d'Ivoire phone numbers: 8-10 digits, starting with 01, 05, 07, etc.
  const patterns = {
    CI: /^(0[1-9]\d{7,9})$/,
  };
  return patterns[countryCode]?.test(digits) || digits.length >= 8;
};


const Icon = ({ children, size = 14, strokeWidth = 2, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    {...props}
  >
    {children}
  </svg>
);

const CheckIcon = () => (
  <Icon size={12} strokeWidth={2.5}>
    <path d="M2 6l3 3 5-5" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
  </Icon>
);

const ShieldIcon = () => (
  <Icon>
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" />
  </Icon>
);

const EditIcon = () => (
  <Icon size={13}>
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Icon>
);

const PhoneIcon = () => (
  <Icon>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
  </Icon>
);

const ArrowLeftIcon = () => (
  <Icon size={16}>
    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
  </Icon>
);

const CashIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="38" height="38">
    <rect x="4" y="12" width="40" height="24" rx="4" fill="#2D6A4F" />
    <rect x="10" y="18" width="28" height="12" rx="2" fill="#52B788" />
    <circle cx="24" cy="24" r="4" fill="#2D6A4F" />
    <rect x="4" y="18" width="6" height="12" fill="#1B4332" />
    <rect x="38" y="18" width="6" height="12" fill="#1B4332" />
  </svg>
);

const PaymentLogo = ({ bgColor, children }) => (
  <div className="payment-logo" style={{ backgroundColor: bgColor }}>
    {children}
  </div>
);

const OrangeMoneyLogo = () => (
  <PaymentLogo bgColor="#FFE5D4">
    <svg viewBox="0 0 80 30" width="70" height="26">
      <circle cx="15" cy="15" r="14" fill="#FF6600" />
      <circle cx="15" cy="15" r="9" fill="#fff" />
      <circle cx="15" cy="15" r="5" fill="#FF6600" />
      <text x="32" y="11" fontFamily="Arial" fontSize="8" fontWeight="700" fill="#FF6600">Orange</text>
      <text x="32" y="22" fontFamily="Arial" fontSize="8" fontWeight="700" fill="#333">Money</text>
    </svg>
  </PaymentLogo>
);

const MTNLogo = () => (
  <PaymentLogo bgColor="#FFF8E0">
    <svg viewBox="0 0 80 30" width="70" height="26">
      <rect x="0" y="4" width="26" height="22" rx="3" fill="#FFCB00" />
      <text x="3" y="19" fontFamily="Arial Black" fontSize="11" fontWeight="900" fill="#000">MTN</text>
      <text x="30" y="12" fontFamily="Arial" fontSize="8" fontWeight="700" fill="#FFCB00">Mobile</text>
      <text x="30" y="23" fontFamily="Arial" fontSize="8" fontWeight="700" fill="#333">Money</text>
    </svg>
  </PaymentLogo>
);

const MoovLogo = () => (
  <PaymentLogo bgColor="#E5F0FF">
    <svg viewBox="0 0 80 30" width="70" height="26">
      <rect x="0" y="4" width="26" height="22" rx="3" fill="#0066CC" />
      <text x="2" y="19" fontFamily="Arial Black" fontSize="10" fontWeight="900" fill="#fff">MOV</text>
      <text x="30" y="12" fontFamily="Arial" fontSize="8" fontWeight="700" fill="#0066CC">Moov</text>
      <text x="30" y="23" fontFamily="Arial" fontSize="8" fontWeight="700" fill="#333">Money</text>
    </svg>
  </PaymentLogo>
);

const WaveLogo = () => (
  <PaymentLogo bgColor="#E0F7FF">
    <svg viewBox="0 0 80 30" width="70" height="26">
      <rect x="0" y="2" width="26" height="26" rx="13" fill="#1AC3FF" />
      <path d="M6 15 Q10 9 13 15 Q16 21 20 15" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <text x="30" y="19" fontFamily="Arial Black" fontSize="13" fontWeight="900" fill="#1AC3FF">Wave</text>
    </svg>
  </PaymentLogo>
);

const PAYMENT_METHODS = [
  {
    id: "cash",
    name: "Paiement à la livraison",
    tag: "Espèces",
    tagColor: "#2D6A4F",
    tagBg: "#D8F3DC",
    description: "Payez en espèces à la réception de votre commande",
    Logo: CashIcon,
    bgColor: "#D8F3DC",
    accentColor: "#2D6A4F",
    fields: [],
  },
  {
    id: "orange_money",
    name: "Orange Money",
    tag: "Mobile",
    tagColor: "#BF4800",
    tagBg: "#FFE8D6",
    description: "Paiement instantané via Orange Money",
    Logo: OrangeMoneyLogo,
    bgColor: "#FFF4EC",
    accentColor: "#FF6600",
    placeholder: "07 XX XX XX XX",
    fields: ["phoneNumber"],
  },
  {
    id: "mtn_money",
    name: "MTN Mobile Money",
    tag: "Mobile",
    tagColor: "#7A5900",
    tagBg: "#FFF9C4",
    description: "Paiement rapide avec MTN MoMo",
    Logo: MTNLogo,
    bgColor: "#FFFDE7",
    accentColor: "#FFCB00",
    placeholder: "05 XX XX XX XX",
    fields: ["phoneNumber"],
  },
  {
    id: "moov_money",
    name: "Moov Money",
    tag: "Mobile",
    tagColor: "#003D7A",
    tagBg: "#E3F2FD",
    description: "Paiement mobile avec Moov Africa",
    Logo: MoovLogo,
    bgColor: "#EBF5FF",
    accentColor: "#0066CC",
    placeholder: "01 XX XX XX XX",
    fields: ["phoneNumber"],
  },
  {
    id: "wave",
    name: "Wave",
    tag: "Wallet",
    tagColor: "#006E99",
    tagBg: "#E0F7FF",
    description: "Transfert instantané via Wave",
    Logo: WaveLogo,
    bgColor: "#E8FAFE",
    accentColor: "#1AC3FF",
    placeholder: "07 XX XX XX XX",
    fields: ["phoneNumber"],
  },
];

const OrderSummary = ({ cartTotal, deliveryCost, deliveryDetails, onEdit }) => {
  const total = cartTotal + (deliveryCost || 1500);

  return (
    <div className="summary-card">
      <div className="summary-top">
        <span className="summary-label">Récapitulatif</span>
        <button className="edit-btn" onClick={onEdit}>
          <EditIcon /> Modifier
        </button>
      </div>

      {deliveryDetails && (
        <div className="address-row">
          <div>
            <div className="address-name">
              {deliveryDetails.firstName} {deliveryDetails.lastName}
            </div>
            <div className="address-detail">
              {deliveryDetails.address}, {deliveryDetails.city}
            </div>
            <div className="address-phone">
              <PhoneIcon /> {deliveryDetails.phone}
            </div>
          </div>
        </div>
      )}

      <div className="divider" />

      <div className="price-grid">
        <div className="price-row">
          <span className="price-label">Sous-total</span>
          <span className="price-value">{formatPrice(cartTotal)}</span>
        </div>
        <div className="price-row">
          <span className="price-label">Livraison</span>
          <span className="price-value">{formatPrice(deliveryCost || 1500)}</span>
        </div>
      </div>

      <div className="total-row">
        <span className="total-label">Total à payer</span>
        <span className="total-amount">{formatPrice(total)}</span>
      </div>
    </div>
  );
};

const PaymentMethodCard = ({ method, isSelected, onSelect }) => {
  return (
    <button
      className={`method-card ${isSelected ? "selected" : ""}`}
      style={{
        ...(isSelected && {
          borderColor: method.accentColor,
          backgroundColor: method.bgColor,
        }),
      }}
      onClick={() => onSelect(method.id)}
      aria-pressed={isSelected}
    >
      <div className={`logo-pill ${isSelected ? "selected" : ""}`}>
        <method.Logo />
      </div>

      <div className="method-info">
        <div className="method-row">
          <span
            className="method-name"
            style={{ color: isSelected ? method.accentColor : "#111" }}
          >
            {method.name}
          </span>
          <span
            className="method-tag"
            style={{
              color: method.tagColor,
              backgroundColor: method.tagBg,
            }}
          >
            {method.tag}
          </span>
        </div>
        <span className="method-desc">{method.description}</span>
      </div>

      <div
        className={`radio ${isSelected ? "selected" : ""}`}
        style={{
          backgroundColor: isSelected ? method.accentColor : "transparent",
          borderColor: isSelected ? method.accentColor : "#d0d0d0",
        }}
        aria-hidden="true"
      >
        {isSelected && <CheckIcon />}
      </div>
    </button>
  );
};

const PhoneInput = ({ method, value, onChange, error }) => {
  const handleChange = (e) => {
    const input = e.target.value;
    // Allow only digits, spaces, and '+'
    const filtered = input.replace(/[^\d+\s]/g, "");
    onChange(filtered);
  };

  return (
    <div
      className={`phone-box ${error ? "error" : ""}`}
      style={{
        borderColor: error ? "#E53E3E" : `${method.accentColor}55`,
        backgroundColor: method.bgColor,
      }}
    >
      <div className="phone-box-header">
        <div
          className="phone-icon-wrap"
          style={{
            backgroundColor: `${method.accentColor}22`,
            color: method.accentColor,
          }}
        >
          <PhoneIcon />
        </div>
        <div>
          <div className="phone-title">Numéro {method.name}</div>
          <div className="phone-hint">
            Une demande de paiement sera envoyée sur ce numéro
          </div>
        </div>
      </div>
      <input
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder={method.placeholder}
        aria-label={`Numéro de téléphone ${method.name}`}
        aria-invalid={!!error}
        className="phone-input"
        style={{
          borderColor: error ? "#E53E3E" : value ? method.accentColor : "#ddd",
        }}
      />
      {error && (
        <div className="error-msg" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

const LoadingSpinner = () => (
  <span className="spinner-wrap">
    <span className="spinner" />
    Traitement…
  </span>
);


export default function PaymentMethodSelector({
  cartTotal = 25000,
  deliveryCost = 1500,
  onConfirm,
  onBack,
  deliveryDetails,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const total = cartTotal + (deliveryCost || 1500);
  const selectedMethod = useMemo(
    () => PAYMENT_METHODS.find((m) => m.id === selectedId),
    [selectedId]
  );

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    setPhoneNumber("");
    setPhoneError("");
  }, []);

  const validate = useCallback(() => {
    if (!selectedMethod) return false;

    if (selectedMethod.fields.length > 0 && !phoneNumber.trim()) {
      setPhoneError("Veuillez entrer votre numéro de téléphone.");
      return false;
    }

    if (selectedMethod.fields.length > 0 && !validatePhoneNumber(phoneNumber)) {
      setPhoneError("Numéro invalide. Format attendu: XX XX XX XX XX");
      return false;
    }

    return true;
  }, [selectedMethod, phoneNumber]);

  const handleConfirm = useCallback(async () => {
    if (!validate()) return;

    setProcessing(true);
    try {
      console.log("🔄 PaymentMethodSelector - Début du traitement");
      
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1800));
      
      console.log("✅ PaymentMethodSelector - Traitement terminé");
      
      // Build payment data in the correct format
      const paymentData = {
        payment: {
          method: PAYMENT_METHODS.find(m => m.id === selectedId)?.name || selectedId,
          methodId: selectedId,
          phoneNumber: selectedMethod?.fields.length ? phoneNumber : undefined,
          timestamp: new Date().toISOString(),
        },
        total: total,
      };
      
      console.log("📤 PaymentMethodSelector - Données envoyées:", paymentData);
      onConfirm?.(paymentData);
    } catch (error) {
      console.error("❌ PaymentMethodSelector - Erreur:", error);
      setPhoneError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setProcessing(false);
    }
  }, [validate, selectedId, phoneNumber, selectedMethod, onConfirm, total]);

  const handlePhoneChange = useCallback((value) => {
    setPhoneNumber(value);
    if (phoneError) setPhoneError("");
  }, [phoneError]);

  return (
    <div className="payment-selector">
      <div className="header">
        <h1 className="title">Paiement</h1>
        <p className="subtitle">Choisissez votre mode de paiement</p>
      </div>

      <OrderSummary
        cartTotal={cartTotal}
        deliveryCost={deliveryCost}
        deliveryDetails={deliveryDetails}
        onEdit={onBack}
      />

      <div className="section-title">Mode de paiement</div>
      <div className="methods-list" role="radiogroup" aria-label="Modes de paiement">
        {PAYMENT_METHODS.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            isSelected={selectedId === method.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {selectedMethod?.fields.length > 0 && (
        <PhoneInput
          method={selectedMethod}
          value={phoneNumber}
          onChange={handlePhoneChange}
          error={phoneError}
        />
      )}

      <div className="actions">
        <button
          className="back-btn"
          onClick={onBack}
          disabled={processing}
          aria-label="Retour à l'étape précédente"
        >
          <ArrowLeftIcon />
          <span>Retour</span>
        </button>
        <button
          className="confirm-btn"
          style={{
            opacity: !selectedId || processing ? 0.55 : 1,
            cursor: !selectedId || processing ? "not-allowed" : "pointer",
            backgroundColor: selectedMethod?.accentColor || "#111",
          }}
          onClick={handleConfirm}
          disabled={!selectedId || processing}
          aria-label={`Confirmer le paiement de ${formatPrice(total)}`}
        >
          {processing ? (
            <LoadingSpinner />
          ) : (
            `Confirmer · ${formatPrice(total)}`
          )}
        </button>
      </div>

      

      <div className="security">
        <ShieldIcon />
        <span>Paiement 100 % sécurisé · Données chiffrées SSL</span>
      </div>
    </div>
  );
}