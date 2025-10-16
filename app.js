// ====== Configuración de idiomas y utilidades ======
const UI_TRANSLATIONS = {
  es: {
    languageLabel: "Idioma",
    cartTitle: "Tu pedido",
    customerInfoTitle: "Datos del cliente",
    firstName: "Nombre",
    lastName: "Apellidos",
    consentText: "Acepto que mis datos se usen para procesar este pedido.",
    addToCart: "Añadir",
    emptyCart: "Tu carrito está vacío.",
    preorderText: "¿Quieres pedir por adelantado? Escríbenos por WhatsApp:",
    shareWhatsApp: "Compartir en WhatsApp",
    orderTitle: "Pedido Menú Cubano",
    customerLabel: "Cliente",
    totalLabel: "Total"
  },
  de: {
    languageLabel: "Sprache",
    cartTitle: "Deine Bestellung",
    customerInfoTitle: "Kundendaten",
    firstName: "Vorname",
    lastName: "Nachname",
    consentText: "Ich stimme zu, dass meine Daten zur Bearbeitung dieser Bestellung verwendet werden.",
    addToCart: "Hinzufügen",
    emptyCart: "Dein Warenkorb ist leer.",
    preorderText: "Möchtest du im Voraus bestellen? Schreib uns per WhatsApp:",
    shareWhatsApp: "Auf WhatsApp teilen",
    orderTitle: "Bestellung Kubanisches Menü",
    customerLabel: "Kunde",
    totalLabel: "Gesamt"
  },
  en: {
    languageLabel: "Language",
    cartTitle: "Your order",
    customerInfoTitle: "Customer details",
    firstName: "First name",
    lastName: "Last name",
    consentText: "I agree that my data will be used to process this order.",
    addToCart: "Add",
    emptyCart: "Your cart is empty.",
    preorderText: "Want to order in advance? Send us a message on WhatsApp:",
    shareWhatsApp: "Share on WhatsApp",
    orderTitle: "Cuban Menu Order",
    customerLabel: "Customer",
    totalLabel: "Total"
  }
};

// Idioma actual
function getCurrentLang() {
  return document.getElementById("lang")?.value || "es";
}

// Formateo de precio según idioma
function formatPriceEUR(value, lang = getCurrentLang()) {
  const locale = lang === "de" ? "de-DE" : lang === "en" ? "en-GB" : "es-ES";
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(value);
}

// ====== Platos con traducciones completas ======
const DISHES =
