require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MI_EMAIL,
    pass: process.env.MI_PASSWORD
  }
});

// Endpoint para recibir pedidos
app.post('/api/orders', (req, res) => {
  const order = req.body;

  const text = `
Nuevo pedido recibido:
Cliente: ${order.customer.firstName} ${order.customer.lastName}
Total: €${order.total}

Detalles:
${order.items.map(it => `${it.qty}x ${it.name} - €${(it.price*it.qty).toFixed(2)}`).join('\n')}
  `;

  transporter.sendMail({
    from: process.env.FROM_ALIAS || process.env.MI_EMAIL,
    to: process.env.RECEPTOR_EMAIL,
    subject: 'Nuevo pedido recibido',
    text
  }, (err, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al enviar email' });
    }
    res.json({ ok: true, messageId: info.messageId });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));