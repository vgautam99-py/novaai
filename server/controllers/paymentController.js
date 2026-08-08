import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';

// @desc    Create a new Razorpay Order for subscription upgrade
// @route   POST /api/payments/order
// @access  Private
export const createOrder = async (req, res) => {
  const planName = req.body.planName || req.body.plan;
  const { billingCycle } = req.body;

  if (!planName) {
    return res.status(400).json({ success: false, message: 'Plan name is required' });
  }

  // Calculate pricing in INR (amount in paise, e.g. 100 paise = 1 INR)
  let amountInPaise = 0;
  const isYearly = billingCycle === 'yearly';

  const planLower = planName.toLowerCase();
  if (planLower.includes('pro')) {
    amountInPaise = isYearly ? 799900 : 99900; // 7999 INR or 999 INR
  } else if (planLower.includes('vip') || planLower.includes('enterprise')) {
    amountInPaise = isYearly ? 1999900 : 249900; // 19999 INR or 2499 INR
  } else {
    return res.status(400).json({ success: false, message: 'Invalid subscription plan selected' });
  }

  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.warn("Razorpay credentials are not configured. Emulating mock order...");
      return res.status(200).json({
        mock: true,
        orderId: `mock_order_${Math.random().toString(36).substring(7)}`,
        amount: amountInPaise,
        currency: 'INR',
        keyId: 'MOCK_KEY_ID',
      });
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${req.user._id.toString().substring(16)}_${Date.now().toString().substring(7)}`,
    };

    const order = await instance.orders.create(options);
    
    if (!order) {
      return res.status(500).json({ success: false, message: 'Could not generate Razorpay order' });
    }

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Razorpay order creation failed' });
  }
};

// @desc    Verify Razorpay signature & upgrade user plan
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const planName = req.body.planName || req.body.plan;

  if (!planName) {
    return res.status(400).json({ success: false, message: 'Plan name is required' });
  }

  try {
    // If mock order, bypass cryptographic verification
    const isMock = razorpay_order_id && razorpay_order_id.startsWith('mock_');
    
    if (!isMock) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Payment verification parameters are missing' });
      }

      // Generate signature verify string
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'mock_secret')
        .update(body.toString())
        .digest('hex');

      const isAuthentic = expectedSignature === razorpay_signature;

      if (!isAuthentic) {
        return res.status(400).json({ success: false, message: 'Cryptographic signature mismatch. Payment verification failed.' });
      }
    }

    // Determine plan type
    let upgradedPlan = 'free';
    const planLower = planName.toLowerCase();
    if (planLower.includes('pro')) {
      upgradedPlan = 'pro';
    } else if (planLower.includes('vip') || planLower.includes('enterprise')) {
      upgradedPlan = 'vip';
    }

    // Upgrade the user in the database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.plan = upgradedPlan;
    // Reset credit usage when upgrading plans
    user.aiCreditsUsed = 0;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Successfully upgraded to ${upgradedPlan.toUpperCase()} plan!`,
      plan: upgradedPlan,
    });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    res.status(500).json({ success: false, message: error.message || 'Payment signature verification failed' });
  }
};
