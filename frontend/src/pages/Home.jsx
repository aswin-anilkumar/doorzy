import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSearch, FiStar, FiChevronRight } from 'react-icons/fi';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const Home = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Categories
  const categories = [
    { name: 'Fresh Produce', icon: '🥬' },
    { name: 'Dairy & Eggs', icon: '🥛' },
    { name: 'Bakery', icon: '🍞' },
    { name: 'Beverages', icon: '🥤' },
    { name: 'Snacks', icon: '🍿' },
    { name: 'Sweets', icon: '🍫' },
    { name: 'Rice & Grains', icon: '🌾' },
    { name: 'Spices & Oils', icon: '🫒' },
    { name: 'Tea & Coffee', icon: '☕' },
    { name: 'Pet Supplies', icon: '🐾' },
  ];

  // Updated Banners - REMOVED delivery time claims
  const banners = [
    {
      title: 'Fresh from Farm to Door',
      description: 'Quality organic fruits & vegetables delivered fresh',
      button: 'Explore Fresh',
      bg: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
      icon: '🌿'
    },
    {
      title: 'Wellness at Your Doorstep',
      description: 'Pharmacy essentials with reliable delivery',
      button: 'Order Now',
      bg: `linear-gradient(135deg, ${colors.secondary}, #007A99)`,
      icon: '💊'
    },
    {
      title: 'Daily Needs Delivered',
      description: 'Groceries, snacks & more - all in one place',
      button: 'Shop Now',
      bg: `linear-gradient(135deg, #6C5CE7, #4834D4)`,
      icon: '🛍️'
    },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/shops');
      setShops(response.data.shops || []);
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredShops = shops.filter(shop =>
    shop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <p style={{ color: colors.textLight }}>Loading NearCart...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
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
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.6s ease-out; }
      `}</style>

      {/* Shared Header */}
      <Header showStats={false} />

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 16px' }}>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <FiSearch style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: colors.textLight
          }} />
          <input
            type="text"
            placeholder='Search for products, shops or categories...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 46px',
              border: `2px solid ${colors.primaryLight}`,
              borderRadius: '14px',
              fontSize: '15px',
              outline: 'none',
              transition: 'all 0.3s',
              background: colors.white
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.boxShadow = `0 0 0 4px ${colors.primary}20`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.primaryLight;
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Promotional Banners - UPDATED with fresh descriptions */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '14px', 
          marginBottom: '24px' 
        }}>
          {banners.map((banner, index) => (
            <div
              key={index}
              style={{
                background: banner.bg,
                borderRadius: '16px',
                padding: '22px 24px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '32px', marginBottom: '4px' }}>{banner.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '2px' }}>
                  {banner.title}
                </h3>
                <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '14px' }}>
                  {banner.description}
                </p>
                <button
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    padding: '8px 20px',
                    borderRadius: '24px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                >
                  {banner.button} →
                </button>
              </div>
              <div style={{
                position: 'absolute',
                right: '-30px',
                top: '-30px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)'
              }} />
            </div>
          ))}
        </div>

        {/* Categories */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: colors.text }}>
              Explore Categories
            </h2>
            <span style={{ fontSize: '13px', color: colors.textLight }}>
              {categories.length} categories
            </span>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
            gap: '12px' 
          }}>
            {categories.map((cat, index) => (
              <div
                key={index}
                style={{
                  background: colors.white,
                  padding: '16px 12px',
                  borderRadius: '14px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: `1px solid ${colors.primaryLight}`,
                  animation: `slideUp 0.5s ease-out ${index * 0.03}s both`
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
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>{cat.icon}</div>
                <div style={{ fontSize: '12px', fontWeight: '500', color: colors.text, lineHeight: '1.3' }}>
                  {cat.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shops Near You */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: colors.text }}>
              🏪 Shops Near You
            </h2>
            <Link to="/shops" style={{
              fontSize: '13px',
              color: colors.primary,
              textDecoration: 'none',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              View All <FiChevronRight size={16} />
            </Link>
          </div>

          {filteredShops.length === 0 ? (
            <div style={{
              background: colors.white,
              borderRadius: '16px',
              padding: '40px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <p style={{ color: colors.textLight }}>No shops found matching your search.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '14px'
            }}>
              {filteredShops.slice(0, 8).map((shop, index) => (
                <Link
                  key={shop._id}
                  to={`/shop/${shop._id}`}
                  style={{
                    background: colors.white,
                    borderRadius: '14px',
                    padding: '16px 12px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.3s',
                    border: `1px solid ${colors.primaryLight}`,
                    textAlign: 'center',
                    animation: `slideUp 0.5s ease-out ${index * 0.05}s both`
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
                    borderRadius: '14px',
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: 'rgba(255,255,255,0.8)'
                  }}>
                    {shop.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>
                    {shop.name}
                  </div>
                  <div style={{ fontSize: '11px', color: colors.textLight, marginTop: '2px' }}>
                    {shop.category}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '6px',
                    fontSize: '11px',
                    color: colors.textLight,
                    flexWrap: 'wrap'
                  }}>
                    <FiStar size={12} style={{ color: colors.accent, fill: colors.accent }} />
                    <span>{shop.rating?.toFixed(1) || 'New'}</span>
                    <span style={{ color: colors.primaryLight }}>•</span>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      fontSize: '10px',
                      fontWeight: '600',
                      background: shop.isOpen ? '#E8F8F5' : '#FDE8E8',
                      color: shop.isOpen ? colors.success : colors.accent2
                    }}>
                      {shop.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shared Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Home;