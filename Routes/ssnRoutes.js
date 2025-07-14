const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Contact Form
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `Contact from ${name}`,
      text: message,
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'SSN - We Received Your Message',
      text: `Hi ${name}, thank you for contacting us. We’ll reply soon.`,
    });

    res.send({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact Error:', error);
    res.status(500).send({ error: 'Failed to send email' });
  }
});

// Admin Reply
router.post('/reply', async (req, res) => {
  const { to, subject, replyMessage } = req.body;

  if (!to || !subject || !replyMessage) {
    return res.status(400).send({ error: 'All fields are required.' });
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text: replyMessage,
    });

    console.log('Reply Email sent:', info.messageId);
    res.send({ message: 'Reply sent successfully!' });
  } catch (error) {
    console.error('Reply Error:', error.message);
    res.status(500).send({ error: `Failed to reply: ${error.message}` });
  }
});

// Newsletter Subscription
router.post('/newsletter', async (req, res) => {
  const { email } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Subscribed to SSN Newsletter',
      text: `Thanks for subscribing!`,
    });
    res.send({ message: 'Subscribed!' });
  } catch (error) {
    console.error('Newsletter Error:', error);
    res.status(500).send({ error: 'Subscription failed' });
  }
});

// Volunteer Application
router.post('/volunteer', async (req, res) => {
  const { name, email, reason } = req.body;

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `Volunteer Application from ${name}`,
      text: reason,
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'SSN Volunteer Application Received',
      text: `Hi ${name}, thanks for applying to volunteer. We will review your application soon.`,
    });

    res.send({ message: 'Application sent!' });
  } catch (error) {
    console.error('Volunteer Error:', error);
    res.status(500).send({ error: 'Failed to apply' });
  }
});

module.exports = router;
