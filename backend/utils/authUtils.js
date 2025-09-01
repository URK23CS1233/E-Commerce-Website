const crypto = require('crypto');

class AuthUtils {
  // Generate a 6-digit OTP
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate a secure random token for password reset
  static generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate email verification token
  static generateEmailVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hash a token for storage
  static hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Validate email format
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static isValidPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // Generate JWT payload
  static generateJWTPayload(user) {
    return {
      userId: user._id,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    };
  }

  // Calculate OTP expiry time (10 minutes from now)
  static getOTPExpiry() {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  }

  // Calculate reset token expiry time (1 hour from now)
  static getResetTokenExpiry() {
    return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  }

  // Calculate email verification expiry time (24 hours from now)
  static getEmailVerificationExpiry() {
    return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  }

  // Check if OTP is valid (not expired)
  static isOTPValid(otpExpires) {
    return otpExpires && otpExpires > new Date();
  }

  // Check if reset token is valid (not expired)
  static isResetTokenValid(resetExpires) {
    return resetExpires && resetExpires > new Date();
  }

  // Sanitize user data for response
  static sanitizeUser(user) {
    const { password, otp, otpExpires, resetPasswordToken, resetPasswordExpires, ...sanitizedUser } = user.toObject();
    return sanitizedUser;
  }

  // Generate secure session ID
  static generateSessionId() {
    return crypto.randomBytes(24).toString('hex');
  }

  // Rate limiting helper - check if IP/user should be blocked
  static shouldBlockRequest(attempts, maxAttempts, windowMs) {
    return attempts >= maxAttempts;
  }

  // Calculate backoff time for progressive delays
  static calculateBackoffTime(attempts) {
    // Progressive backoff: 1s, 2s, 4s, 8s, 16s (max 30s)
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, attempts - 1), maxDelay);
    return delay;
  }

  // Validate phone number format (basic validation)
  static isValidPhoneNumber(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  // Generate a secure random string of specified length
  static generateSecureString(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Mask email for security (show only first 2 chars and domain)
  static maskEmail(email) {
    const [username, domain] = email.split('@');
    const maskedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
    return `${maskedUsername}@${domain}`;
  }

  // Mask phone number for security
  static maskPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const masked = '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
    return masked;
  }
}

module.exports = AuthUtils;
