import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiMapPin, FiCreditCard, FiTruck, FiArrowLeft, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

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
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    if (cartItems.length === 0 && !authLoading) {
      navigate('/user/cart');
      return;
    }
  }, [isAuthenticated, authLoading, cartItems, navigate]);

  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
      const defaultAddr = user.addresses.find(addr => addr.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr);
    }
  }, [user]);

  // Show loading state while checking auth
  if (authLoading) {
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

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        shopId: cartItems[0]?.shopId || 1,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        deliveryAddress: {
          name: selectedAddress.name || user?.name || '',
          addressLine1: selectedAddress.addressLine1 || selectedAddress.address || '',
          addressLine2: selectedAddress.addressLine2 || '',
          city: selectedAddress.city || '',
          state: selectedAddress.state || '',
          pincode: selectedAddress.pincode || '',
          landmark: selectedAddress.landmark || '',
          latitude: 0,
          longitude: 0
        },
        paymentMethod
      };

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/user/orders');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const deliveryCharge = 20;
  const total = subtotal + deliveryCharge;

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
          <BackButton label="Back to Cart" to="/user/cart" />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.text, marginBottom: '20px' }}>
          Checkout
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            {/* Delivery Address */}
            <div style={{
              background: colors.white,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: `1px solid ${colors.primaryLight}`,
              marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiMapPin style={{ color: colors.primary }} /> Delivery Address
              </h3>

              {addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: colors.textLight }}>No saved addresses</p>
                  <button 
                    onClick={() => navigate('/user/addresses')}
                    style={{ 
                      color: colors.primary, 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.primaryDark}
                    onMouseLeave={(e) => e.currentTarget.style.color = colors.primary}
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {addresses.map((addr, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedAddress(addr)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: `2px solid ${selectedAddress === addr ? colors.primary : colors.primaryLight}`,
                        cursor: 'pointer',
                        background: selectedAddress === addr ? colors.primaryLight : 'white',
                        transition: 'all 0.3s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <p style={{ fontWeight: '500', color: colors.text }}>{addr.name}</p>
                          <p style={{ fontSize: '14px', color: colors.textLight }}>{addr.addressLine1 || addr.address}</p>
                          <p style={{ fontSize: '14px', color: colors.textLight }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {addr.isDefault && (
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
                          {selectedAddress === addr && <FiCheck style={{ color: colors.primary }} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div style={{
              background: colors.white,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: `1px solid ${colors.primaryLight}`
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiCreditCard style={{ color: colors.primary }} /> Payment Method
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: `2px solid ${paymentMethod === 'cash_on_delivery' ? colors.primary : colors.primaryLight}`,
                    cursor: 'pointer',
                    background: paymentMethod === 'cash_on_delivery' ? colors.primaryLight : 'white',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: '500', color: colors.text }}>Cash on Delivery</p>
                      <p style={{ fontSize: '13px', color: colors.textLight }}>Pay when you receive your order</p>
                    </div>
                    {paymentMethod === 'cash_on_delivery' && <FiCheck style={{ color: colors.primary }} />}
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('online')}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: `2px solid ${paymentMethod === 'online' ? colors.primary : colors.primaryLight}`,
                    cursor: 'pointer',
                    background: paymentMethod === 'online' ? colors.primaryLight : 'white',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: '500', color: colors.text }}>Online Payment</p>
                      <p style={{ fontSize: '13px', color: colors.textLight }}>Pay securely with cards, UPI, etc.</p>
                    </div>
                    {paymentMethod === 'online' && <FiCheck style={{ color: colors.primary }} />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div style={{
              background: colors.white,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: `1px solid ${colors.primaryLight}`,
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, marginBottom: '16px' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textLight }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textLight }}>
                  <span>Delivery Charge</span>
                  <span>₹{deliveryCharge.toFixed(2)}</span>
                </div>
                <div style={{ borderTop: `1px solid ${colors.primaryLight}`, paddingTop: '12px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: colors.text }}>
                    <span>Total</span>
                    <span style={{ color: colors.primary }}>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '14px',
                  background: !selectedAddress || loading ? colors.textLight : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: !selectedAddress || loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s',
                  boxShadow: !selectedAddress || loading ? 'none' : '0 4px 16px rgba(0,91,150,0.3)'
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
                    Placing order...
                  </span>
                ) : (
                  <><FiTruck size={18} /> Place Order</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Checkout;