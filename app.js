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

// Idioma actual (se sincroniza con el selector)
function getCurrentLang() {
  return document.getElementById("lang")?.value || "es";
}

// Formateo de precio según idioma
function formatPriceEUR(value, lang = getCurrentLang()) {
  const locale = lang === "de" ? "de-DE" : lang === "en" ? "en-GB" : "es-ES";
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(value);
}

// ====== Platos con traducciones completas ======
const DISHES = [
  {
    id: "pollo",
    name: {
      es: "Pollo en Salsa Criolla con Arroz Amarillo, Tomate 🍅 y Cebolla 🧅",
      de: "Huhn in Kreolischer Soße mit Gelbem Reis, Tomaten 🍅 und Zwiebeln 🧅",
      en: "Chicken in Creole Sauce with Yellow Rice, Fresh Tomatoes 🍅 and Onions 🧅"
    },
    desc: {
      es: "Tierno pollo cocinado en una salsa criolla cubana a base de tomate. Servido con arroz amarillo aromático.",
      de: "Zartes Hähnchen in einer traditionellen kubanischen Tomatensoße geschmort. Serviert mit aromatischem gelbem Reis.",
      en: "Tender chicken simmered in a traditional Cuban tomato-based sauce. Served with aromatic yellow rice."
    },
    price: 22.50
  },
  {
    id: "cerdo",
    name: {
      es: "Bistec de Cerdo Frito con Congrí, Cebolla Caramelizada, Tomate y Viandas Fritas",
      de: "Gebratenes Schweinesteak mit Congri Reis, karamellisierten Zwiebeln, Tomate & frittierten Wurzelgemüsen",
      en: "Fried Pork Steak with Congri Rice, Caramelized Onions, Tomato & Fried Root Vegetables"
    },
    desc: {
      es: "Jugoso bistec de cerdo frito, acompañado de nuestro sabroso congrí (arroz con frijoles negros), dulce cebolla caramelizada y viandas fritas (yuca y plátano).",
      de: "Knusprig gebratenes Schweinefleisch mit würzigem Reis mit schwarzen Bohnen, süßen karamellisierten Zwiebeln und einer Beilage aus frittierter Yuca und Kochbananen.",
      en: "Crispy fried pork served with savory rice and black beans, sweet caramelized onions, and a side of fried yuca and sweet plantain."
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
      es: "Clásico cubano: carne de res desmenuzada en una sabrosa salsa con pimientos y cebollas. Acompañado de arroz blanco, frijoles colorados y tostones (plátanos verdes fritos).",
      de: "Das klassische kubanische Gericht \"zerkleinertes Rindfleisch\" in einer kräftigen Soße mit Paprika und Zwiebeln. Dazu weißer Reis, rote Bohnen und knusprige frittierte Kochbananen.",
      en: "Classic Cuban \"shredded beef stew\" in a rich sauce with peppers and onions. Accompanied by white rice, red beans, and crispy fried plantains."
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
      es: "Yuca blanda bañada en nuestra marinada \"mojo\" de ajo y cítricos, acompañada de cebolla y tomate fresco.",
      de: "Weiche Yuca-Wurzel, übergossen mit einer pikanten Knoblauch-Zitrus-Marinade (\"Mojo\"), verfeinert mit frischen Zwiebeln und Tomaten.",
      en: "Soft yuca root smothered in a zesty garlic-citrus \"mojo\" marinade, topped with fresh onions and tomatoes."
    },
    price: 17.50
  }
];

// ====== Estado del carrito ======
const cart = new Map(); // id -> { id, qty }

// ====== Traducción de la interfaz (data-i18n) ======
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
  if (!list || !tpl) {
    console.error("Falta #menu o #dish-template en el DOM.");
    return;
  }

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

  const lang = document.getElementById("lang")?.value || "es";
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
    row.querySelector(".btn-plus").addEventListener("click", () => addToCart(id));
    row.querySelector(".btn-delete").addEventListener("click", () => deleteFromCart(id));

    container.appendChild(row);
  }

  totalEl.textContent = formatPriceEUR(getCartTotal(), lang);
}

// ====== WhatsApp ======
function buildOrderSummaryText() {
  const lang = getCurrentLang();
  const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.es;

  const firstName = document.getElementById("firstName")?.value.trim() || "";
  const lastName = document.getElementById("lastName")?.value.trim() || "";

  const lines = [];
  lines.push(dict.orderTitle);
  lines.push(`${dict.customerLabel}: ${firstName} ${lastName}`);

  for (const { id, qty } of cart.values()) {
    const d = DISHES.find(x => x.id === id);
    if (!d) continue;
    lines.push(`- ${d.name[lang]} x${qty} = ${formatPriceEUR(d.price * qty, lang)}`);
  }

  lines.push(`${dict.totalLabel}: ${formatPriceEUR(getCartTotal(), lang)}`);
  return lines.join("\n");
}

function setupShareButtons() {
  const btnWhats = document.getElementById("shareWhatsApp");
  if (!btnWhats) return;
  btnWhats.addEventListener("click", () => {
    const text = buildOrderSummaryText();
    // Sustituye este número si cambias el contacto de WhatsApp
    const url = `https://wa.me/4917656925042?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  });
}

// ====== Inicialización ======
function init() {
  // Render inicial
  applyUITranslations(getCurrentLang());
  renderMenu();
  renderCart();
  setupShareButtons();

  // Cambio de idioma: re-traducir interfaz y re-render del menú y carrito
  const langSelect = document.getElementById("lang");
  if (langSelect) {
    langSelect.addEventListener("change", e => {
      const lang = e.target.value;
      applyUITranslations(lang);
      renderMenu();  // refrescar nombres y descripciones de platos
      renderCart();  // refrescar nombres en el carrito y formato de precios
    });
  }
}

// Arranque cuando el DOM está listo
document.addEventListener("DOMContentLoaded", init);
