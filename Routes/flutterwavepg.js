const express = require('express');
const axios = require('axios');
const moment = require('moment');
require('dotenv').config();

const router = express.Router();

router.post('/pay', async (req, res) => {
  const { email, amount, name } = req.body;

  try {
    const tx_ref = `TX-${Date.now()}`;

    const redirectUrl = 'http://localhost:3001/donation-success'; 

    const payload = {
      tx_ref,
      amount,
      currency: 'KES', 
      payment_options: 'card,mpesa', 
      redirect_url: redirectUrl,
      customer: {
        email,
        name,
      },
      customizations: {
        title: 'Sustainable Schools Network',
        description: 'SSN Global Donation',
      },
    };

    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data);

    res.status(200).json({ paymentLink: response.data.data.link });
  } catch (error) {
    console.error(' Flutterwave Global Payment Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Flutterwave global payment failed',
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
