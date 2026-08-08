import express from 'express';
import {
  sendOTP,
  verifyOTP,
  firebaseGoogleAuth,
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  refreshAccessToken,
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth endpoints
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/firebase-google', firebaseGoogleAuth);
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);

// Private profile endpoints
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;
