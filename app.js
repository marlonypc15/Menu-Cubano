// Traducciones
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
  de: { /* traducciones alemán */ },
  en: { /* traducciones inglés */ }
};

function getCurrentLang() {
  return document.getElementById("lang")?.value || "es";
}

function formatPriceEUR(value, lang = getCurrentLang()) {
  const locale = lang === "de" ? "de-DE" : lang === "en" ? "en-GB" : "es-ES";
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(value);
}

const DISHES = [
  {
    id: "ropa",
    name: {
      es: "Ropa Vieja con Arroz Blanco, Frijoles Colorados y Tostones",
      de: "Ropa Vieja mit Weißem Reis, Kidneybohnen & Tostones",
      en: "Ropa Vieja with White Rice, Red Beans & Tostones"
    },
    desc: {
      es: "Carne de res desmenuzada en salsa cubana con arroz blanco y frijoles.",
      de: "Zerfetztes Rindfleisch in kubanischer Soße mit Reis und Bohnen.",
      en: "Shredded beef in Cuban sauce with rice and beans."
    },
    price: 25.50
  }
];

const cart = new Map();

function applyUITranslations(lang = getCurrentLang()) {
  const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.es;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
}

function renderMenu() {
  const list = document.getElementById("menu");
  const tpl = document.getElementById("dish-template");
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
