// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// require('dotenv').config();

// // Import route modules
// const ssnRoutes = require('./Routes/ssnRoutes');
// const paymentGatewayRoutes = require('./Routes/paymentGateway'); // ✅ Includes M-Pesa, PayPal, Flutterwave, Stripe

// const app = express();

// // ---------- MIDDLEWARE ----------
// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.raw({ type: 'application/json' })); // Needed for Stripe webhooks

// // ---------- ROUTES ----------
// app.use('/api', ssnRoutes);                         // e.g. /api/contact, /api/subscribe
// app.use('/api/payment', paymentGatewayRoutes);      // ✅ Includes /mpesa, /paypal, /flutterwave, /stripe

// // ---------- 404 Handler ----------
// app.use((req, res, next) => {
//   res.status(404).json({ message: '🔍 Route not found' });
// });

// // ---------- Error Handler ----------
// app.use((err, req, res, next) => {
//   console.error('❌ Internal Server Error:', err);
//   res.status(500).json({ message: '🚨 Something went wrong', error: err.message });
// });

// // ---------- START SERVER ----------
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
