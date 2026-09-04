import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiCheckCircle, FiClock, FiStar, FiCalendar, FiDollarSign,
  FiTruck, FiPackage, FiArrowLeft, FiSearch
} from 'react-icons/fi';

const DeliveryHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ 
    total: 0, 
    totalEarnings: 0, 
    avgRating: 0,
    totalDistance: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/delivery/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const delivered = response.data.orders?.filter(o => o.orderStatus === 'delivered') || [];
      setOrders(delivered);

      const totalEarnings = delivered.reduce((sum, o) => sum + (o.deliveryCharge || 0), 0);
      const totalDistance = delivered.reduce((sum, o) => sum + (o.deliveryDistance || 0), 0);
      
      setStats({
        total: delivered.length,
        totalEarnings: totalEarnings,
        avgRating: 4.5, // This could come from actual ratings
        totalDistance: totalDistance
      });
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load delivery history');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/delivery/dashboard')}
              style={{
                padding: '8px 16px',
                background: '#e2e8f0',
                color: '#4a5568',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <FiArrowLeft /> Back
            </button>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: '#2d3748' }}>📋 Delivery History</h1>
          </div>
          <span style={{ fontSize: '14px', color: '#718096' }}>
            {stats.total} deliveries completed
          </span>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Total Deliveries', value: stats.total, icon: FiTruck, color: '#3182ce', bg: '#ebf8ff' },
            { label: 'Total Earnings', value: `₹${stats.totalEarnings}`, icon: FiDollarSign, color: '#48bb78', bg: '#f0fff4' },
            { label: 'Avg Rating', value: stats.avgRating.toFixed(1), icon: FiStar, color: '#d69e2e', bg: '#fffff0' },
            { label: 'Total Distance', value: `${stats.totalDistance.toFixed(1)} km`, icon: FiPackage, color: '#805ad5', bg: '#faf5ff' }
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

        {/* Search */}
        <div style={{
          position: 'relative',
          marginBottom: '16px'
        }}>
          <FiSearch style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#a0aec0'
          }} />
          <input
            type="text"
            placeholder="Search by order number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              border: '2px solid #e2e8f0',
              borderRadius: '16px',
              fontSize: '16px',
              outline: 'none',
              background: 'white',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#48bb78'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* History List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '12px'
        }}>
          {filteredOrders.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '60px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <FiCheckCircle style={{ fontSize: '48px', color: '#a0aec0', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', color: '#2d3748', marginBottom: '8px' }}>No delivery history</h3>
              <p style={{ color: '#718096' }}>
                {searchTerm ? 'No results found for your search.' : 'You haven\'t completed any deliveries yet.'}
              </p>
            </div>
          ) : (
            filteredOrders.map(order => {
              const deliveryAddress = order.deliveryAddress ? JSON.parse(order.deliveryAddress) : {};
              
              return (
                <div key={order.id} style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '600', color: '#2d3748' }}>
                        #{order.orderNumber}
                      </span>
                      <span style={{
                        padding: '2px 12px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: '#c6f6d5',
                        color: '#276749'
                      }}>
                        ✅ Delivered
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', color: '#718096' }}>
                        {deliveryAddress?.city || 'N/A'}
                      </span>
                      <span style={{ fontSize: '14px', color: '#718096' }}>
                        <FiCalendar style={{ display: 'inline', marginRight: '4px' }} />
                        {new Date(order.actualDeliveryTime || order.createdAt).toLocaleDateString()}
                      </span>
                      <span style={{ fontSize: '14px', color: '#718096' }}>
                        <FiClock style={{ display: 'inline', marginRight: '4px' }} />
                        {new Date(order.actualDeliveryTime || order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: '#48bb78' }}>
                      ₹{order.totalAmount}
                    </div>
                    <div style={{ fontSize: '13px', color: '#a0aec0' }}>
                      {order.deliveryDistance?.toFixed(1) || 0} km • {order.items?.length || 0} items
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
                      {[1,2,3,4,5].map(i => (
                        <FiStar key={i} style={{
                          color: '#ecc94b',
                          fill: i <= 4.5 ? '#ecc94b' : 'none',
                          fontSize: '14px'
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Back to Dashboard */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link to="/delivery/dashboard" style={{
            padding: '12px 32px',
            background: '#48bb78',
            color: 'white',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600',
            display: 'inline-block',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#38a169'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#48bb78'}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeliveryHistory;