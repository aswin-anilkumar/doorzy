import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft, FiCheckCircle, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    
    if (e.target.name === 'password') {
      let strength = 0;
      if (value.length >= 6) strength++;
      if (value.match(/[a-z]/) && value.match(/[A-Z]/)) strength++;
      if (value.match(/\d/)) strength++;
      if (value.match(/[^a-zA-Z\d]/)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register({ name, email, phone, password, role: 'customer' });
    setLoading(false);

    if (result.success) {
      navigate('/user/home');
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return '#fc8181';
    if (passwordStrength === 2) return '#ecc94b';
    if (passwordStrength === 3) return '#63b3ed';
    return '#48bb78';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  const getStrengthWidth = () => {
    return (passwordStrength / 4) * 100;
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
            marginBottom: '16px',
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
          padding: '28px 24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          border: '1px solid rgba(226,232,240,0.5)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #48bb78, #38a169)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
              boxShadow: '0 8px 24px rgba(72,187,120,0.3)'
            }}>
              <FiShoppingBag style={{ fontSize: '24px', color: 'white' }} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#2d3748' }}>
              Create Account
            </h1>
            <p style={{ color: '#718096', fontSize: '13px', marginTop: '2px' }}>
              Join NearCart as a customer
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '4px'
              }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#a0aec0',
                  fontSize: '16px'
                }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
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

            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '4px'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#a0aec0',
                  fontSize: '16px'
                }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
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

            {/* Phone */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '4px'
              }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <FiPhone style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#a0aec0',
                  fontSize: '16px'
                }} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
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

            {/* Password */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '4px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#a0aec0',
                  fontSize: '16px'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
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
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#a0aec0',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {formData.password && (
                <div style={{ marginTop: '6px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      flex: 1,
                      height: '3px',
                      background: '#e2e8f0',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${getStrengthWidth()}%`,
                        background: getStrengthColor(),
                        transition: 'all 0.3s'
                      }} />
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      color: getStrengthColor()
                    }}>
                      {getStrengthText()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '4px'
              }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#a0aec0',
                  fontSize: '16px'
                }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#a0aec0',
                    padding: '4px'
                  }}
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p style={{
                  fontSize: '11px',
                  color: '#fc8181',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  ✕ Passwords do not match
                </p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length > 0 && (
                <p style={{
                  fontSize: '11px',
                  color: '#48bb78',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <FiCheckCircle size={13} /> Passwords match
                </p>
              )}
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
                fontSize: '15px',
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
                  Creating Account...
                </span>
              ) : (
                <>
                  Create Account <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div style={{ textAlign: 'center', marginTop: '14px' }}>
            <p style={{ color: '#718096', fontSize: '13px' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#48bb78',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#38a169'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#48bb78'}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            to { rotate: 360deg; }
          }
          /* Hide scrollbar */
          ::-webkit-scrollbar {
            display: none;
          }
          * {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          /* Ensure text is visible */
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

export default Register;