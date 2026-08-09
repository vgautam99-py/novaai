import User from '../models/User.js';
import OTP from '../models/OTP.js';
import generateToken from '../utils/generateToken.js';
import { sendOTPEmail } from '../services/emailService.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// Verify Firebase Google ID Token signature using Google's public certificates
const verifyFirebaseGoogleToken = async (idToken) => {
  // If it's a mock token (used for offline development), bypass verification checks
  if (idToken && idToken.startsWith('mock_google_id_token_')) {
    return {
      email: 'testuser@novaai.com',
      name: 'Test Creator',
      avatar: '',
      firebaseUid: 'mock_uid_12345'
    };
  }

  try {
    // 1. Fetch public certificates from Google
    const certsResponse = await axios.get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
    const certs = certsResponse.data;

    // 2. Decode the token header to locate the kid (Key ID)
    const decodedHeader = jwt.decode(idToken, { complete: true });
    if (!decodedHeader || !decodedHeader.header.kid) {
      throw new Error('Invalid Firebase ID Token header');
    }

    const kid = decodedHeader.header.kid;
    const publicKey = certs[kid];

    if (!publicKey) {
      throw new Error('Firebase ID Token signed by unknown certificate');
    }

    // 3. Verify JWT signature using Google public key certificate
    const decodedToken = jwt.verify(idToken, publicKey, {
      algorithms: ['RS256'],
    });

    // 4. Extract verified user parameters
    return {
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email.split('@')[0],
      avatar: decodedToken.picture || '',
      firebaseUid: decodedToken.sub
    };
  } catch (error) {
    console.error('Firebase Token Verification Failed:', error.message);
    
    // Fallback: If verification fails or is offline, attempt direct Google API TokenInfo validation
    try {
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      const payload = response.data;
      return {
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        avatar: payload.picture || '',
        firebaseUid: payload.sub
      };
    } catch (fallbackErr) {
      throw new Error('Token verification failed on all channels: ' + fallbackErr.message);
    }
  }
};

// @desc    Send verification OTP code to user email
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res) => {
  const { email, mode } = req.body; // mode: 'login' or 'register'

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required' });
  }

  try {
    const userExists = await User.findOne({ email });

    // Validations based on auth intent
    if (mode === 'register' && userExists) {
      return res.status(400).json({ success: false, message: 'Email is already registered. Please login instead.' });
    }
    if (mode === 'login' && !userExists) {
      return res.status(404).json({ success: false, message: 'Email is not registered. Please sign up first.' });
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete existing OTPs for the email
    await OTP.deleteMany({ email });

    // Store in DB
    await OTP.create({ email, otp });

    // Send the email via Mailjet
    await sendOTPEmail(email, otp);

    res.status(200).json({ success: true, message: 'Verification code sent successfully to your email.' });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP code & log in or register
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  const { email, otp, name } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and verification code are required' });
  }

  try {
    // Check if OTP matches
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    // Delete OTP record immediately
    await OTP.deleteOne({ _id: otpRecord._id });

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      if (!name) {
        return res.status(400).json({ success: false, message: 'User profile details missing for new signup' });
      }

      user = await User.create({
        name,
        email,
      });
    }

    // Generate JWT access & refresh cookies
    const { accessToken } = await generateToken(res, user._id);

    res.status(200).json({
      success: true,
      token: accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        aiCreditsUsed: user.aiCreditsUsed || 0,
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Firebase Google Sign-In
// @route   POST /api/auth/firebase-google
// @access  Public
export const firebaseGoogleAuth = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ success: false, message: 'ID Token is required' });
  }

  try {
    // Verify token using public JWK keys
    const googleUser = await verifyFirebaseGoogleToken(idToken);

    // Find or create user in MongoDB
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.avatar,
        firebaseUid: googleUser.firebaseUid,
      });
    } else {
      // Link firebaseUid if missing
      if (!user.firebaseUid) {
        user.firebaseUid = googleUser.firebaseUid;
        if (!user.avatar) user.avatar = googleUser.avatar;
        await user.save();
      }
    }

    // Generate JWT cookies
    const { accessToken } = await generateToken(res, user._id);

    res.status(200).json({
      success: true,
      token: accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        aiCreditsUsed: user.aiCreditsUsed || 0,
      }
    });
  } catch (error) {
    console.error('Google Auth Validation Error:', error);
    res.status(401).json({ success: false, message: 'Google Auth validation failed. ' + error.message });
  }
};

// @desc    Register a new user (Password flow)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Email format validation check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }

  // Password length validation check
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const { accessToken } = await generateToken(res, user._id);

    res.status(201).json({
      success: true,
      token: accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        aiCreditsUsed: user.aiCreditsUsed || 0,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token (Password flow)
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const { accessToken } = await generateToken(res, user._id);
      
      res.json({
        success: true,
        token: accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
          aiCreditsUsed: user.aiCreditsUsed || 0,
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user & clear cookies
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (req, res) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  try {
    if (accessToken || refreshToken) {
      await User.findOneAndUpdate(
        { 
          $or: [
            { "tokens.accessToken": accessToken },
            { "tokens.refreshToken": refreshToken }
          ]
        },
        { 
          $pull: { 
            tokens: { 
              $or: [
                { accessToken },
                { refreshToken }
              ]
            } 
          } 
        }
      );
    }
  } catch (error) {
    console.error('Logout database session removal failed:', error.message);
  }

  const host = res.req ? res.req.get('host') : '';
  const isProduction = process.env.NODE_ENV === 'production' || 
                       process.env.RENDER === 'true' || 
                       (host && !host.includes('localhost') && !host.includes('127.0.0.1'));
  res.cookie('access_token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });
  res.cookie('refresh_token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          plan: user.plan,
          aiCreditsUsed: user.aiCreditsUsed || 0,
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.avatar !== undefined) {
        user.avatar = req.body.avatar;
      }
 
      if (req.body.password) {
        user.password = req.body.password;
      }
 
      const updatedUser = await user.save();
 
      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          plan: updatedUser.plan,
          aiCreditsUsed: updatedUser.aiCreditsUsed || 0,
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Refresh Access Token using Refresh Token Cookie
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Not authorized, no refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    // Sign a new access token and overwrite cookie
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET || 'fallback_access_secret', {
      expiresIn: '15m',
    });

    const host = res.req ? res.req.get('host') : '';
    const isProduction = process.env.NODE_ENV === 'production' || 
                         process.env.RENDER === 'true' || 
                         (host && !host.includes('localhost') && !host.includes('127.0.0.1'));

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      token: accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        aiCreditsUsed: user.aiCreditsUsed || 0,
      }
    });
  } catch (error) {
    console.error('Refresh Token Cookie Error:', error.message);
    res.cookie('access_token', '', { expires: new Date(0) });
    res.cookie('refresh_token', '', { expires: new Date(0) });
    return res.status(401).json({ success: false, message: 'Not authorized, session expired' });
  }
};
