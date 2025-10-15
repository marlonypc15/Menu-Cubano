// ====== Datos del menú (puedes adaptar precios y textos) ======
const dishes = [
  {
    id: 'pollo-criolla',
    name: 'Pollo en Salsa Criolla',
    desc: 'Tierno pollo en salsa criolla con arroz amarillo, tomate y cebolla.',
    price: 22.50
  },
  {
    id: 'bistec-cerdo',
    name: 'Bistec de Cerdo Frito',
    desc: 'Jugoso bistec de cerdo frito con congrí, cebolla caramelizada, tomate y viandas fritas.',
    price: 23.00
  },
  {
    id: 'ropa-vieja',
    name: 'Ropa Vieja',
    desc: 'Ropa vieja con arroz blanco, frijoles colorados y tostones crujientes.',
    price: 20.00
  },
  {
    id: 'vegano-yuca',
    name: 'Opción Vegana: Yuca con Mojo',
    desc: 'Yuca con mojo cubano, cebolla y tomate fresco.',
    price: 17.50
  }
];

// ====== Estado del carrito ======
const cart = new Map(); // id -> { id, name, price, qty }

// ====== Utilidades ======
function formatEUR(value) {
  return `€${value.toFixed(2)}`;
}

function getCartTotalNumber() {
  let total = 0;
  for (const item of cart.values()) {
    total += item.price * item.qty;
  }
  return Number(total.toFixed(2));
}

function updateTotalDisplay() {
  const totalEl = document.getElementById('total');
  const total = getCartTotalNumber();
  totalEl.textContent = formatEUR(total);

  // Cada vez que cambie el total, re-renderiza PayPal
  renderPaypalButtons();
}

function setPaypalStatus(msg, type = 'info') {
  const el = document.getElementById('paypal-status');
  if (!el) return;
  el.textContent = msg;
  el.className = `status ${type}`;
}

function canPayWithPaypal() {
  const consent = document.getElementById('consentCheckbox')?.checked;
  const firstName = document.getElementById('firstName')?.value.trim();
  const lastName = document.getElementById('lastName')?.value.trim();
  const total = getCartTotalNumber();
  return Boolean(consent && firstName && lastName && total > 0);
}

// ====== Render del menú ======
function renderMenu() {
  const list = document.getElementById('menu');
  const tpl = document.getElementById('dish-template');

  dishes.forEach(d => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.dish-name').textContent = d.name;
    node.querySelector('.dish-desc').textContent = d.desc;
    node.querySelector('.price').textContent = formatEUR(d.price);
    const btn = node.querySelector('.add-btn');
    btn.addEventListener('click', () => addToCart(d));
    list.appendChild(node);
  });
}

// ====== Lógica del carrito ======
function addToCart(dish) {
  const existing = cart.get(dish.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.set(dish.id, { id: dish.id, name: dish.name, price: dish.price, qty: 1 });
  }
  renderCart();
}

function removeFromCart(id) {
  const item = cart.get(id);
  if (!item) return;
  item.qty -= 1;
  if (item.qty <= 0) cart.delete(id);
  renderCart();
}

function deleteFromCart(id) {
  cart.delete(id);
  renderCart();
}

function clearCart() {
  cart.clear();
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  container.innerHTML = '';

  if (cart.size === 0) {
    container.innerHTML = '<p data-i18n="emptyCart">Tu carrito está vacío.</p>';
  } else {
    for (const item of cart.values()) {
      const row = document.createElement('div');
      row.className = 'cart-row';

      const name = document.createElement('div');
      name.className = 'cart-name';
      name.textContent = item.name;

      const qty = document.createElement('div');
      qty.className = 'cart-qty';
      qty.textContent = `x${item.qty}`;

      const price = document.createElement('div');
      price.className = 'cart-price';
      price.textContent = formatEUR(item.price * item.qty);

      const controls = document.createElement('div');
      controls.className = 'cart-controls';

      const btnMinus = document.createElement('button');
      btnMinus.textContent = '-';
      btnMinus.title = 'Quitar uno';
      btnMinus.addEventListener('click', () => removeFromCart(item.id));

      const btnPlus = document.createElement('button');
      btnPlus.textContent = '+';
      btnPlus.title = 'Añadir uno';
      btnPlus.addEventListener('click', () => addToCart({ id: item.id, name: item.name, price: item.price }));

      const btnDelete = document.createElement('button');
      btnDelete.textContent = 'Eliminar';
      btnDelete.title = 'Eliminar del carrito';
      btnDelete.addEventListener('click', () => deleteFromCart(item.id));

      controls.append(btnMinus, btnPlus, btnDelete);
      row.append(name, qty, price, controls);
      container.appendChild(row);
    }
  }

  updateTotalDisplay();
}

