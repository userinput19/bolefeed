const router = require('express').Router();
const { db, nextId } = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

// Public
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const query = { active: true };
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    const products = await db.products.find(query).sort({ id: 1 });
    res.json(products);
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await db.products.findOne({ id: parseInt(req.params.id), active: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Admin CRUD
router.get('/admin/all', auth, async (req, res) => {
  try {
    const products = await db.products.find({}).sort({ id: 1 });
    res.json(products);
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, category, price_etb } = req.body;
    if (!name || !category || !price_etb) return res.status(400).json({ error: 'Name, category and price required' });
    const id = await nextId('products');
    const now = new Date().toISOString();
    const product = { id, ...req.body, active: true, stock_qty: req.body.stock_qty || 0, created_at: now, updated_at: now };
    await db.products.insert(product);
    res.status(201).json(product);
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.products.update({ id }, { $set: { ...req.body, updated_at: new Date().toISOString() } });
    res.json(await db.products.findOne({ id }));
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await db.products.update({ id: parseInt(req.params.id) }, { $set: { active: false, updated_at: new Date().toISOString() } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
