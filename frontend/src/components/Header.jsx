import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiMapPin, FiShoppingCart, FiLogOut, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Header = ({ showStats = true }) => {
  const { user, logout, updateUserAddress } = useAuth();
  const { totalItems } = useCart();
  const [userAddress, setUserAddress] = useState('Add Location');
  const [isUpdating, setIsUpdating] = useState(false);

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

  // Fetch user's address from localStorage or user object
  useEffect(() => {
    if (user?.address) {
      setUserAddress(user.address);
    } else {
      const savedAddress = localStorage.getItem('userAddress');
      if (savedAddress) {
        setUserAddress(savedAddress);
      }
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleLocationClick = async () => {
    const newAddress = prompt('Enter your location/address:', userAddress);
    
    if (newAddress && newAddress.trim() !== '') {
      const trimmedAddress = newAddress.trim();
      
      setUserAddress(trimmedAddress);
      localStorage.setItem('userAddress', trimmedAddress);
      
      if (user && updateUserAddress) {
        setIsUpdating(true);
        const result = await updateUserAddress(trimmedAddress);
        setIsUpdating(false);
        
        if (!result.success) {
          toast.error('Address saved locally but failed to update profile');
        }
      } else {
        toast.success('Location saved locally');
      }
    }
  };

  return (
    <div style={{
      background: colors.white,
      padding: '14px 16px 12px',
      borderBottom: `1px solid ${colors.primaryLight}`,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ 
            fontSize: '22px', 
            fontWeight: '800', 
            color: colors.primary,
            letterSpacing: '-0.5px',
            textDecoration: 'none'
          }}>
            🛒 Doorzy
          </Link>
          
          {/* Location/Address with edit functionality */}
          <div 
            onClick={handleLocationClick}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '12px',
              color: colors.text,
              background: colors.primaryLight,
              padding: '6px 14px',
              borderRadius: '20px',
              border: `1px solid ${colors.primary}20`,
              cursor: isUpdating ? 'default' : 'pointer',
              transition: 'all 0.2s',
              maxWidth: '200px',
              opacity: isUpdating ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isUpdating) {
                e.currentTarget.style.background = colors.primaryLight;
                e.currentTarget.style.borderColor = colors.primary;
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,91,150,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isUpdating) {
                e.currentTarget.style.background = colors.primaryLight;
                e.currentTarget.style.borderColor = `${colors.primary}20`;
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            title={isUpdating ? 'Updating...' : 'Click to set your location'}
          >
            <FiMapPin size={14} style={{ color: colors.primary, flexShrink: 0 }} />
            <span style={{ 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              maxWidth: '120px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {isUpdating ? (
                'Updating...'
              ) : userAddress === 'Add Location' ? (
                <>
                  <span style={{ color: colors.primary, fontWeight: '600' }}>Set Location</span>
                </>
              ) : (
                userAddress
              )}
            </span>
            {!isUpdating && (
              <FiEdit2 size={12} style={{ color: colors.primary, opacity: 0.6, flexShrink: 0 }} />
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/user/cart" style={{ position: 'relative', color: colors.text }}>
            <FiShoppingCart size={22} />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: colors.primary,
                color: 'white',
                borderRadius: '50%',
                padding: '1px 6px',
                fontSize: '10px',
                fontWeight: 'bold',
                minWidth: '18px',
                textAlign: 'center'
              }}>
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colors.accent2,
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;