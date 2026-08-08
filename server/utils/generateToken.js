import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = async (res, userId) => {
  // Generate Access Token (Short-lived: 15 minutes)
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET || 'fallback_access_secret', {
    expiresIn: '15m',
  });

  // Generate Refresh Token (Long-lived: 7 days)
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', {
    expiresIn: '7d',
  });

  const isProduction = process.env.NODE_ENV === 'production';

  // Set Access Token as HTTP-Only Cookie (expiring in 30 days)
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days in ms
  });

  // Set Refresh Token as HTTP-Only Cookie (expiring in 30 days)
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days in ms
  });

  try {
    // Add token session entry to database User document
    await User.findByIdAndUpdate(userId, {
      $push: {
        tokens: {
          accessToken,
          refreshToken,
          tokenCreatedAt: new Date(),
          cookieName: 'access_token, refresh_token',
          cookieCreatedAt: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Session persistence failed:', error.message);
  }

  return { accessToken, refreshToken };
};

export default generateToken;
