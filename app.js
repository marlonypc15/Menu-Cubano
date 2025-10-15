// ====== Traducciones ======
const translations = {
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
    shareWhatsApp: "Compartir en WhatsApp"
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
    shareWhatsApp: "Auf WhatsApp teilen"
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
    shareWhatsApp: "Share on WhatsApp"
  }
};

// ====== Función de traducción ======
function applyTranslations(lang) {
  const dict = translations[lang] || translations.es;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

// ====== Datos del menú ======
const dishes = [
  { id: 'pollo', name: 'Pollo en Salsa Criolla', desc: 'Tierno pollo en salsa criolla acompañado de arroz blanco.', price: 12.50 },
  { id: 'cerdo', name: 'Bistec de Cerdo Frito', desc: 'Bistec de cerdo frito acompañado de arroz blanco y maduros fritos.', price: 12.00 },
  { id: 'ropa', name: 'Ropa Vieja', desc: 'Carne deshebrada en salsa criolla con arroz blanco y maduros fritos.', price: 13.00 },
  { id: 'yuca', name: 'Opción Vegana: Yuca con Mojo', desc: 'Yuca con mojo, coleslaw y arroz blanco.', price: 7.50 }
];

const cart = new Map();

function formatEUR(value) { return `€${value.toFixed(2)}`; }
function getCartTotalNumber() { return [...cart.values()].reduce((t, i) => t + i.price * i.qty, 0); }

function renderMenu() {
  const list = document.getElementById('menu');
  const tpl = document.getElementById('dish-template');
  list.innerHTML = "";
  dishes.forEach(d => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.dish-name').textContent = d.name;
    node.querySelector('.dish-desc').textContent = d.desc;
    node.querySelector('.price').textContent = formatEUR(d.price);
    node.querySelector('.add-btn').addEventListener('click', () => addToCart(d));
    list.appendChild(node);
  });
}

function addToCart(dish) {
  const existing = cart.get(dish.id);
  if (existing) existing.qty++;
  else cart.set(dish.id, { ...dish, qty: 1 });
  renderCart();
}

function removeFromCart(id) {
  const item = cart.get(id);
  if (!item) return;
  item.qty--;
  if (item.qty <= 0) cart.delete(id);
  renderCart();
}

function deleteFromCart(id) { cart.delete(id); renderCart(); }
function clearCart() { cart.clear(); renderCart(); }

function renderCart() {
  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  if (cart.size === 0) {
    container.innerHTML = `<p data-i18n="emptyCart">${translations.es.emptyCart}</p>`;
  } else {
    for (const item of cart.values()) {
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <div class="cart-name">${item.name}</div>
        <div class="cart-qty">x${item.qty}</div>
        <div class="cart-price">${formatEUR(item.price * item.qty)}</div>
        <div class="cart-controls">
          <button>-</button>
          <button>+</button>
          <button>Eliminar</button>
        </div>
      `;
      const [btnMinus, btnPlus, btnDelete] = row.querySelectorAll('button');
      btnMinus.addEventListener('click', () => removeFromCart(item.id));
      btnPlus.addEventListener('click', () => addToCart(item));
      btnDelete.addEventListener('click', () => deleteFromCart(item.id));
      container.appendChild(row);
    }
  }
  document.getElementById('total').textContent = formatEUR(getCartTotalNumber());
}

// ====== WhatsApp ======
function buildOrderSummaryText() {
  const firstName = document.getElementById('firstName')?.value.trim() || '';
  const lastName = document.getElementById('lastName')?.value.trim() || '';
  const total = getCartTotalNumber();
  let lines = [];
  lines.push(`Pedido Menú Cubano`);
  lines.push(`Cliente: ${firstName} ${lastName}`);
  for (const item of cart.values()) {
    lines.push(`- ${item.name} x${item.qty} = ${formatEUR(item.price * item.qty)}`);
  }
  lines.push(`Total: ${formatEUR(total)}`);
  return lines.join('\n');
}

function setupShareButtons() {
  const btnWhats = document.getElementById('shareWhatsApp');
  btnWhats.addEventListener('click', () => {
    const text = buildOrderSummaryText();
    const url = `https://wa.me/4917656925042?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });
}

// ====== Inicialización ======
function init() {
  renderMenu();
  renderCart();
  setupShareButtons();

  const langSelect = document.getElementById("lang");
  applyTranslations(langSelect.value);
  langSelect.addEventListener("change", e => {
    applyTranslations(e.target.value);
  });
}

document.addEventListener('DOMContentLoaded', init);
