const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id_here',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret_here',
});

// Create Razorpay order
router.post('/create-razorpay-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    // Validate amount
    if (!amount || amount < 100) { // Minimum 1 rupee
      return res.status(400).json({ 
        error: 'Invalid amount. Minimum amount is ₹1' 
      });
    }

    const options = {
      amount: Math.round(amount), // Amount in paise
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      receipt: order.receipt,
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      message: error.message 
    });
  }
});

// Verify payment signature
router.post('/verify-payment', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    // Create signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_key_secret_here')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      res.json({
        success: true,
        message: 'Payment verified successfully',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      error: 'Payment verification failed',
      message: error.message 
    });
  }
});

// Get payment details
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.json({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      created_at: payment.created_at,
    });

  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch payment details',
      message: error.message 
    });
  }
});

// Webhook to handle Razorpay events
router.post('/webhook', (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    // Webhook verified
    const event = req.body.event;
    
    switch (event) {
      case 'payment.captured':
        console.log('Payment captured:', req.body.payload.payment.entity.id);
        // Update order status in database
        break;
      case 'payment.failed':
        console.log('Payment failed:', req.body.payload.payment.entity.id);
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event: ${event}`);
    }

    res.json({ status: 'ok' });
  } else {
    res.status(400).json({ error: 'Invalid signature' });
  }
});

module.exports = router;