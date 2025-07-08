const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');
const axios = require('axios');
const router = express.Router();

router.post('/donate', async (req, res) => {
  const { amount, email, name, currency, recurring } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{
        price_data: {
          currency: currency || 'usd',
          product_data: {
            name: 'Donation to Sustainable Schools Network',
            description: `Donation by ${name}`,
          },
          unit_amount: amount * 100, // Amount in cents
          recurring: recurring ? { interval: 'month' } : undefined,
        },
        quantity: 1,
      }],
      mode: recurring ? 'subscription' : 'payment',
      success_url: process.env.FRONTEND_SUCCESS_URL,
      cancel_url: process.env.FRONTEND_CANCEL_URL,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Stripe donation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/webhook', (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('✅ Stripe donation completed:', session);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Webhook Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router;
