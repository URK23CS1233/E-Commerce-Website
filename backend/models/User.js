const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.isOTPUser;
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isOTPUser: {
    type: Boolean,
    default: false,
  },
  // OTP fields
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  otpAttempts: {
    type: Number,
    default: 0,
  },
  otpLockedUntil: {
    type: Date,
  },
  // Password reset fields
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  // Email verification fields
  emailVerificationToken: {
    type: String,
  },
  emailVerificationExpires: {
    type: Date,
  },
  // Security fields
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Virtual for checking if account is locked
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for checking if OTP is locked
UserSchema.virtual('isOTPLocked').get(function() {
  return !!(this.otpLockedUntil && this.otpLockedUntil > Date.now());
});

// Method to increment login attempts
UserSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to increment OTP attempts
UserSchema.methods.incOTPAttempts = function() {
  if (this.otpLockedUntil && this.otpLockedUntil < Date.now()) {
    return this.updateOne({
      $unset: { otpLockedUntil: 1 },
      $set: { otpAttempts: 1 }
    });
  }
  
  const updates = { $inc: { otpAttempts: 1 } };
  
  // Lock OTP after 3 failed attempts for 15 minutes
  if (this.otpAttempts + 1 >= 3 && !this.isOTPLocked) {
    updates.$set = { otpLockedUntil: Date.now() + 15 * 60 * 1000 }; // 15 minutes
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to reset OTP attempts
UserSchema.methods.resetOTPAttempts = function() {
  return this.updateOne({
    $unset: { otpAttempts: 1, otpLockedUntil: 1 }
  });
};

module.exports = mongoose.model('User', UserSchema);
