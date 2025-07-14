const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import route modules
const ssnRoutes = require('./Routes/ssnRoutes');
const mpesaRoutes = require('./Routes/mpseapg');
const flutterwaveRoutes = require('./Routes/flutterwavepg');
const stripeRoutes = require('./Routes/stripepg');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

// ---------- ROUTES ----------
app.use('/api', ssnRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/flutterwave', flutterwaveRoutes);
app.use('/api/stripe', stripeRoutes);

// ---------- 404 HANDLER ----------
app.use((req, res, next) => {
  res.status(404).json({ message: '🔍 Route not found' });
});

// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error('❌ Internal Server Error:', err);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// ---------- START SERVER ----------
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
