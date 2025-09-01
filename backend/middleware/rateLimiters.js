const rateLimit = require('express-rate-limit');

// General rate limiter for all auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 100 : 20, // More requests in development
  message: {
    error: 'Too many authentication requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 20 : 5, // More attempts in development
  message: {
    error: 'Too many login attempts from this IP, please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Rate limiter for OTP requests
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each IP to 3 OTP requests per 5 minutes
  message: {
    error: 'Too many OTP requests from this IP, please try again in 5 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for password reset requests
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    error: 'Too many password reset requests from this IP, please try again in 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for registration
const registrationLimiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'development' ? 5 * 60 * 1000 : 60 * 60 * 1000, // 5 minutes in dev, 1 hour in prod
  max: process.env.NODE_ENV === 'development' ? 50 : 5, // 50 attempts in dev, 5 in prod
  message: {
    error: 'Too many registration attempts from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for email verification
const emailVerificationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 email verification requests per 10 minutes
  message: {
    error: 'Too many email verification requests from this IP, please try again in 10 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  loginLimiter,
  otpLimiter,
  passwordResetLimiter,
  registrationLimiter,
  emailVerificationLimiter
};
