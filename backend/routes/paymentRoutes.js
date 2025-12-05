import express from 'express';
import razorpayInstance from '../controllers/razorpay.js';

const router = express.Router();

// paymentRoutes.js
router.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;

  console.log('BACKEND KEYS:', process.env.RAZORPAY_KEY_ID?.substring(0,10) + '...');
  
  const options = {
    amount: Math.round(amount) * 100,   // stay in paise
    currency: currency || 'INR',
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1
  };

  console.log('Creating Razorpay order with options:', options);
  
  const order = await razorpayInstance.orders.create(options);
  console.log('Razorpay order created successfully:', order.id);
  
  res.status(200).json(order);
});


export default router;
