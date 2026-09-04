import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

const Cart = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
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
      toast.error('Please login to view your cart');
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/user/checkout');
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.bg }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: `4px solid ${colors.primaryLight}`, 
            borderTopColor: colors.primary, 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }}></div>
          <p style={{ color: colors.textLight }}>Loading...</p>
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

  if (cartItems.length === 0) {
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
        `}</style>

        <Header showStats={false} />

        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto', 
          padding: '20px',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            background: colors.primaryLight,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <FiShoppingCart style={{ fontSize: '60px', color: colors.primary }} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.text }}>
            Your cart is empty
          </h2>
          <p style={{ color: colors.textLight, marginTop: '8px' }}>
            Start shopping from nearby shops
          </p>
          <Link 
            to="/shops" 
            style={{
              marginTop: '24px',
              padding: '14px 40px',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
              color: 'white',
              borderRadius: '14px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Browse Shops
          </Link>
        </div>

        <BottomNav />
      </div>
    );
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
          <BackButton label="Back to Shopping" to="/shops" />
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.text }}>
            Your Cart
            <span style={{ 
              fontSize: '14px', 
              fontWeight: '400', 
              color: colors.textLight, 
              marginLeft: '10px' 
            }}>
              ({cartItems.length} items)
            </span>
          </h1>
          <button
            onClick={clearCart}
            style={{
              color: colors.accent2,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#c0392b'}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.accent2}
          >
            Clear Cart
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cartItems.map((item, index) => (
            <div 
              key={item.productId} 
              style={{
                background: colors.white,
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: `1px solid ${colors.primaryLight}`,
                flexWrap: 'wrap',
                animation: `slideUp 0.4s ease-out ${index * 0.05}s both`
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'rgba(255,255,255,0.8)'
              }}>
                {item.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: '120px' }}>
                <h4 style={{ fontWeight: '600', fontSize: '16px', color: colors.text }}>
                  {item.name}
                </h4>
                <div style={{ fontSize: '14px', color: colors.textLight }}>
                  ₹{item.price} 
                  {item.mrp > item.price && (
                    <span style={{ 
                      textDecoration: 'line-through', 
                      color: colors.textLight, 
                      marginLeft: '8px',
                      opacity: 0.6
                    }}>
                      ₹{item.mrp}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  border: `1px solid ${colors.primaryLight}`, 
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    style={{
                      padding: '6px 12px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      color: colors.text,
                      transition: 'background 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = colors.primaryLight}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <FiMinus size={16} />
                  </button>
                  <span style={{ 
                    padding: '4px 12px', 
                    fontSize: '15px', 
                    fontWeight: '600',
                    color: colors.text,
                    minWidth: '32px',
                    textAlign: 'center'
                  }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    style={{
                      padding: '6px 12px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      color: colors.text,
                      transition: 'background 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = colors.primaryLight}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  style={{
                    color: colors.accent2,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    transition: 'transform 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '24px',
          background: colors.white,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: `1px solid ${colors.primaryLight}`
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: colors.text,
            marginBottom: '4px'
          }}>
            <span>Total</span>
            <span style={{ color: colors.primary }}>₹{getCartTotal().toFixed(2)}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '13px', 
            color: colors.textLight,
            marginBottom: '16px'
          }}>
            <span>Delivery charges will be calculated at checkout</span>
          </div>
          <button
            onClick={handleCheckout}
            style={{
              width: '100%',
              padding: '16px',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 16px rgba(0,91,150,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,91,150,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,91,150,0.3)';
            }}
          >
            Proceed to Checkout <FiArrowRight size={18} />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Cart;