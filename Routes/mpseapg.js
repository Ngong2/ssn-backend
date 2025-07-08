
// Routes/mpseapg.js
const express = require('express');
const axios = require('axios');
const moment = require('moment');
require('dotenv').config();

const router = express.Router();

// Function to get M-PESA access token
const getMpesaToken = async () => {
  try {
    const { CONSUMER_KEY, CONSUMER_SECRET } = process.env;
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const res = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    return res.data.access_token;
  } catch (error) {
    console.error(' Access Token Error:', error.response?.data || error.message);
    throw new Error('Failed to get M-PESA access token');
  }
};

// Route for initiating an M-PESA payment (STK Push)
router.post('/payment', async (req, res) => {
  const { phone, amount } = req.body;

  try {
    const accessToken = await getMpesaToken();
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(
      process.env.BUSINESS_SHORTCODE + process.env.PASSKEY + timestamp
    ).toString('base64');

    const payload = {
      BusinessShortCode: process.env.BUSINESS_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: process.env.BUSINESS_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: 'SSN Account',
      TransactionDesc: 'Payment for Donation'
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    console.log(' STK Push Response:', response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'STK Push Failed', details: error.response?.data || error.message });
  }
});

// Route for handling the M-PESA callback
router.post('/callback', (req, res) => {
  console.log(' M-Pesa Callback Received:');
  console.log(JSON.stringify(req.body, null, 2));

  const callbackData = req.body?.Body?.stkCallback;
  if (callbackData) {
    console.log(' Payment Info:', {
      MerchantRequestID: callbackData.MerchantRequestID,
      CheckoutRequestID: callbackData.CheckoutRequestID,
      ResultCode: callbackData.ResultCode,
      ResultDesc: callbackData.ResultDesc,
    });
  } else {
    console.warn(' Callback missing expected format');
  }
  res.sendStatus(200);
});

module.exports = router;
