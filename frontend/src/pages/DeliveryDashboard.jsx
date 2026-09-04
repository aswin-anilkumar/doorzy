import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { 
  FiTruck, FiPackage, FiCheckCircle, FiClock, FiMapPin, 
  FiUser, FiStar, FiCalendar, FiDollarSign,
  FiChevronRight, FiRefreshCw, FiCheck, FiX,
  FiLogOut, FiLock
} from 'react-icons/fi';

const DeliveryDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    total: 0, 
    pending: 0, 
    inProgress: 0, 
    completed: 0,
    earnings: 0
  });
  const [agentProfile, setAgentProfile] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [availability, setAvailability] = useState('available');
  const [otpInput, setOtpInput] = useState('');

  // Helper function to safely parse delivery address
  const getDeliveryAddress = (order) => {
    if (!order || !order.deliveryAddress) return {};
    if (typeof order.deliveryAddress === 'string') {
      try {
        return JSON.parse(order.deliveryAddress);
      } catch (e) {
        console.error('Error parsing delivery address:', e);
        return {};
      }
    }
    return order.deliveryAddress;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/delivery/orders', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/delivery/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const deliveredOrders = ordersRes.data.orders || [];
      setOrders(deliveredOrders);

      const agentData = statsRes.data.agent || {};
      setAgentProfile(agentData);
      setAvailability(agentData.availabilityStatus || 'available');

      const total = deliveredOrders.length;
      const pending = deliveredOrders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'accepted').length;
      const inProgress = deliveredOrders.filter(o => o.orderStatus === 'picked_up' || o.orderStatus === 'on_the_way').length;
      const completed = deliveredOrders.filter(o => o.orderStatus === 'delivered').length;
      const earnings = agentData.totalEarnings || 0;

      setStats({ total, pending, inProgress, completed, earnings });
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Delivery agent access required');
        navigate('/');
      } else {
        toast.error('Failed to load orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const updateOrderStatus = async (orderId, status) => {
    if (!orderId) {
      toast.error('Order ID is missing');
      return;
    }

    // If status is 'delivered', OTP is required
    if (status === 'delivered') {
      if (!otpInput || otpInput.length !== 4) {
        toast.error('Please enter the 4-digit OTP from customer');
        return;
      }
    }

    const token = localStorage.getItem('token');
    setUpdatingStatus(true);
    try {
      const payload = { status };
      if (status === 'delivered') {
        payload.otp = otpInput;
      }

      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Order ${status.replace('_', ' ')} updated!`);
      setOtpInput('');
      fetchData();
      setShowOrderModal(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update order status';
      toast.error(message);
      console.error('Status update error:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const updateAvailability = async (status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/delivery/status', 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAvailability(status);
      toast.success(`Status updated to ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#fefcbf', text: '#975a16', icon: FiClock },
      accepted: { bg: '#bee3f8', text: '#2a69ac', icon: FiCheckCircle },
      picked_up: { bg: '#e9d8fd', text: '#6b46c1', icon: FiPackage },
      on_the_way: { bg: '#c3dafe', text: '#2a69ac', icon: FiTruck },
      delivered: { bg: '#c6f6d5', text: '#276749', icon: FiCheckCircle },
      cancelled: { bg: '#fed7d7', text: '#9b2c2c', icon: FiX }
    };
    return colors[status] || colors.pending;
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.orderStatus === filterStatus);

  // Handle OTP input change - only allow numbers
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setOtpInput(value);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: '#2d3748' }}>🚚 Delivery Dashboard</h1>
            <p style={{ color: '#718096', fontSize: '14px' }}>Manage your assigned deliveries</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#fc8181',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiLogOut /> Logout
          </button>
        </div>

        {/* Availability Status */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              display: 'inline-block', 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%',
              background: availability === 'available' ? '#48bb78' : 
                         availability === 'busy' ? '#ecc94b' : '#a0aec0'
            }}></span>
            <span style={{ fontWeight: '600', color: '#2d3748' }}>
              Status: <span style={{ 
                color: availability === 'available' ? '#48bb78' : 
                       availability === 'busy' ? '#d69e2e' : '#718096'
              }}>
                {availability.toUpperCase()}
              </span>
            </span>
            <span style={{ fontSize: '14px', color: '#718096' }}>
              {availability === 'available' ? '✅ Ready to accept orders' : 
               availability === 'busy' ? '⏳ Currently delivering' : '⛔ Offline'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => updateAvailability('available')}
              style={{
                padding: '8px 16px',
                background: availability === 'available' ? '#48bb78' : '#e2e8f0',
                color: availability === 'available' ? 'white' : '#4a5568',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: availability === 'available' ? '600' : '500'
              }}
            >
              ✅ Available
            </button>
            <button
              onClick={() => updateAvailability('busy')}
              style={{
                padding: '8px 16px',
                background: availability === 'busy' ? '#ecc94b' : '#e2e8f0',
                color: availability === 'busy' ? 'white' : '#4a5568',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: availability === 'busy' ? '600' : '500'
              }}
            >
              ⏳ Busy
            </button>
            <button
              onClick={() => updateAvailability('offline')}
              style={{
                padding: '8px 16px',
                background: availability === 'offline' ? '#a0aec0' : '#e2e8f0',
                color: availability === 'offline' ? 'white' : '#4a5568',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: availability === 'offline' ? '600' : '500'
              }}
            >
              ⛔ Offline
            </button>
            <button
              onClick={fetchData}
              style={{
                padding: '8px 16px',
                background: '#ebf8ff',
                color: '#3182ce',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Total Orders', value: stats.total, icon: FiPackage, color: '#3182ce', bg: '#ebf8ff' },
            { label: 'Pending', value: stats.pending, icon: FiClock, color: '#d69e2e', bg: '#fffff0' },
            { label: 'In Progress', value: stats.inProgress, icon: FiTruck, color: '#805ad5', bg: '#faf5ff' },
            { label: 'Completed', value: stats.completed, icon: FiCheckCircle, color: '#48bb78', bg: '#f0fff4' },
            { label: 'Earnings', value: `₹${stats.earnings}`, icon: FiDollarSign, color: '#38a169', bg: '#f0fff4' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'white',
              padding: '16px 20px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: stat.bg,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon style={{ fontSize: '20px', color: stat.color }} />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#a0aec0' }}>{stat.label}</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748' }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}>
          {['all', 'pending', 'accepted', 'picked_up', 'on_the_way', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                border: 'none',
                background: filterStatus === status ? '#48bb78' : '#e2e8f0',
                color: filterStatus === status ? 'white' : '#4a5568',
                cursor: 'pointer',
                fontWeight: filterStatus === status ? '600' : '500',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
            >
              {status === 'all' ? '📋 All' : status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px'
        }}>
          {filteredOrders.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '60px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <FiPackage style={{ fontSize: '48px', color: '#a0aec0', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', color: '#2d3748', marginBottom: '8px' }}>No orders found</h3>
              <p style={{ color: '#718096' }}>
                {filterStatus === 'all' 
                  ? 'You don\'t have any assigned orders yet.' 
                  : `No ${filterStatus.replace('_', ' ')} orders.`}
              </p>
            </div>
          ) : (
            filteredOrders.map(order => {
              const statusStyle = getStatusColor(order.orderStatus);
              const StatusIcon = statusStyle.icon;
              const deliveryAddress = getDeliveryAddress(order);
              const isPendingOrActive = order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled';

              return (
                <div key={order._id} style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#48bb78';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f0f0f0';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                }}
                onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: '600', color: '#2d3748' }}>
                          Order #{order.orderNumber}
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: statusStyle.bg,
                          color: statusStyle.text,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <StatusIcon size={14} />
                          {order.orderStatus.replace('_', ' ').toUpperCase()}
                        </span>
                        {isPendingOrActive && (
                          <span style={{
                            padding: '2px 10px',
                            borderRadius: '9999px',
                            fontSize: '11px',
                            fontWeight: '600',
                            background: '#fefcbf',
                            color: '#975a16'
                          }}>
                            🔑 Ask Customer for OTP
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '14px', color: '#718096' }}>
                          <FiUser style={{ display: 'inline', marginRight: '4px' }} />
                          {order.userId?.name || 'Customer'}
                        </span>
                        <span style={{ fontSize: '14px', color: '#718096' }}>
                          <FiMapPin style={{ display: 'inline', marginRight: '4px' }} />
                          {deliveryAddress?.city || 'N/A'}
                        </span>
                        <span style={{ fontSize: '14px', color: '#718096' }}>
                          <FiCalendar style={{ display: 'inline', marginRight: '4px' }} />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ marginTop: '8px', display: 'flex', gap: '16px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#48bb78' }}>
                          ₹{order.totalAmount}
                        </span>
                        <span style={{ fontSize: '14px', color: '#a0aec0' }}>
                          {order.items?.length || 0} items
                        </span>
                        <span style={{ fontSize: '14px', color: '#a0aec0' }}>
                          {order.deliveryDistance?.toFixed(1) || 0} km
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#a0aec0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiChevronRight />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Agent Profile Summary */}
        {agentProfile && (
          <div style={{
            marginTop: '24px',
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h4 style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>Your Profile</h4>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px', color: '#2d3748' }}>
                  🚗 {agentProfile.vehicleType || 'Motorcycle'}
                </span>
                <span style={{ fontSize: '14px', color: '#2d3748' }}>
                  ⭐ {agentProfile.rating?.toFixed(1) || 'New'}
                </span>
                <span style={{ fontSize: '14px', color: '#2d3748' }}>
                  📦 {agentProfile.totalDeliveries || 0} deliveries
                </span>
              </div>
            </div>
            <Link to="/delivery/history" style={{
              padding: '8px 20px',
              background: '#48bb78',
              color: 'white',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              View History →
            </Link>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', color: '#2d3748' }}>
                Order #{selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => { setShowOrderModal(false); setSelectedOrder(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#a0aec0'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#a0aec0' }}>Customer</p>
                <p style={{ fontWeight: '600', color: '#2d3748' }}>{selectedOrder.userId?.name || 'N/A'}</p>
                <p style={{ fontSize: '14px', color: '#718096' }}>{selectedOrder.userId?.phone || 'N/A'}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#a0aec0' }}>Status</p>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: '600',
                  background: getStatusColor(selectedOrder.orderStatus).bg,
                  color: getStatusColor(selectedOrder.orderStatus).text
                }}>
                  {selectedOrder.orderStatus.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* OTP Section - Agent does NOT see the OTP */}
            {selectedOrder.orderStatus !== 'delivered' && selectedOrder.orderStatus !== 'cancelled' && (
              <div style={{
                marginBottom: '20px',
                padding: '12px 16px',
                background: '#fefcbf',
                borderRadius: '12px',
                border: '1px solid #ecc94b'
              }}>
                <p style={{ fontSize: '14px', color: '#975a16' }}>
                  <FiLock style={{ display: 'inline', marginRight: '8px', color: '#d69e2e' }} />
                  🔑 <strong>Ask customer for the 4-digit OTP</strong>
                  <span style={{ fontSize: '12px', marginLeft: '8px', color: '#975a16' }}>
                    (Customer can see it in their Orders page)
                  </span>
                </p>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: '#a0aec0', marginBottom: '4px' }}>Delivery Address</p>
              <div style={{
                background: '#f7fafc',
                padding: '12px 16px',
                borderRadius: '12px'
              }}>
                <p style={{ color: '#2d3748' }}>
                  {getDeliveryAddress(selectedOrder)?.addressLine1 || 'No address provided'}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: '#a0aec0', marginBottom: '4px' }}>Order Items</p>
              <div style={{
                background: '#f7fafc',
                padding: '12px 16px',
                borderRadius: '12px'
              }}>
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '4px 0',
                    borderBottom: index < selectedOrder.items.length - 1 ? '1px solid #e2e8f0' : 'none'
                  }}>
                    <span style={{ color: '#2d3748' }}>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: '600', color: '#48bb78' }}>₹{item.total}</span>
                  </div>
                ))}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  marginTop: '8px',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <span style={{ fontWeight: '600', color: '#2d3748' }}>Total</span>
                  <span style={{ fontWeight: '700', color: '#48bb78' }}>₹{selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: '#a0aec0', marginBottom: '8px' }}>Update Status</p>
              
              {/* OTP Input - required for delivered */}
              {selectedOrder.orderStatus !== 'delivered' && selectedOrder.orderStatus !== 'cancelled' && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    background: '#fefcbf',
                    borderRadius: '8px',
                    border: '1px solid #ecc94b'
                  }}>
                    <FiLock style={{ color: '#d69e2e' }} />
                    <span style={{ fontSize: '14px', color: '#975a16' }}>
                      Enter the OTP provided by the customer to mark as <strong>DELIVERED</strong>
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 4-digit OTP from customer"
                    value={otpInput}
                    onChange={handleOtpChange}
                    maxLength="4"
                    style={{
                      width: '100%',
                      maxWidth: '280px',
                      padding: '10px 14px',
                      marginTop: '8px',
                      border: `2px solid ${otpInput.length === 4 ? '#48bb78' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      letterSpacing: '8px',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#48bb78';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(72,187,120,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = otpInput.length === 4 ? '#48bb78' : '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <span style={{ fontSize: '12px', color: '#718096', marginLeft: '8px' }}>
                    {otpInput.length}/4 digits
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['accepted', 'picked_up', 'on_the_way', 'delivered', 'cancelled'].map(status => {
                  const isActive = selectedOrder.orderStatus === status;
                  const isDeliveredDisabled = status === 'delivered' && otpInput.length !== 4;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder._id, status)}
                      disabled={updatingStatus || isActive || isDeliveredDisabled}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isActive ? '#48bb78' : 
                                   isDeliveredDisabled && status === 'delivered' ? '#e2e8f0' : '#e2e8f0',
                        color: isActive ? 'white' : 
                               isDeliveredDisabled && status === 'delivered' ? '#a0aec0' : '#4a5568',
                        cursor: isActive || isDeliveredDisabled ? 'default' : 'pointer',
                        fontWeight: isActive ? '600' : '500',
                        fontSize: '13px',
                        opacity: isActive ? 1 : 0.7
                      }}
                    >
                      {status.replace('_', ' ').toUpperCase()}
                      {isActive && ' ✅'}
                      {isDeliveredDisabled && status === 'delivered' && ' (Enter OTP)'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p style={{ fontSize: '13px', color: '#a0aec0', marginBottom: '8px' }}>Timeline</p>
              <div style={{
                background: '#f7fafc',
                padding: '12px 16px',
                borderRadius: '12px'
              }}>
                {selectedOrder.statusHistory?.map((history, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '4px 0',
                    borderBottom: index < selectedOrder.statusHistory.length - 1 ? '1px solid #e2e8f0' : 'none'
                  }}>
                    <span style={{ fontSize: '13px', color: '#718096', minWidth: '120px' }}>
                      {new Date(history.timestamp).toLocaleString()}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#2d3748' }}>
                      {history.status.replace('_', ' ').toUpperCase()}
                    </span>
                    {history.note && (
                      <span style={{ fontSize: '13px', color: '#718096' }}>- {history.note}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={() => { setShowOrderModal(false); setSelectedOrder(null); }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#e2e8f0',
                  color: '#4a5568',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;