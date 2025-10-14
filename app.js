// I18N
const I18N = {
  en:{languageLabel:'Language',addToCart:'Add to cart',cartTitle:'Your order',customerInfoTitle:'Customer info',firstName:'First name',lastName:'Last name',consentText:'I consent to use my data to process this order.',exportCsv:'Export CSV',copyClipboard:'Copy to clipboard',remove:'Remove',qtyTimes:'×',takeAwayTag:'Takeaway',noOnionTag:'No onion',shareWhatsApp:'Share via WhatsApp',printTicket:'Print ticket'},
  de:{languageLabel:'Sprache',addToCart:'In den Warenkorb',cartTitle:'Ihre Bestellung',customerInfoTitle:'Kundendaten',firstName:'Vorname',lastName:'Nachname',consentText:'Ich stimme zu, dass meine Daten zur Bearbeitung dieser Bestellung verwendet werden.',exportCsv:'CSV herunterladen',copyClipboard:'In die Zwischenablage',remove:'Entfernen',qtyTimes:'×',takeAwayTag:'Zum Mitnehmen',noOnionTag:'Ohne Zwiebel',shareWhatsApp:'Per WhatsApp teilen',printTicket:'Ticket drucken'},
  es:{languageLabel:'Idioma',addToCart:'Añadir al carrito',cartTitle:'Tu pedido',customerInfoTitle:'Datos del cliente',firstName:'Nombre',lastName:'Apellidos',consentText:'Acepto que mis datos se usen para procesar este pedido.',exportCsv:'Exportar CSV',copyClipboard:'Copiar al portapapeles',remove:'Eliminar',qtyTimes:'×',takeAwayTag:'Para llevar',noOnionTag:'Sin cebolla',shareWhatsApp:'Compartir en WhatsApp',printTicket:'Imprimir ticket'}
};

// Menu data (trilingual)
const MENU = [
  {id:'en1',lang:'en',name:'Chicken in Creole Sauce with Yellow Rice, Fresh Tomatoes 🍅 and Onions 🧅',desc:'Tender chicken simmered in a traditional Cuban tomato-based sauce. Served with aromatic yellow rice.',price:22.50},
  {id:'en2',lang:'en',name:'Fried Pork Steak with Congri Rice, Caramelized Onions, Tomato & Fried Root Vegetables',desc:'Crispy fried pork served with savory rice and black beans, sweet caramelized onions, and a side of fried yuca and sweet plantain.',price:25.50},
  {id:'en3',lang:'en',name:'Ropa Vieja with White Rice, Red Beans & Tostones',desc:"Classic Cuban 'shredded beef stew' in a rich sauce with peppers and onions. Accompanied by white rice, red beans, and crispy fried plantains.",price:25.50},
  {id:'en4',lang:'en',name:'Veggie: Yuca with Mojo Sauce, Onions & Tomatoes',desc:"Soft yuca root smothered in a zesty garlic-citrus 'mojo' marinade, topped with fresh onions and tomatoes.",price:17.50},
  {id:'de1',lang:'de',name:'Huhn in Kreolischer Soße mit Gelbem Reis, Tomaten 🍅 und Zwiebeln 🧅',desc:'Zartes Hähnchen in einer traditionellen kubanischen Tomatensoße geschmort. Serviert mit aromatischem gelbem Reis.',price:22.50},
  {id:'de2',lang:'de',name:'Gebratenes Schweinesteak mit Congri Reis, karamellisierten Zwiebeln, Tomate & frittierten Wurzelgemüsen',desc:'Knusprig gebratenes Schweinefleisch mit würzigem Reis mit schwarzen Bohnen, süßen karamellisierten Zwiebeln und einer Beilage aus frittierter Yuca und Kochbananen.',price:25.50},
  {id:'de3',lang:'de',name:'Ropa Vieja mit Weißem Reis, Kidneybohnen & Tostones',desc:"Das klassische kubanische Gericht 'zerkleinertes Rindfleisch' in einer kräftigen Soße mit Paprika und Zwiebeln. Dazu weißer Reis, rote Bohnen und knusprige frittierte Kochbananen.",price:25.50},
  {id:'de4',lang:'de',name:'Veggie: Yuca mit Mojo-Soße, Zwiebeln & Tomaten',desc:"Weiche Yuca-Wurzel, übergossen mit einer pikanten Knoblauch-Zitrus-Marinade ('Mojo'), verfeinert mit frischen Zwiebeln und Tomaten.",price:17.50},
  {id:'es1',lang:'es',name:'Pollo en Salsa Criolla con Arroz Amarillo, Tomate 🍅 y Cebolla 🧅',desc:'Tierno pollo cocinado en una salsa criolla cubana a base de tomate. Servido con arroz amarillo aromático.',price:22.50},
  {id:'es2',lang:'es',name:'Bistec de Cerdo Frito con Congrí, Cebolla Caramelizada, Tomate y Viandas Fritas',desc:'Jugoso bistec de cerdo frito, acompañado de nuestro sabroso congrí (arroz con frijoles negros), dulce cebolla caramelizada y viandas fritas (yuca y plátano).',price:25.50},
  {id:'es3',lang:'es',name:'Ropa Vieja con Arroz Blanco, Frijoles Colorados y Tostones',desc:'Clásico cubano: carne de res desmenuzada en una sabrosa salsa con pimientos y cebollas. Acompañado de arroz blanco, frijoles colorados y tostones (plátanos verdes fritos).',price:25.50},
  {id:'es4',lang:'es',name:'Opción Vegana: Yuca con Mojo, Cebolla y Tomate',desc:"Yuca blanda bañada en nuestra marinada 'mojo' de ajo y cítricos, acompañada de cebolla y tomate fresco.",price:17.50}
];

