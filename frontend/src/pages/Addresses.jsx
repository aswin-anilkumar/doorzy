import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiMapPin, FiPlus, FiTrash2, FiCheck, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

const Addresses = () => {
  const { user, refreshUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', landmark: '', isDefault: false
  });

  const colors = {
    primary: '#005B96',
    primaryLight: '#E8F4FD',
    primaryDark: '#003D66',
    secondary: '#00A3C8',
    accent: '#F5A623',
    accent2: '#E85D75',
    success: '#00B894',
    text: '#2D3436',
    textLight: '#636E72',
    bg: '#F8FAFC',
    white: '#FFFFFF'
  };

  // PROTECTED ROUTE - Redirect guests to login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Please login to manage addresses');
      navigate('/login');
      return;
    }
    if (isAuthenticated) {
      loadAddresses();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const loadAddresses = () => {
    if (user?.addresses) {
      setAddresses(user.addresses);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/users/addresses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshUser();
      toast.success('Address added');
      setShowForm(false);
      setFormData({ 
        name: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', landmark: '', isDefault: false 
      });
      if (user?.addresses) {
        setAddresses(user.addresses);
      }
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/users/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshUser();
      toast.success('Address deleted');
      if (user?.addresses) {
        setAddresses(user.addresses);
      }
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  // Show loading state while checking auth
  if (authLoading || loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: colors.bg 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: `4px solid ${colors.primaryLight}`, 
            borderTopColor: colors.primary, 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }}></div>
          <p style={{ color: colors.textLight }}>Loading addresses...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.bg,
      paddingBottom: '80px',
      overflowX: 'hidden'
    }}>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.4s ease-out; }
      `}</style>

      <Header showStats={false} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px 20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <BackButton label="Back" />
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.text }}>
            Saved Addresses
            <span style={{ 
              fontSize: '14px', 
              fontWeight: '400', 
              color: colors.textLight, 
              marginLeft: '10px' 
            }}>
              ({addresses.length})
            </span>
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 20px',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s',
              boxShadow: '0 2px 8px rgba(0,91,150,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,91,150,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,91,150,0.2)';
            }}
          >
            <FiPlus size={18} /> Add Address
          </button>
        </div>

        {showForm && (
          <div style={{
            background: colors.white,
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: `1px solid ${colors.primaryLight}`,
            marginBottom: '16px',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, marginBottom: '12px' }}>
              Add New Address
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Address Label (e.g., Home)"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{
                    padding: '10px 14px',
                    border: `2px solid ${colors.primaryLight}`,
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    background: colors.bg
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.background = colors.white;
                    e.currentTarget.style.boxShadow = `0 0 0 4px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.primaryLight;
                    e.currentTarget.style.background = colors.bg;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  required
                />
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                  style={{
                    padding: '10px 14px',
                    border: `2px solid ${colors.primaryLight}`,
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    background: colors.bg
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.background = colors.white;
                    e.currentTarget.style.boxShadow = `0 0 0 4px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.primaryLight;
                    e.currentTarget.style.background = colors.bg;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  required
                />
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                  style={{
                    padding: '10px 14px',
                    border: `2px solid ${colors.primaryLight}`,
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    background: colors.bg
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.background = colors.white;
                    e.currentTarget.style.boxShadow = `0 0 0 4px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.primaryLight;
                    e.currentTarget.style.background = colors.bg;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    style={{
                      padding: '10px 14px',
                      border: `2px solid ${colors.primaryLight}`,
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s',
                      background: colors.bg
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.primary;
                      e.currentTarget.style.background = colors.white;
                      e.currentTarget.style.boxShadow = `0 0 0 4px ${colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = colors.primaryLight;
                      e.currentTarget.style.background = colors.bg;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    style={{
                      padding: '10px 14px',
                      border: `2px solid ${colors.primaryLight}`,
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s',
                      background: colors.bg
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.primary;
                      e.currentTarget.style.background = colors.white;
                      e.currentTarget.style.boxShadow = `0 0 0 4px ${colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = colors.primaryLight;
                      e.currentTarget.style.background = colors.bg;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  style={{
                    padding: '10px 14px',
                    border: `2px solid ${colors.primaryLight}`,
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    background: colors.bg
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.background = colors.white;
                    e.currentTarget.style.boxShadow = `0 0 0 4px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.primaryLight;
                    e.currentTarget.style.background = colors.bg;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  required
                />
                <input
                  type="text"
                  placeholder="Landmark (Optional)"
                  value={formData.landmark}
                  onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                  style={{
                    padding: '10px 14px',
                    border: `2px solid ${colors.primaryLight}`,
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    background: colors.bg
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.background = colors.white;
                    e.currentTarget.style.boxShadow = `0 0 0 4px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.primaryLight;
                    e.currentTarget.style.background = colors.bg;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      accentColor: colors.primary
                    }}
                  />
                  <label style={{ fontSize: '14px', color: colors.text }}>Set as default address</label>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 24px',
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s',
                      boxShadow: '0 2px 8px rgba(0,91,150,0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,91,150,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,91,150,0.2)';
                    }}
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      padding: '10px 24px',
                      background: colors.bg,
                      color: colors.text,
                      border: `1px solid ${colors.primaryLight}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.primaryLight;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = colors.bg;
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {addresses.length === 0 ? (
          <div style={{
            background: colors.white,
            borderRadius: '16px',
            padding: '60px 20px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: `1px solid ${colors.primaryLight}`
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: colors.primaryLight,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <FiMapPin style={{ fontSize: '40px', color: colors.primary }} />
            </div>
            <p style={{ color: colors.textLight }}>No saved addresses</p>
            <p style={{ fontSize: '14px', color: colors.textLight }}>Add your first address for faster checkout</p>
          </div>
        ) : (
          addresses.map((address, index) => (
            <div 
              key={index} 
              style={{
                background: colors.white,
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: `1px solid ${colors.primaryLight}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '12px',
                transition: 'all 0.3s',
                animation: `slideUp 0.4s ease-out ${index * 0.05}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.primary;
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.primaryLight;
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <h4 style={{ fontWeight: '600', color: colors.text }}>{address.name}</h4>
                  {address.isDefault && (
                    <span style={{ 
                      fontSize: '11px', 
                      padding: '2px 10px', 
                      borderRadius: '9999px', 
                      background: '#E8F8F5', 
                      color: colors.success, 
                      fontWeight: '600' 
                    }}>
                      Default
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '14px', color: colors.textLight }}>{address.addressLine1}</p>
                {address.addressLine2 && <p style={{ fontSize: '14px', color: colors.textLight }}>{address.addressLine2}</p>}
                <p style={{ fontSize: '14px', color: colors.textLight }}>{address.city}, {address.state} - {address.pincode}</p>
                {address.landmark && <p style={{ fontSize: '13px', color: colors.textLight }}>Landmark: {address.landmark}</p>}
              </div>
              <button
                onClick={() => handleDelete(address.id)}
                style={{
                  color: colors.accent2,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  transition: 'transform 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Addresses;