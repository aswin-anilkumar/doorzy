import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiPackage, FiClock, FiCheckCircle, FiTruck, FiX, FiMapPin, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      navigate('/user/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-purple-100 text-purple-800',
      on_the_way: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <p>Order not found</p>
        <Link to="/user/orders">Back to Orders</Link>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(order.orderStatus);
  const deliveryAddress = order.deliveryAddress ? JSON.parse(order.deliveryAddress) : {};

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#4a5568',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '16px',
          padding: '8px 12px',
          borderRadius: '8px',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <FiArrowLeft /> Back
      </button>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748', marginBottom: '24px' }}>
        Order #{order.orderNumber}
      </h1>

      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #f0f0f0',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <p style={{ fontSize: '13px', color: '#a0aec0' }}>Order Status</p>
            <span style={{
              padding: '4px 14px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: '600',
              background: getStatusColor(order.orderStatus)
            }}>
              <StatusIcon style={{ display: 'inline', marginRight: '4px' }} />
              {order.orderStatus?.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#a0aec0' }}>Order Date</p>
            <p style={{ fontWeight: '500', color: '#2d3748' }}>
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', color: '#a0aec0' }}>Delivery Address</p>
          <div style={{
            background: '#f7fafc',
            padding: '12px 16px',
            borderRadius: '12px',
            marginTop: '4px'
          }}>
            <p style={{ color: '#2d3748' }}>
              {deliveryAddress.name && <><strong>{deliveryAddress.name}</strong><br /></>}
              {deliveryAddress.addressLine1}<br />
              {deliveryAddress.addressLine2 && <>{deliveryAddress.addressLine2}<br /></>}
              {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}
              {deliveryAddress.landmark && <><br />Landmark: {deliveryAddress.landmark}</>}
            </p>
          </div>
        </div>

        <div>
          <p style={{ fontSize: '13px', color: '#a0aec0' }}>Order Items</p>
          <div style={{
            background: '#f7fafc',
            padding: '12px 16px',
            borderRadius: '12px',
            marginTop: '4px'
          }}>
            {order.items?.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: index < order.items.length - 1 ? '1px solid #e2e8f0' : 'none'
              }}>
                <span style={{ color: '#2d3748' }}>
                  {item.name} × {item.quantity}
                </span>
                <span style={{ fontWeight: '600', color: '#48bb78' }}>₹{item.total}</span>
              </div>
            ))}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '8px',
              marginTop: '8px',
              borderTop: '2px solid #e2e8f0'
            }}>
              <span style={{ fontWeight: '600', color: '#2d3748' }}>Subtotal</span>
              <span style={{ fontWeight: '600', color: '#2d3748' }}>₹{order.subtotal}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 0'
            }}>
              <span style={{ color: '#718096' }}>Delivery Charge</span>
              <span style={{ color: '#718096' }}>₹{order.deliveryCharge}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '8px',
              marginTop: '8px',
              borderTop: '2px solid #e2e8f0'
            }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2d3748' }}>Total</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#48bb78' }}>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #f0f0f0'
      }}>
        <p style={{ fontSize: '13px', color: '#a0aec0', marginBottom: '12px' }}>Order Timeline</p>
        {order.statusHistory?.map((history, index) => (
          <div key={index} style={{
            display: 'flex',
            gap: '16px',
            padding: '8px 0',
            borderBottom: index < order.statusHistory.length - 1 ? '1px solid #f0f0f0' : 'none'
          }}>
            <span style={{ fontSize: '13px', color: '#718096', minWidth: '140px' }}>
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
  );
};

export default OrderDetails;