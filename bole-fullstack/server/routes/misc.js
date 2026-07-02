const express = require('express');
const { db, nextId } = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

const messagesRouter = express.Router();
const inventoryRouter = express.Router();
const batchesRouter = express.Router();
const dashboardRouter = express.Router();
const usersRouter = express.Router();
const settingsRouter = express.Router();

// ─── MESSAGES ───
messagesRouter.post('/', async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone || !message) return res.status(400).json({ error: 'Name, phone and message required' });
    const id = await nextId('messages');
    await db.messages.insert({
      id, name: name.trim(), phone: phone.trim(),
      email: (req.body.email || '').trim(),
      subject: req.body.subject || 'General Inquiry',
      message: message.trim(),
      read: false, replied: false,
      created_at: new Date().toISOString()
    });
    res.status(201).json({ success: true, message: 'Message sent! We will get back to you shortly.' });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

messagesRouter.get('/', auth, async (req, res) => {
  try {
    const query = {};
    if (req.query.read === 'false') query.read = false;
    if (req.query.read === 'true') query.read = true;
    const msgs = await db.messages.find(query).sort({ created_at: -1 });
    const unread = await db.messages.count({ read: false });
    res.json({ messages: msgs, unread });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

messagesRouter.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.messages.update({ id }, { $set: req.body });
    res.json(await db.messages.findOne({ id }));
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

messagesRouter.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await db.messages.remove({ id: parseInt(req.params.id) });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ─── INVENTORY ───
inventoryRouter.get('/', auth, async (req, res) => {
  try {
    const products = await db.products.find({}).sort({ id: 1 });
    const logs = await db.inventory.find({}).sort({ created_at: -1 }).limit(20);
    res.json({ products, logs });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

inventoryRouter.post('/adjust', auth, async (req, res) => {
  try {
    const { product_id, change_qty, reason, notes } = req.body;
    if (!product_id || change_qty === undefined) return res.status(400).json({ error: 'Product and quantity required' });
    const product = await db.products.findOne({ id: parseInt(product_id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const new_qty = Math.max(0, product.stock_qty + parseInt(change_qty));
    const now = new Date().toISOString();
    await db.products.update({ id: parseInt(product_id) }, { $set: { stock_qty: new_qty, updated_at: now } });
    const id = await nextId('inventory');
    await db.inventory.insert({
      id, product_id: parseInt(product_id), product_name: product.name,
      change_qty: parseInt(change_qty), new_qty, previous_qty: product.stock_qty,
      reason: reason || 'Manual adjustment', notes: notes || '',
      created_by: req.user.username, created_at: now
    });
    res.json({ success: true, new_stock: new_qty });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

inventoryRouter.get('/log', auth, async (req, res) => {
  try {
    const logs = await db.inventory.find({}).sort({ created_at: -1 }).limit(100);
    res.json(logs);
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ─── BATCHES ───
batchesRouter.get('/', auth, async (req, res) => {
  try {
    const batches = await db.batches.find({}).sort({ created_at: -1 });
    const products = await db.products.find({});
    const pmap = {};
    products.forEach(p => pmap[p.id] = p);
    res.json(batches.map(b => ({ ...b, product_name: pmap[b.product_id]?.name || '', emoji: pmap[b.product_id]?.emoji || '🌾' })));
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

batchesRouter.post('/', auth, async (req, res) => {
  try {
    const { product_id, batch_no, mfg_date, exp_date, qty_produced } = req.body;
    if (!product_id || !batch_no || !mfg_date || !exp_date || !qty_produced)
      return res.status(400).json({ error: 'All batch fields required' });
    const existing = await db.batches.findOne({ batch_no });
    if (existing) return res.status(400).json({ error: 'Batch number already exists' });
    const product = await db.products.findOne({ id: parseInt(product_id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const id = await nextId('batches');
    const now = new Date().toISOString();
    await db.batches.insert({ id, product_id: parseInt(product_id), batch_no, mfg_date, exp_date, qty_produced: parseInt(qty_produced), qty_remaining: parseInt(qty_produced), notes: req.body.notes || '', created_by: req.user.username, created_at: now });
    const new_qty = product.stock_qty + parseInt(qty_produced);
    await db.products.update({ id: parseInt(product_id) }, { $set: { stock_qty: new_qty, updated_at: now } });
    const iid = await nextId('inventory');
    await db.inventory.insert({ id: iid, product_id: parseInt(product_id), product_name: product.name, change_qty: parseInt(qty_produced), new_qty, previous_qty: product.stock_qty, reason: `New batch: ${batch_no}`, created_by: req.user.username, created_at: now });
    res.status(201).json({ success: true, message: 'Batch recorded and stock updated' });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ─── DASHBOARD ───
dashboardRouter.get('/', auth, async (req, res) => {
  try {
    const [allOrders, allProducts, unreadCount] = await Promise.all([
      db.orders.find({}),
      db.products.find({ active: true }),
      db.messages.count({ read: false })
    ]);
    const paid_orders = allOrders.filter(o => o.payment_status === 'paid');
    const total_revenue = paid_orders.reduce((s, o) => s + o.total_price, 0);
    const pending_revenue = allOrders.filter(o => o.payment_status !== 'paid' && o.status !== 'cancelled').reduce((s, o) => s + o.total_price, 0);

    // Sales by product
    const pmap = {};
    allOrders.filter(o => o.status !== 'cancelled').forEach(o => {
      if (!pmap[o.product_name]) pmap[o.product_name] = { product_name: o.product_name, total_qty: 0, total_revenue: 0, order_count: 0 };
      pmap[o.product_name].total_qty += o.quantity;
      pmap[o.product_name].total_revenue += o.total_price;
      pmap[o.product_name].order_count++;
    });

    // Monthly sales (last 6 months)
    const mmap = {};
    allOrders.filter(o => o.status !== 'cancelled').forEach(o => {
      const m = o.created_at.slice(0, 7);
      if (!mmap[m]) mmap[m] = { month: m, order_count: 0, bags: 0, revenue: 0 };
      mmap[m].order_count++;
      mmap[m].bags += o.quantity;
      mmap[m].revenue += o.total_price;
    });

    res.json({
      total_orders: allOrders.length,
      pending_orders: allOrders.filter(o => o.status === 'pending').length,
      confirmed_orders: allOrders.filter(o => ['confirmed', 'processing'].includes(o.status)).length,
      delivered_orders: allOrders.filter(o => o.status === 'delivered').length,
      cancelled_orders: allOrders.filter(o => o.status === 'cancelled').length,
      total_revenue, pending_revenue,
      unread_messages: unreadCount,
      total_products: allProducts.length,
      low_stock: allProducts.filter(p => p.stock_qty <= p.min_stock_alert).length,
      total_bags_sold: allOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.quantity, 0),
      recent_orders: [...allOrders].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 8),
      sales_by_product: Object.values(pmap).sort((a, b) => b.total_qty - a.total_qty),
      monthly_sales: Object.values(mmap).sort((a, b) => a.month.localeCompare(b.month)).slice(-6),
    });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// ─── USERS ───
usersRouter.get('/', auth, adminOnly, async (req, res) => {
  try {
    const users = await db.users.find({});
    res.json(users.map(({ password, ...u }) => u));
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

usersRouter.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, username, password, role, phone, email } = req.body;
    if (!name || !username || !password) return res.status(400).json({ error: 'Name, username and password required' });
    if (await db.users.findOne({ username: username.toLowerCase() })) return res.status(400).json({ error: 'Username already taken' });
    const bcrypt = require('bcryptjs');
    const id = await nextId('users');
    await db.users.insert({ id, name, username: username.toLowerCase(), password: bcrypt.hashSync(password, 10), role: role || 'staff', phone: phone || '', email: email || '', created_at: new Date().toISOString() });
    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

usersRouter.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) return res.status(400).json({ error: 'Cannot delete your own account' });
    await db.users.remove({ id: parseInt(req.params.id) });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ─── SETTINGS ───
settingsRouter.get('/', auth, async (req, res) => {
  try {
    const rows = await db.settings.find({});
    const settings = {};
    rows.forEach(r => settings[r.key] = r.value);
    res.json(settings);
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

settingsRouter.put('/', auth, adminOnly, async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      const exists = await db.settings.findOne({ key });
      if (exists) await db.settings.update({ key }, { $set: { value: String(value) } });
      else await db.settings.insert({ key, value: String(value) });
    }
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = { messagesRouter, inventoryRouter, batchesRouter, dashboardRouter, usersRouter, settingsRouter };
