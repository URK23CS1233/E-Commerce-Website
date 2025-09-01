const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../services/emailService');
const AuthUtils = require('../utils/authUtils');
const auth = require('../middleware/auth');
const {
  authLimiter,
  loginLimiter,
  otpLimiter,
  passwordResetLimiter,
  registrationLimiter
} = require('../middleware/rateLimiters');
const {
  validateRegistration,
  validateLogin,
  validateOTPLogin,
  validateOTPVerification,
  validateForgotPassword,
  validateResetPassword,
  validateResetPasswordWithOTP,
  validateChangePassword
} = require('../middleware/validation');

const router = express.Router();

// Apply general rate limiting to all auth routes
router.use(authLimiter);

// Register with Email/Password
router.post('/register', 
  // registrationLimiter, // Temporarily disabled for testing
  validateRegistration, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists with this email address' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isOTPUser: false,
    });

    await user.save();

    // Send welcome email
    await emailService.sendWelcomeEmail(email, name);

    // Generate JWT
    const token = jwt.sign(
      AuthUtils.generateJWTPayload(user),
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: AuthUtils.sanitizeUser(user),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Server error during registration',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login with Email/Password
router.post('/login', loginLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        error: 'Account temporarily locked due to too many failed login attempts. Please try again later.',
        lockedUntil: user.lockUntil
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      AuthUtils.generateJWTPayload(user),
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: AuthUtils.sanitizeUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server error during login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Request OTP for Login
router.post('/request-otp', otpLimiter, validateOTPLogin, async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists, if not create OTP-only user
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new OTP-only user
      user = new User({
        name: email.split('@')[0], // Use email prefix as default name
        email,
        isOTPUser: true,
        isEmailVerified: false,
      });
    }

    // Check if OTP is locked
    if (user.isOTPLocked) {
      return res.status(423).json({ 
        error: 'Too many OTP attempts. Please try again later.',
        lockedUntil: user.otpLockedUntil
      });
    }

    // Generate OTP
    const otp = AuthUtils.generateOTP();
    
    // Hash and save OTP
    user.otp = AuthUtils.hashToken(otp);
    user.otpExpires = AuthUtils.getOTPExpiry();
    user.otpAttempts = 0; // Reset attempts when new OTP is generated
    
    await user.save();

    // Send OTP via email
    const emailResult = await emailService.sendOTP(email, otp, user.name);
    
    if (!emailResult.success) {
      return res.status(500).json({ 
        error: 'Failed to send OTP. Please try again.' 
      });
    }

    res.json({
      message: 'OTP sent successfully',
      email: AuthUtils.maskEmail(email),
      expiresIn: '10 minutes'
    });
  } catch (error) {
    console.error('OTP request error:', error);
    res.status(500).json({ 
      error: 'Server error while sending OTP',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify OTP and Login
router.post('/verify-otp', validateOTPVerification, async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Check if OTP is locked
    if (user.isOTPLocked) {
      return res.status(423).json({ 
        error: 'Too many OTP attempts. Please try again later.',
        lockedUntil: user.otpLockedUntil
      });
    }

    // Check if OTP exists and is not expired
    if (!user.otp || !AuthUtils.isOTPValid(user.otpExpires)) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    const hashedOTP = AuthUtils.hashToken(otp);
    if (user.otp !== hashedOTP) {
      await user.incOTPAttempts();
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Clear OTP data and reset attempts
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.resetOTPAttempts();
    
    // Mark email as verified for OTP users
    if (user.isOTPUser) {
      user.isEmailVerified = true;
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      AuthUtils.generateJWTPayload(user),
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'OTP verified successfully',
      token,
      user: AuthUtils.sanitizeUser(user),
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ 
      error: 'Server error during OTP verification',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Forgot Password - Send Reset Link
router.post('/forgot-password', passwordResetLimiter, validateForgotPassword, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that user doesn't exist for security
      return res.json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Don't allow password reset for OTP-only users
    if (user.isOTPUser) {
      return res.status(400).json({ 
        error: 'This account uses OTP login only. Please use OTP to access your account.' 
      });
    }

    // Generate reset token
    const resetToken = AuthUtils.generateResetToken();
    
    // Hash and save reset token
    user.resetPasswordToken = AuthUtils.hashToken(resetToken);
    user.resetPasswordExpires = AuthUtils.getResetTokenExpiry();
    
    await user.save();

    // Send reset email
    const emailResult = await emailService.sendPasswordResetLink(email, resetToken, user.name);
    
    if (!emailResult.success) {
      // Clear the reset token if email failed
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(500).json({ 
        error: 'Failed to send reset email. Please try again.' 
      });
    }

    res.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
      email: AuthUtils.maskEmail(email)
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      error: 'Server error while processing password reset',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Forgot Password - Send Reset OTP
router.post('/forgot-password-otp', passwordResetLimiter, validateForgotPassword, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: 'If an account with that email exists, a password reset OTP has been sent.'
      });
    }

    // Check if OTP is locked
    if (user.isOTPLocked) {
      return res.status(423).json({ 
        error: 'Too many OTP attempts. Please try again later.',
        lockedUntil: user.otpLockedUntil
      });
    }

    // Generate OTP
    const otp = AuthUtils.generateOTP();
    
    // Hash and save OTP for password reset
    user.resetPasswordToken = AuthUtils.hashToken(otp);
    user.resetPasswordExpires = AuthUtils.getOTPExpiry();
    user.otpAttempts = 0;
    
    await user.save();

    // Send OTP via email
    const emailResult = await emailService.sendPasswordResetOTP(email, otp, user.name);
    
    if (!emailResult.success) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(500).json({ 
        error: 'Failed to send reset OTP. Please try again.' 
      });
    }

    res.json({
      message: 'If an account with that email exists, a password reset OTP has been sent.',
      email: AuthUtils.maskEmail(email),
      expiresIn: '10 minutes'
    });
  } catch (error) {
    console.error('Forgot password OTP error:', error);
    res.status(500).json({ 
      error: 'Server error while sending reset OTP',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Reset Password with Token
router.post('/reset-password', validateResetPassword, async (req, res) => {
  try {
    const { token, password } = req.body;

    // Hash the token to compare with stored hash
    const hashedToken = AuthUtils.hashToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.loginAttempts = undefined;
    user.lockUntil = undefined;
    
    await user.save();

    res.json({
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      error: 'Server error while resetting password',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Reset Password with OTP
router.post('/reset-password-otp', validateResetPasswordWithOTP, async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Check if OTP is locked
    if (user.isOTPLocked) {
      return res.status(423).json({ 
        error: 'Too many OTP attempts. Please try again later.' 
      });
    }

    // Verify reset OTP
    const hashedOTP = AuthUtils.hashToken(otp);
    if (!user.resetPasswordToken || user.resetPasswordToken !== hashedOTP) {
      await user.incOTPAttempts();
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (!AuthUtils.isResetTokenValid(user.resetPasswordExpires)) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.loginAttempts = undefined;
    user.lockUntil = undefined;
    user.isOTPUser = false; // Convert to regular user if they set a password
    await user.resetOTPAttempts();
    
    await user.save();

    res.json({
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password with OTP error:', error);
    res.status(500).json({ 
      error: 'Server error while resetting password',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Change Password (for authenticated users)
router.post('/change-password', auth, validateChangePassword, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has a password (not OTP-only user)
    if (user.isOTPUser || !user.password) {
      return res.status(400).json({ 
        error: 'Cannot change password for OTP-only accounts' 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      error: 'Server error while changing password',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: AuthUtils.sanitizeUser(user)
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching profile',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Logout (optional - mainly for token blacklisting if implemented)
router.post('/logout', auth, async (req, res) => {
  try {
    // Here you could implement token blacklisting if needed
    // For now, we'll just send a success response
    res.json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Server error during logout',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
