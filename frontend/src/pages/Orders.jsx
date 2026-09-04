import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiX, FiEye, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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
      toast.error('Please login to view your orders');
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: { bg: '#FEF9E7', text: '#B7950B' },
      accepted: { bg: '#E8F4FD', text: colors.primary },
      picked_up: { bg: '#F3E8FF', text: '#6C5CE7' },
      on_the_way: { bg: '#E8F8FA', text: colors.secondary },
      delivered: { bg: '#E8F8F5', text: colors.success },
      cancelled: { bg: '#FDE8E8', text: colors.accent2 }
    };
    return statusColors[status] || { bg: '#F1F2F6', text: '#636E72' };
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: FiClock,
      accepted: FiClock,
      picked_up: FiPackage,
      on_the_way: FiTruck,
      delivered: FiCheckCircle,
      cancelled: FiX
    };
    return icons[status] || FiClock;
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.orderStatus === filter);

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
          <p style={{ color: colors.textLight }}>Loading your orders...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (orders.length === 0) {
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
            <FiPackage style={{ fontSize: '60px', color: colors.primary }} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.text }}>
            No orders yet
          </h2>
          <p style={{ color: colors.textLight, marginTop: '8px' }}>
            Start shopping to place your first order
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
          <BackButton label="Back" />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.text, marginBottom: '4px' }}>
          My Orders
          <span style={{ 
            fontSize: '14px', 
            fontWeight: '400', 
            color: colors.textLight, 
            marginLeft: '10px' 
          }}>
            ({filteredOrders.length} orders)
          </span>
        </h1>

        {/* Filter Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '20px', 
          flexWrap: 'wrap',
          marginTop: '12px'
        }}>
          {['all', 'pending', 'accepted', 'picked_up', 'on_the_way', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '6px 18px',
                borderRadius: '9999px',
                border: 'none',
                background: filter === status ? colors.primary : colors.primaryLight,
                color: filter === status ? 'white' : colors.textLight,
                cursor: 'pointer',
                fontWeight: filter === status ? '600' : '500',
                fontSize: '13px',
                transition: 'all 0.3s',
                boxShadow: filter === status ? '0 2px 8px rgba(0,91,150,0.2)' : 'none'
              }}
            >
              {status === 'all' ? 'All Orders' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredOrders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.orderStatus);
            const statusStyle = getStatusColor(order.orderStatus);
            const isPendingOrActive = order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled';
            
            return (
              <div 
                key={order._id} 
                style={{
                  background: colors.white,
                  borderRadius: '16px',
                  padding: '16px 20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: `1px solid ${colors.primaryLight}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '600', fontSize: '15px', color: colors.text }}>
                      #{order.orderNumber}
                    </span>
                    <span style={{
                      padding: '2px 12px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: statusStyle.bg,
                      color: statusStyle.text,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <StatusIcon size={13} />
                      {order.orderStatus?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  {/* OTP Display - Only show for pending/active orders with OTP */}
                  {order.deliveryOTP && isPendingOrActive && (
                    <div style={{
                      marginTop: '8px',
                      padding: '8px 12px',
                      background: '#fefcbf',
                      borderRadius: '8px',
                      border: '1px solid #ecc94b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FiLock style={{ color: '#d69e2e', fontSize: '14px' }} />
                      <span style={{ fontSize: '14px', color: '#975a16' }}>
                        🔑 Delivery OTP: <strong style={{ fontSize: '16px', letterSpacing: '4px' }}>{order.deliveryOTP}</strong>
                        <span style={{ fontSize: '12px', marginLeft: '8px', color: '#975a16' }}>
                          (Share this with delivery agent)
                        </span>
                      </span>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap', fontSize: '13px', color: colors.textLight }}>
                    <span>{order.items?.length || 0} items</span>
                    <span>
                      <FiClock style={{ display: 'inline', marginRight: '4px', fontSize: '13px' }} />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontWeight: '700', color: colors.primary, fontSize: '18px' }}>
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Orders;