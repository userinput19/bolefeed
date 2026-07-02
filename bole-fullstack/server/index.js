require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ───
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API ROUTES ───
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/orders',    require('./routes/orders'));

const { messagesRouter, inventoryRouter, batchesRouter, dashboardRouter, usersRouter, settingsRouter } = require('./routes/misc');
app.use('/api/messages',  messagesRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/batches',   batchesRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/users',     usersRouter);
app.use('/api/settings',  settingsRouter);

// ─── HEALTH CHECK ───
app.get('/api/health', (req, res) => res.json({ status: 'OK', app: 'Bole Animal Feed API', timestamp: new Date() }));

// ─── SERVE REACT FRONTEND ───
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ─── START ───
async function start() {
  await initDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🌾  Bole Animal Feed Processing Server`);
    console.log(`🚀  Running at: http://0.0.0.0:${PORT}`);
    console.log(`📦  API:        http://0.0.0.0:${PORT}/api`);
    console.log(`\n   Admin credentials:`);
    console.log(`   Username: admin | Password: bole2024`);
    console.log(`   Username: staff | Password: staff123\n`);
  });
}

start().catch(console.error);
