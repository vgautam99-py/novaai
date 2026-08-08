import User from '../models/User.js';

export const checkCredits = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const limits = {
      free: 10,
      pro: 100,
      vip: 300
    };

    const plan = user.plan || 'free';
    const limit = limits[plan] || 10;
    const creditsUsed = user.aiCreditsUsed || 0;

    if (creditsUsed >= limit) {
      return res.status(402).json({ 
        success: false,
        message: `You have reached the AI credits limit of ${limit} for your ${plan.toUpperCase()} plan. Please upgrade your plan under the Pricing section to continue.`,
        limitReached: true,
        aiCreditsUsed: creditsUsed,
        aiCreditsLimit: limit
      });
    }

    // Attach user model instance to the request so we can save it later
    req.userModel = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default checkCredits;
