import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
  const [method, setMethod] = useState('link'); // 'link' or 'otp'
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const endpoint = method === 'link' 
      ? '/api/auth/forgot-password' 
      : '/api/auth/forgot-password-otp';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to send reset instructions');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Check Your Email</h2>
            <div className="success-icon">✉️</div>
          </div>

          <div className="success-message">
            {message}
          </div>

          <div className="success-instructions">
            {method === 'link' ? (
              <p>
                Click the link in the email to reset your password. 
                The link will expire in 1 hour.
              </p>
            ) : (
              <p>
                Use the OTP in the email to reset your password. 
                The OTP will expire in 10 minutes.
              </p>
            )}
          </div>

          {method === 'otp' && (
            <div className="auth-actions">
              <Link to="/reset-password-otp" className="auth-button">
                Enter OTP to Reset Password
              </Link>
            </div>
          )}

          <div className="auth-links">
            <p>
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                type="button"
                onClick={() => setSuccess(false)}
                className="link-button"
              >
                try again
              </button>
            </p>
            <p>
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Forgot Password</h2>
          <p>Choose how you'd like to reset your password</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="reset-method-selector">
          <div className="method-option">
            <label className={`method-label ${method === 'link' ? 'active' : ''}`}>
              <input
                type="radio"
                name="method"
                value="link"
                checked={method === 'link'}
                onChange={(e) => setMethod(e.target.value)}
              />
              <div className="method-content">
                <h3>📧 Email Link</h3>
                <p>Receive a secure link to reset your password</p>
              </div>
            </label>
          </div>

          <div className="method-option">
            <label className={`method-label ${method === 'otp' ? 'active' : ''}`}>
              <input
                type="radio"
                name="method"
                value="otp"
                checked={method === 'otp'}
                onChange={(e) => setMethod(e.target.value)}
              />
              <div className="method-content">
                <h3>🔢 One-Time Password</h3>
                <p>Receive a 6-digit code to reset your password</p>
              </div>
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading 
              ? 'Sending...' 
              : method === 'link' 
                ? 'Send Reset Link' 
                : 'Send OTP'
            }
          </button>
        </form>

        <div className="auth-links">
          <p>
            Remember your password? <Link to="/login">Back to Login</Link>
          </p>
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
