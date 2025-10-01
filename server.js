const express = require('express');
const Database = require('better-sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = new Database('orders.db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

db.prepare(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT,
  customer_first TEXT,
  customer_last TEXT,
  items TEXT,
  total REAL,
  status TEXT
)`).run();

app.post('/api/orders', (req, res) => {
  const { customer, items, total } = req.body;
  if(!customer || !items) return res.status(400).json({error:'Invalid payload'});
  const stmt = db.prepare('INSERT INTO orders (created_at, customer_first, customer_last, items, total, status) VALUES (?,?,?,?,?,?)');
  const info = stmt.run(new Date().toISOString(), customer.firstName, customer.lastName, JSON.stringify(items), total, 'received');
  const id = info.lastInsertRowid;
  res.json({ success:true, id });
});

app.get('/api/orders/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if(!row) return res.status(404).json({error:'Not found'});
  res.json(row);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('API listening on', PORT));