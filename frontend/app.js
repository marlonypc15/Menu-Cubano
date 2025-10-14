// Estado global del carrito
const state = { cart: {} };

const firstNameEl = document.getElementById("firstName");
const lastNameEl = document.getElementById("lastName");
const totalEl = document.getElementById("total");

function calculateTotal() {
  const items = Object.values(state.cart);
  return items.reduce((sum, it) => sum + it.qty * it.price, 0).toFixed(2);
}

function renderTotal() {
  totalEl.textContent = calculateTotal();
}

function addToCart(product) {
  if (!state.cart[product.id]) {
    state.cart[product.id] = { ...product, qty: 1 };
  } else {
    state.cart[product.id].qty++;
  }
  renderTotal();
}

async function sendOrderToBackend() {
  const customer = {
    firstName: firstNameEl.value.trim(),
    lastName: lastNameEl.value.trim()
  };
  const items = Object.values(state.cart);
  const total = calculateTotal();

  const payload = { customer, items, total };

  try {
    const res = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.ok) {
      alert("✅ Pedido enviado y notificación enviada por email");
      state.cart = {};
      renderTotal();
    } else {
      alert("⚠️ Hubo un problema al enviar el pedido");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error de conexión con el servidor");
  }
}

// PayPal
paypal.Buttons({
  createOrder: (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: { value: calculateTotal() }
      }]
    });
  },
  onApprove: (data, actions) => {
    return actions.order.capture().then(details => {
      alert("Pago completado por " + details.payer.name.given_name);
      sendOrderToBackend();
    });
  }
}).render("#paypal-button-container");

// Eventos de botones de productos
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: parseFloat(btn.dataset.price)
    };
    addToCart(product);
  });
});

renderTotal();