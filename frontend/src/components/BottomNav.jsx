import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiShoppingCart, FiPackage, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  const colors = {
    primary: '#005B96',
    primaryLight: '#E8F4FD',
    textLight: '#636E72',
    white: '#FFFFFF'
  };

  const handleProtectedClick = (path, label) => {
    if (!isAuthenticated) {
      toast.error(`Please login to view ${label}`);
      navigate('/login');
      return;
    }
    navigate(path);
  };

  const navItems = [
    { 
      icon: FiHome, 
      label: 'Home', 
      path: '/', 
      protected: false 
    },
    { 
      icon: FiShoppingCart, 
      label: 'Cart', 
      path: '/user/cart', 
      badge: totalItems,
      protected: true 
    },
    { 
      icon: FiPackage, 
      label: 'Orders', 
      path: '/user/orders',
      protected: true 
    },
    { 
      icon: FiUser, 
      label: 'Profile', 
      path: '/user/profile',
      protected: true 
    }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/user/home';
    }
    return location.pathname === path;
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: colors.white,
      borderTop: `1px solid ${colors.primaryLight}`,
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0 6px',
      zIndex: 100,
      boxShadow: '0 -4px 12px rgba(0,0,0,0.04)'
    }}>
      {navItems.map((item) => {
        const isActive = isActivePath(item.path);
        
        // If protected, use button with onClick
        if (item.protected) {
          return (
            <button
              key={item.path}
              onClick={() => handleProtectedClick(item.path, item.label)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                textDecoration: 'none',
                color: isActive ? colors.primary : colors.textLight,
                fontSize: '10px',
                position: 'relative',
                padding: '4px 16px',
                transition: 'color 0.3s',
                minWidth: '56px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              <item.icon size={22} style={{ 
                strokeWidth: isActive ? 2.5 : 1.5,
                transition: 'all 0.3s'
              }} />
              <span style={{ 
                fontWeight: isActive ? '600' : '400',
                fontSize: '10px'
              }}>
                {item.label}
              </span>
              {item.badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '4px',
                  background: colors.primary,
                  color: 'white',
                  borderRadius: '50%',
                  padding: '1px 6px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  minWidth: '16px',
                  textAlign: 'center'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        }

        // Home is public - use Link
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              textDecoration: 'none',
              color: isActive ? colors.primary : colors.textLight,
              fontSize: '10px',
              position: 'relative',
              padding: '4px 16px',
              transition: 'color 0.3s',
              minWidth: '56px'
            }}
          >
            <item.icon size={22} style={{ 
              strokeWidth: isActive ? 2.5 : 1.5,
              transition: 'all 0.3s'
            }} />
            <span style={{ 
              fontWeight: isActive ? '600' : '400',
              fontSize: '10px'
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;