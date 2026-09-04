import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const role = result.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'delivery_agent') navigate('/delivery/dashboard');
      else navigate('/user/home');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fff4 0%, #ffffff 50%, #f0fff4 100%)',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(72,187,120,0.1), rgba(56,161,105,0.05))',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-150px',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(72,187,120,0.08), rgba(56,161,105,0.03))',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#4a5568',
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '10px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            transition: 'all 0.3s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            backdropFilter: 'blur(10px)',
            width: 'auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <FiArrowLeft size={16} /> Back
        </button>

        {/* Card */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '32px 28px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          border: '1px solid rgba(226,232,240,0.5)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #48bb78, #38a169)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              boxShadow: '0 8px 24px rgba(72,187,120,0.3)'
            }}>
              <FiShoppingBag style={{ fontSize: '28px', color: 'white' }} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748' }}>
              Welcome Back
            </h1>
            <p style={{ color: '#718096', fontSize: '14px', marginTop: '2px' }}>
              Sign in to continue shopping
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '6px'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#a0aec0',
                  fontSize: '18px'
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 46px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    background: '#f7fafc',
                    color: '#1a202c',
                    WebkitTextFillColor: '#1a202c'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#48bb78';
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(72,187,120,0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.background = '#f7fafc';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '6px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#a0aec0',
                  fontSize: '18px'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 46px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    background: '#f7fafc',
                    color: '#1a202c',
                    WebkitTextFillColor: '#1a202c'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#48bb78';
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(72,187,120,0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.background = '#f7fafc';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#a0aec0',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '22px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#4a5568'
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#48bb78',
                    cursor: 'pointer'
                  }}
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: '14px',
                  color: '#48bb78',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#38a169'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#48bb78'}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#a0aec0' : 'linear-gradient(135deg, #48bb78, #38a169)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(72,187,120,0.3)'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '18px',
                    height: '18px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In <FiArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div style={{ textAlign: 'center', marginTop: '18px' }}>
            <p style={{ color: '#718096', fontSize: '14px' }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: '#48bb78',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#38a169'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#48bb78'}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          /* Hide scrollbar on all devices */
          ::-webkit-scrollbar {
            display: none;
          }
          * {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          /* Ensure text is visible on mobile */
          input {
            -webkit-text-fill-color: #1a202c !important;
            opacity: 1 !important;
            color: #1a202c !important;
          }
          input::placeholder {
            -webkit-text-fill-color: #a0aec0 !important;
            opacity: 0.7 !important;
            color: #a0aec0 !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Login;