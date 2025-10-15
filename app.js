// ====== Traducciones de la interfaz ======
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

// ====== Platos con traducciones ======
const dishes = [
  {
    id: 'pollo',
    name: {
      es: 'Pollo en Salsa Criolla con Arroz Amarillo, Tomate 🍅 y Cebolla 🧅',
      de: 'Huhn in Kreolischer Soße mit Gelbem Reis, Tomaten 🍅 und Zwiebeln 🧅',
      en: 'Chicken in Creole Sauce with Yellow Rice, Fresh Tomatoes 🍅 and Onions 🧅'
    },
    desc: {
      es: 'Tierno pollo cocinado en una salsa criolla cubana a base de tomate. Servido con arroz amarillo aromático.',
      de: 'Zartes Hähnchen in einer traditionellen kubanischen Tomatensoße geschmort. Serviert mit aromatischem gelbem Reis.',
      en: 'Tender chicken simmered in a traditional Cuban tomato-based sauce. Served with aromatic yellow rice.'
    },
    price: 22.50
  },
  {
    id: 'cerdo',
    name: {
      es: 'Bistec de Cerdo Frito con Congrí, Cebolla Caramelizada, Tomate y Viandas Fritas',
      de: 'Gebratenes Schweinesteak mit Congri Reis, karamellisierten Zwiebeln, Tomate & frittierten Wurzelgemüsen',
      en: 'Fried Pork Steak with Congri Rice, Caramelized Onions, Tomato & Fried Root Vegetables'
    },
    desc: {
      es: 'Jugoso bistec de cerdo frito, acompañado de nuestro sabroso congrí (arroz con frijoles negros), dulce cebolla caramelizada y viandas fritas (yuca y plátano).',
      de: 'Knusprig gebratenes Schweinefleisch mit würzigem Reis mit schwarzen Bohnen, süßen karamellisierten Zwiebeln und einer Beilage aus frittierter Yuca und Kochbananen.',
      en: 'Crispy fried pork served with savory rice and black beans, sweet caramelized onions, and a side of fried yuca and sweet plantain.'
    },
    price: 25.50
  },
  {
    id: 'ropa',
    name: {
      es: 'Ropa Vieja con Arroz Blanco, Frijoles Colorados y Tostones',
      de: 'Ropa Vieja mit Weißem Reis, Kidneybohnen & Tostones',
      en: 'Ropa Vieja with White Rice, Red Beans & Tostones'
    },
    desc: {
      es: 'Clásico cubano: carne de res desmenuzada en una sabrosa salsa con pimientos y cebollas. Acompañado de arroz blanco, frijoles colorados y tostones (plátanos verdes fritos).',
      de: 'Das klassische kubanische Gericht "zerkleinertes Rindfleisch" in einer kräftigen Soße mit Paprika und Zwiebeln. Dazu weißer Reis, rote Bohnen und knusprige frittierte Kochbananen.',
      en: 'Classic Cuban "shredded beef stew" in a rich sauce with peppers and onions. Accompanied by white rice, red beans, and crispy fried plantains.'
    },
    price: 25.50
  },
  {
    id: 'yuca',
    name: {
      es: 'Opción Vegana: Yuca con Mojo, Cebolla y Tomate',
      de: 'Veggie: Yuca mit Mojo-Soße, Zwiebeln & Tomaten',
      en: 'Veggie: Yuca with Mojo Sauce, Onions & Tomatoes'
    },
    desc: {
      es: 'Yuca blanda bañada en nuestra marinada "mojo" de ajo y cítricos, acompañada de cebolla y tomate fresco.',
      de: 'Weiche Yuca-Wurzel, übergossen mit einer pikanten Knoblauch-Zitrus-Marinade ("Mojo"), verfeinert mit frischen Zwiebeln und Tomaten.',
      en: 'Soft yuca root smothered in a zesty garlic-citrus "mojo" marinade, topped with fresh onions and tomatoes.'
    },
    price: 17.50
  }
];

const cart = new Map();

function formatEUR(value) { return `€${value.toFixed(2)}`; }
function getCartTotalNumber() { return [...cart.values()].reduce((t, i) => t + i.price * i.qty, 0); }

function renderMenu() {
  const list = document.getElementById('menu');
  const tpl = document.getElementById('dish-template');
  list.innerHTML = "";

  const lang = document.getElementById('lang')?.value || 'es';

  dishes.forEach(d => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.dish-name').textContent = d.name[lang];
    node.querySelector('.dish-desc').textContent = d.desc[lang];
    node.querySelector('.price').textContent = formatEUR(d.price);
    node.querySelector('.add-btn').addEventListener('click', () => addToCart(d));
    list.appendChild(node);
  });
}

// … (el resto de tu código de carrito, WhatsApp y traducción se mantiene igual)
