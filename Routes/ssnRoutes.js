// Routes/ssnRoutes.js
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
  const { name, email, message, subject } = req.body;

  try {

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: subject,
      text: message + `\n\nFrom: ${name} <${email}>`,
    });

    res.send({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact Error:', error);
    res.status(500).send({ error: 'Failed to send email' });
  }
});



// Newsletter Subscription
router.post('/newsletter', async (req, res) => {
  const { email } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
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
  const { name, email, phone, reason, residence, areaOfInterests, availability } = req.body;

  try {
    console.log('Received volunteer application:', req.body);

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'SSN Volunteer Application',
      text: `Dear Hiring Manager, \n I am apply for voluntary service. Below are my details.\n
      Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nReason for Volunteering: ${reason}\nResidence: ${residence}\nArea of Interests: ${areaOfInterests}\nAvailability: ${availability}`,
    });

    res.send({ message: 'Application sent!' });
  } catch (error) {
    console.error('Volunteer Error:', error);
    res.status(500).send({ error: 'Failed to apply' });
  }
});

module.exports = router;