// ====== Botones auxiliares ======
function buildOrderSummaryText() {
  const firstName = document.getElementById('firstName')?.value.trim() || '';
  const lastName = document.getElementById('lastName')?.value.trim() || '';
  const total = getCartTotalNumber();
  let lines = [];
  lines.push(`Pedido Menú Cubano`);
  lines.push(`Cliente: ${firstName} ${lastName}`);
  lines.push(`Artículos:`);
  for (const item of cart.values()) {
    lines.push(`- ${item.name} x${item.qty} = ${formatEUR(item.price * item.qty)}`);
  }
  lines.push(`Total: ${formatEUR(total)}`);
  return lines.join('\n');
}

function setupShareButtons() {
  const btnWhats = document.getElementById('shareWhatsApp');
  const btnPrint = document.getElementById('printTicket');
  const btnCsv = document.getElementById('exportCsv');
  const btnCopy = document.getElementById('copyClipboard');

  btnWhats.addEventListener('click', () => {
    const text = buildOrderSummaryText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });

  btnPrint.addEventListener('click', () => {
    const text = buildOrderSummaryText();
    const w = window.open('', 'PRINT', 'height=600,width=800');
    w.document.write('<pre style="font-family:monospace;font-size:14px;">' + text + '</pre>');
    w.document.close();
    w.focus();
    w.print();
    w.close();
  });

  btnCsv.addEventListener('click', () => {
    let csv = 'Producto,Cantidad,Precio unitario,Subtotal\n';
    for (const item of cart.values()) {
      csv += `"${item.name}",${item.qty},${item.price.toFixed(2)},${(item.price * item.qty).toFixed(2)}\n`;
    }
    csv += `TOTAL,,,${getCartTotalNumber().toFixed(2)}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pedido_menu_cubano.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  btnCopy.addEventListener('click', async () => {
    const text = buildOrderSummaryText();
    try {
      await navigator.clipboard.writeText(text);
      alert('Pedido copiado al portapapeles.');
    } catch {
      alert('No se pudo copiar. Tu navegador puede requerir interacción.');
    }
  });
}

// ====== Integración PayPal ======
function renderPaypalButtons() {
  const container = document.getElementById('paypal-buttons');
  if (!window.paypal || !container) return;

  // Limpia render anterior
  container.innerHTML = '';

  if (!canPayWithPaypal()) {
    setPaypalStatus('Completa tus datos y acepta el consentimiento para habilitar PayPal.', 'warning');
    return;
  }

  const total = getCartTotalNumber();
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();

  paypal.Buttons({
    style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
    createOrder: (data, actions) => {
      setPaypalStatus('Creando orden…', 'info');
      return actions.order.create({
        purchase_units: [{
          amount: { currency_code: 'EUR', value: total.toFixed(2) },
          description: 'Pedido Menú Cubano',
          custom_id: `menu-${Date.now()}`,
          shipping: { name: { full_name: `${firstName} ${lastName}` } }
        }],
        application_context: { brand_name: 'Kuba con K', user_action: 'PAY_NOW' }
      });
    },
    onApprove: (data, actions) => {
      setPaypalStatus('Procesando pago…', 'info');
      return actions.order.capture().then(details => {
        const payer = details.payer?.name?.given_name || 'Cliente';
        setPaypalStatus(`Pago completado. ¡Gracias, ${payer}!`, 'success');
        // Acciones post-pago:
        // 1) Imprimir ticket automáticamente
        autoPrintTicket();
        // 2) (Opcional) Guardar en backend: fetch('/orders', { ... })
        // 3) Vaciar carrito
        clearCart();
      });
    },
    onCancel: () => setPaypalStatus('Pago cancelado por el usuario.', 'warning'),
    onError: err => {
      console.error(err);
      setPaypalStatus('Error en el pago. Reintenta o usa otro método.', 'error');
    }
  }).render('#paypal-buttons');
}

function autoPrintTicket() {
  const text = buildOrderSummaryText();
  const w = window.open('', 'PRINT', 'height=600,width=800');
  w.document.write('<pre style="font-family:monospace;font-size:14px;">' + text + '</pre>');
  w.document.close();
  w.focus();
  w.print();
  w.close();
}

// ====== Inicialización ======
function init() {
  renderMenu();
  renderCart();
  setupShareButtons();

  // Re-render PayPal al cambiar consentimiento/datos
  const consent = document.getElementById('consentCheckbox');
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  [consent, firstName, lastName].forEach(el => {
    if (el) el.addEventListener('change', renderPaypalButtons);
    if (el) el.addEventListener('input', renderPaypalButtons);
  });

  // Primer intento de render de botones (si ya hay datos)
  renderPaypalButtons();
}

document.addEventListener('DOMContentLoaded', init);