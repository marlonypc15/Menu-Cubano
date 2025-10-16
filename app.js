// ====== Traducciones ======
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

// ====== Utilidades ======
function getCurrentLang() {
  return document.getElementById("lang")?.value || "es";
}

function formatPriceEUR(value, lang = getCurrentLang()) {
  const locale = lang === "de" ? "de-DE" : lang === "en" ? "en-GB" : "es-ES";
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(value);
}

// ====== Platos ======
const DISHES = [
  {
    id: "pollo",
    name: {
      es: "Pollo en Salsa Criolla con Arroz Amarillo, Tomate y Cebolla",
      de: "Huhn in Kreolischer Soße mit Gelbem Reis, Tomaten und Zwiebeln",
      en: "Chicken in Creole Sauce with Yellow Rice, Tomatoes and Onions"
    },
    desc: {
      es: "Tierno pollo cocinado en salsa criolla cubana.",
      de: "Zartes Hähnchen in kubanischer Soße.",
      en: "Tender chicken in Cuban Creole sauce."
    },
    price: 22.50
  },
  {
    id: "cerdo",
    name: {
      es: "Bistec de Cerdo Frito con Congrí, Cebolla Caramelizada, Tomate y Viandas Fritas",
      de: "Gebratenes Schweinesteak mit Congri, karamellisierten Zwiebeln, Tomate & frittierten Wurzelgemüsen",
      en: "Fried Pork Steak with Congri, Caramelized Onions, Tomato & Fried Roots"
    },
    desc: {
      es: "Jugoso bistec de cerdo frito con acompañamientos cubanos.",
      de: "Knuspriges Schweinefleisch mit kubanischen Beilagen.",
      en: "Crispy pork steak with Cuban sides."
    },
    price: 25.50
  },
  {
    id: "ropa",
    name: {
      es: "Ropa Vieja con Arroz Blanco, Frijoles Colorados y Tostones",
      de: "Ropa Vieja mit Weißem Reis, Kidneybohnen & Tostones",
      en: "Ropa Vieja with White Rice, Red Beans & Tostones"
    },
    desc: {
      es: "Carne de res desmenuzada en salsa cubana.",
      de: "Zerfetztes Rindfleisch in kubanischer Soße.",
      en: "Shredded beef in Cuban sauce."
    },
    price: 25.50
  },
  {
    id: "yuca",
    name: {
      es: "Opción Vegana: Yuca con Mojo, Cebolla y Tomate",
      de: "Veggie: Yuca mit Mojo-Soße, Zwiebeln & Tomaten",
      en: "Veggie: Yuca with Mojo Sauce, Onions & Tomatoes"
    },
    desc: {
      es: "Yuca blanda bañada en mojo de ajo y cítricos.",
      de: "Yuca mit Knoblauch-Zitrus-Mojo.",
      en: "Yuca with garlic-citrus mojo."
    },
    price: 17.50
  }
];

// ====== Estado del carrito ======
const cart = new Map();

// ====== Traducción de la interfaz ======
function applyUITranslations(lang = getCurrentLang()) {
  const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.es;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
}

// ====== Render del menú ======
function renderMenu() {
  const list = document.getElementById("menu");
  const tpl = document.getElementById("dish-template");
  if (!list || !tpl) return;

  const lang = getCurrentLang();
  list.innerHTML = "";

  DISHES.forEach(d => {
    const node = tpl.content.cloneNode(true);
    node.querySelector(".dish-name").textContent = d.name[lang];
    node.querySelector(".dish-desc").textContent = d.desc[lang];
    node.querySelector(".price").textContent = formatPriceEUR(d.price, lang);
    node.querySelector(".add-btn").addEventListener("click", () => addToCart(d.id));
    list.appendChild(node);
  });
}

// ====== Lógica del carrito ======
function addToCart(dishId) {
  const existing = cart.get(dishId);
  if (existing) existing.qty += 1;
  else cart.set(dishId, { id: dishId, qty: 1 });
  renderCart();
}

function removeFromCart(dishId) {
  const item = cart.get(dishId);
  if (!item) return;
  item.qty -= 1;
  if (item.qty <= 0) cart.delete(dishId);
  renderCart();
}

function deleteFromCart(dishId) {
  cart.delete(dishId);
  renderCart();
}

function getCartTotal() {
  let total = 0;
  for (const { id, qty } of cart.values()) {
    const dish = DISHES.find(d => d.id === id);
    if (dish) total += dish.price * qty;
  }
  return total;
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  if (!container || !totalEl) return;

  const lang = getCurrentLang();
  container.innerHTML = "";

  if (cart.size === 0) {
    container.innerHTML = `<p data-i18n="emptyCart">${UI_TRANSLATIONS[lang].emptyCart}</p>`;
    totalEl.textContent = formatPriceEUR(0, lang);
    return;
  }

  for (const { id, qty } of cart.values()) {
    const d = DISHES.find(x => x.id === id);
    if (!d) continue;

    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <div class="cart-name">${d.name[lang]}</div>
      <div class="cart-qty">x ${qty}</div>
      <div class="cart-price">= ${formatPriceEUR(d.price * qty, lang)}</div>
      <div class="cart-controls">
        <button class="btn-minus">-</button>
        <button class="btn-plus">+</button>
        <button class="btn-delete">Eliminar</button>
      </div>
    `;

    row.querySelector(".btn-minus").addEventListener("click", () => removeFromCart(id));
   