const state = { lang:'es', cart:{} };

const menuEl = document.getElementById('menu');
const template = document.getElementById('dish-template');
const langSelect = document.getElementById('lang');
const cartItemsEl = document.getElementById('cart-items');
const totalEl = document.getElementById('total');
const exportBtn = document.getElementById('exportCsv');
const copyBtn = document.getElementById('copyClipboard');
const shareBtn = document.getElementById('shareWhatsApp');
const printBtn = document.getElementById('printTicket');
const firstNameEl = document.getElementById('firstName');
const lastNameEl = document.getElementById('lastName');
const consentEl = document.getElementById('consentCheckbox');

langSelect.value = state.lang;
langSelect.addEventListener('change', e=>{
  state.lang = e.target.value;
  applyTranslations(state.lang);
  renderMenu();
  renderCart();
});

function formatPrice(p){ return new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(p); }

function applyTranslations(lang){
  const dict = I18N[lang] || I18N.es;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(dict[key]) el.textContent = dict[key];
  });
  if(shareBtn) shareBtn.textContent = dict.shareWhatsApp;
  if(printBtn) printBtn.textContent = dict.printTicket;
}

function renderMenu(){
  menuEl.innerHTML = '';
  const list = MENU.filter(d=>d.lang === state.lang);
  list.forEach(d=>{
    const node = template.content.cloneNode(true);
    node.querySelector('.dish-name').textContent = d.name;
    node.querySelector('.dish-desc').textContent = d.desc;
    node.querySelector('.price').textContent = formatPrice(d.price);
    const addBtn = node.querySelector('.add-btn');
    addBtn.textContent = I18N[state.lang].addToCart;
    addBtn.addEventListener('click', ()=> addToCart(d.id));
    menuEl.appendChild(node);
  });
}

function addToCart(id){
  const item = MENU.find(m=>m.id===id);
  if(!item) return;
  if(!state.cart[id]) state.cart[id] = { ...item, qty:0, tags:[] };
  state.cart[id].qty += 1;
  renderCart();
}

function removeFromCart(id){ delete state.cart[id]; renderCart(); }

function changeQty(id, delta){
  if(!state.cart[id]) return;
  state.cart[id].qty += delta;
  if(state.cart[id].qty <= 0) removeFromCart(id);
  renderCart();
}

function toggleTag(id, tag){
  const it = state.cart[id];
  if(!it) return;
  const idx = it.tags.indexOf(tag);
  if(idx === -1) it.tags.push(tag); else it.tags.splice(idx,1);
  renderCart();
}

function renderCart(){
  cartItemsEl.innerHTML = '';
  let total=0;
  Object.values(state.cart).forEach(it=>{
    total += it.price * it.qty;
    const row = document.createElement('div');
    row.className='cart-row';
    const takeAway = I18N[state.lang].takeAwayTag;
    const noOnion = I18N[state.lang].noOnionTag;
    row.innerHTML = `
      <div style="flex:1">
        <div style="font-weight:600">${it.name}</div>
        <div style="color:#666;font-size:0.92rem">${it.qty} ${I18N[state.lang].qtyTimes} ${formatPrice(it.price)}</div>
        <div class="tags">
          <span class="tag" data-id="${it.id}" data-tag="${takeAway}">${takeAway}</span>
          <span class="tag" data-id="${it.id}" data-tag="${noOnion}">${noOnion}</span>
        </div>
      </div>
      <div style="text-align:right">
        <div class="qty-controls">
          <button class="small-btn" data-action="dec" data-id="${it.id}">−</button>
          <div style="min-width:28px;text-align:center">${it.qty}</div>
          <button class="small-btn" data-action="inc" data-id="${it.id}">+</button>
        </div>
        <div style="margin-top:8px"><button class="small-btn remove" data-id="${it.id}">${I18N[state.lang].remove}</button></div>
      </div>`;
    cartItemsEl.appendChild(row);
  });

  cartItemsEl.querySelectorAll('.tag').forEach(t=>{
    t.addEventListener('click', e=>{
      const id = e.target.dataset.id;
      const tag = e.target.dataset.tag;
      toggleTag(id, tag);
    });
  });
  cartItemsEl.querySelectorAll('[data-action]').forEach(b=>{
    b.addEventListener('click', e=>{
      const id = e.target.dataset.id;
      if(e.target.dataset.action === 'inc') changeQty(id,1); else changeQty(id,-1);
    });
  });
  cartItemsEl.querySelectorAll('.remove').forEach(b=>{
    b.addEventListener('click', e=>{
      removeFromCart(e.target.dataset.id);
    });
  });

  totalEl.textContent = formatPrice(total);
}

