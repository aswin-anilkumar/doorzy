import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiLogOut, FiMapPin, FiPackage, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

const Profile = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

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
    if (!loading && !isAuthenticated) {
      toast.error('Please login to view your profile');
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  // Show loading state while checking auth
  if (loading) {
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
          <p style={{ color: colors.textLight }}>Loading profile...</p>
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
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Header showStats={false} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px 20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <BackButton label="Back" />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.text, marginBottom: '20px' }}>
          My Profile
        </h1>

        {/* Profile Card */}
        <div style={{
          background: colors.white,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: `1px solid ${colors.primaryLight}`,
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.primary;
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = colors.primaryLight;
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 4px 16px rgba(0,91,150,0.3)'
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: colors.text }}>
              {user?.name || 'User'}
            </h2>
            <p style={{ 
              color: colors.primary,
              fontSize: '14px',
              textTransform: 'capitalize',
              fontWeight: '500'
            }}>
              {user?.role?.replace('_', ' ') || 'Customer'}
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', color: colors.textLight, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiMail size={16} style={{ color: colors.primary }} /> {user?.email || 'No email'}
              </span>
              {user?.phone && (
                <span style={{ fontSize: '14px', color: colors.textLight, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiPhone size={16} style={{ color: colors.primary }} /> {user.phone}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 24px',
              background: colors.accent2,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#c0392b';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.accent2;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FiLogOut size={18} /> Logout
          </button>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {[
            { 
              to: '/user/addresses', 
              icon: FiMapPin, 
              title: 'Saved Addresses', 
              desc: 'Manage your delivery addresses',
              color: colors.primary,
              bg: colors.primaryLight
            },
            { 
              to: '/user/orders', 
              icon: FiPackage, 
              title: 'My Orders', 
              desc: 'Track your order history',
              color: colors.secondary,
              bg: '#E8F8FA'
            },
            { 
              to: '/shops', 
              icon: FiShoppingBag, 
              title: 'Browse Shops', 
              desc: 'Discover local shops near you',
              color: colors.accent,
              bg: '#FEF9E7'
            }
          ].map((item, index) => (
            <Link 
              key={index}
              to={item.to} 
              style={{
                background: colors.white,
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: `1px solid ${colors.primaryLight}`,
                textDecoration: 'none',
                color: colors.text,
                textAlign: 'center',
                transition: 'all 0.3s',
                animation: `slideUp 0.4s ease-out ${index * 0.05}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = colors.primaryLight;
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                background: item.bg,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <item.icon style={{ fontSize: '28px', color: item.color }} />
              </div>
              <h3 style={{ fontWeight: '600', fontSize: '16px', color: colors.text }}>{item.title}</h3>
              <p style={{ fontSize: '13px', color: colors.textLight }}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;