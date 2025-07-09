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


// ---------- MIDDLEWARE ----------
// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
// Use raw body parser for Stripe webhook endpoint below
app.use('/api/stripe/webhook', bodyParser.raw({ type: 'application/json' }));
// Other endpoints can use the standard JSON parser
app.use(bodyParser.json());

// ---------- ROUTES ----------
// General SSN routes
app.use('/api', ssnRoutes); // e.g., /api/contact, /api/subscribe

// Payment Gateway routes
app.use('/api/mpesa', mpesaRoutes);         // Endpoints: /api/mpesa/payment, /api/mpesa/callback
app.use('/api/flutterwave', flutterwaveRoutes); // Endpoint: /api/flutterwave/pay
app.use('/api/stripe', stripeRoutes);         // Endpoints: /api/stripe/donate, /api/stripe/webhook
// ---------- 404 Handler ----------
app.use((req, res, next) => {
  res.status(404).json({ message: '🔍 Route not found' });
});

// ---------- Error Handler ----------
app.use((err, req, res, next) => {
  console.error(' Internal Server Error:', err);
  res.status(500).json({ message: ' Something went wrong', error: err.message });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