function validateCustomerInfo(){
  const first = firstNameEl.value.trim();
  const last = lastNameEl.value.trim();
  if(!first || !last) { alert(I18N[state.lang].firstName + ' y ' + I18N[state.lang].lastName + ' son obligatorios.'); return false; }
  if(!consentEl.checked) { alert('Debe aceptar el uso de sus datos para procesar el pedido.'); return false; }
  return true;
}

function cartToCSV(){
  const header = ['Language','Dish Name','Quantity','Tags','Unit Price','Line Total','FirstName','LastName','ConsentGiven','ConsentTimestamp'];
  const rows = [header];
  const consentGiven = consentEl.checked ? 'yes' : 'no';
  const consentTs = new Date().toISOString();
  Object.values(state.cart).forEach(it=>{
    const line = [
      it.lang,
      it.name.replace(/"/g,'""'),
      it.qty,
      it.tags.join(';'),
      it.price.toFixed(2),
      (it.price*it.qty).toFixed(2),
      firstNameEl.value.trim(),
      lastNameEl.value.trim(),
      consentGiven,
      consentTs
    ];
    rows.push(line);
  });
  return rows.map(r => r.map(c=>`"${c}"`).join(',')).join('\n');
}

exportBtn.addEventListener('click', ()=>{
  if(!validateCustomerInfo()) return;
  const csv = cartToCSV();
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'pedido.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

copyBtn.addEventListener('click', async ()=>{
  if(!validateCustomerInfo()) return;
  const csv = cartToCSV();
  try{ await navigator.clipboard.writeText(csv); alert('Pedido copiado al portapapeles.'); }catch(e){ prompt('Copia manualmente el pedido (Ctrl+C):', csv); }
});

function buildTicketText(){
  const items = Object.values(state.cart);
  let lines = [];
  lines.push(`Pedido - ${new Date().toLocaleString()}`);
  lines.push(`Cliente: ${firstNameEl.value.trim()} ${lastNameEl.value.trim()}`);
  lines.push('------------------------');
  let total = 0;
  items.forEach(it=>{
    lines.push(`${it.qty}x ${it.name} - €${(it.price*it.qty).toFixed(2)}`);
    if(it.tags && it.tags.length) lines.push(`  Nota: ${it.tags.join('; ')}`);
    total += it.qty * it.price;
  });
  lines.push('------------------------');
  lines.push(`Total: €${total.toFixed(2)}`);
  return lines.join('\n');
}

function shareViaWhatsApp(){
  if(!validateCustomerInfo()) return;
  const text = buildTicketText();
  const encoded = encodeURIComponent(text);
  const waUrl = `https://wa.me/?text=${encoded}`;
  window.open(waUrl, '_blank');
}

function printTicket(){
  if(!validateCustomerInfo()) return;
  const text = buildTicketText();
  const w = window.open('','_blank','width=400,height=600');
  w.document.write(`<pre style="font-family:monospace;white-space:pre-wrap">${text}</pre>`);
  w.document.close(); w.focus(); w.print();
}

shareBtn.addEventListener('click', shareViaWhatsApp);
printBtn.addEventListener('click', printTicket);

// init
applyTranslations(state.lang);
renderMenu();

renderCart();
async function sendOrderToBackend(){
  const customer = { firstName: firstNameEl.value.trim(), lastName: lastNameEl.value.trim() };
  const items = Object.values(state.cart);
  const total = items.reduce((s,it)=> s + it.qty * it.price, 0);

  const payload = { customer, items, total };

  const res = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if(data.ok){
    alert("Pedido enviado y notificación enviada por email");
  } else {
    alert("Hubo un problema al enviar el pedido");
  }
}
