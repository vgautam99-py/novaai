import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: false, // Optional for Google OAuth and OTP login
    },
    avatar: {
      type: String,
      default: '',
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'vip'],
      default: 'free',
    },
    aiCreditsUsed: {
      type: Number,
      default: 0,
    },
    firebaseUid: {
      type: String,
      default: '',
      index: true,
    },
    tokens: [
      {
        accessToken: { type: String },
        refreshToken: { type: String },
        tokenCreatedAt: { type: Date, default: Date.now },
        cookieName: { type: String, default: 'access_token, refresh_token' },
        cookieCreatedAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
