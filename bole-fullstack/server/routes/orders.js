const router = require('express').Router();
const { db, nextId } = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

// Public: Place order
router.post('/', async (req, res) => {
  try {
    const { customer_name, customer_phone, product_id, quantity } = req.body;
    if (!customer_name || !customer_phone || !product_id || !quantity)
      return res.status(400).json({ error: 'Name, phone, product and quantity are required' });
    const product = await db.products.findOne({ id: parseInt(product_id), active: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock_qty < parseInt(quantity))
      return res.status(400).json({ error: `Only ${product.stock_qty} bags in stock` });
    const seq = await nextId('orders');
    const order_ref = 'BOLE-' + String(seq).padStart(4, '0');
    const now = new Date().toISOString();
    const order = {
      id: seq, order_ref,
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      customer_email: (req.body.customer_email || '').trim(),
      product_id: parseInt(product_id),
      product_name: product.name,
      quantity: parseInt(quantity),
      unit_price: product.price_etb,
      total_price: product.price_etb * parseInt(quantity),
      delivery_method: req.body.delivery_method || 'delivery',
      delivery_address: (req.body.delivery_address || '').trim(),
      notes: (req.body.notes || '').trim(),
      payment_method: req.body.payment_method || 'cash',
      status: 'pending',
      payment_status: 'unpaid',
      admin_notes: '',
      created_at: now, updated_at: now
    };
    await db.orders.insert(order);
    await db.products.update({ id: parseInt(product_id) }, {
      $set: { stock_qty: product.stock_qty - parseInt(quantity), updated_at: now }
    });
    res.status(201).json({
      order_ref, total_price: order.total_price,
      message: 'Order placed successfully! We will contact you within 2 hours to confirm.'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Public: Track order
router.get('/track/:ref', async (req, res) => {
  try {
    const order = await db.orders.findOne({ order_ref: req.params.ref.toUpperCase() });
    if (!order) return res.status(404).json({ error: 'Order not found. Please check the reference number.' });
    const { customer_email, admin_notes, ...safe } = order;
    res.json(safe);
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Get all orders
router.get('/', auth, async (req, res) => {
  try {
    const { status, payment_status, search } = req.query;
    let query = {};
    if (status) query.status = status;
    if (payment_status) query.payment_status = payment_status;
    let orders = await db.orders.find(query).sort({ created_at: -1 });
    if (search) {
      const s = search.toLowerCase();
      orders = orders.filter(o =>
        o.customer_name.toLowerCase().includes(s) ||
        o.order_ref.toLowerCase().includes(s) ||
        o.customer_phone.includes(s) ||
        o.product_name.toLowerCase().includes(s)
      );
    }
    const stats = {
      total: await db.orders.count({}),
      pending: await db.orders.count({ status: 'pending' }),
      confirmed: await db.orders.count({ status: 'confirmed' }),
      processing: await db.orders.count({ status: 'processing' }),
      delivered: await db.orders.count({ status: 'delivered' }),
      cancelled: await db.orders.count({ status: 'cancelled' }),
    };
    res.json({ orders, stats });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Update order
router.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.orders.update({ id }, { $set: { ...req.body, updated_at: new Date().toISOString() } });
    res.json(await db.orders.findOne({ id }));
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await db.orders.remove({ id: parseInt(req.params.id) });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
