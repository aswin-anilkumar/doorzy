import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FiSearch, FiStar, FiMapPin, FiClock, FiFilter,
  FiGrid, FiList, FiChevronLeft
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [userLocation, setUserLocation] = useState(null);

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

  const categories = ['All', 'Grocery', 'Electronics', 'Clothing', 'Pharmacy', 'Restaurant', 'Stationery', 'Hardware', 'Other'];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {}
      );
    }
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(category && category !== 'All' && { category }),
        ...(userLocation && {
          latitude: userLocation.lat,
          longitude: userLocation.lng
        })
      };
      const response = await axios.get('http://localhost:5000/api/shops', { params });
      setShops(response.data.shops || []);
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchShops, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, category, userLocation]);

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
          <p style={{ color: colors.textLight }}>Loading shops...</p>
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
    <div style={{ minHeight: '100vh', background: colors.bg, padding: '16px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <Link to="/" style={{
            padding: '10px',
            background: colors.white,
            borderRadius: '12px',
            color: colors.text,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: `1px solid ${colors.primaryLight}`,
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
            <FiChevronLeft size={18} />
          </Link>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: '700', color: colors.text }}>
            🏪 All Shops
          </h1>
          <span style={{ fontSize: '14px', color: colors.textLight, marginLeft: 'auto' }}>
            {shops.length} shop{shops.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Filters */}
        <div style={{
          background: colors.white,
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: `1px solid ${colors.primaryLight}`
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
                <FiSearch style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: colors.textLight
                }} />
                <input
                  type="text"
                  placeholder="Search shops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: `2px solid ${colors.primaryLight}`,
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    background: colors.bg
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.background = colors.white;
                    e.currentTarget.style.boxShadow = `0 0 0 4px ${colors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.primaryLight;
                    e.currentTarget.style.background = colors.bg;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <FiFilter style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: colors.textLight
                  }} />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      padding: '10px 12px 10px 36px',
                      border: `2px solid ${colors.primaryLight}`,
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      background: colors.white,
                      appearance: 'none',
                      minWidth: '140px',
                      color: colors.text,
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = colors.primary;
                      e.currentTarget.style.boxShadow = `0 0 0 4px ${colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = colors.primaryLight;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '4px', border: `2px solid ${colors.primaryLight}`, borderRadius: '12px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '8px 12px',
                      background: viewMode === 'grid' ? colors.primary : 'transparent',
                      color: viewMode === 'grid' ? 'white' : colors.textLight,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '8px 12px',
                      background: viewMode === 'list' ? colors.primary : 'transparent',
                      color: viewMode === 'list' ? 'white' : colors.textLight,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <FiList size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shops Grid */}
        {shops.length === 0 ? (
          <div style={{
            background: colors.white,
            borderRadius: '16px',
            padding: '60px 20px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: `1px solid ${colors.primaryLight}`
          }}>
            <p style={{ color: colors.textLight }}>No shops found matching your criteria.</p>
          </div>
        ) : (
          <div style={{
            display: viewMode === 'grid' 
              ? 'grid' 
              : 'flex',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'none',
            flexDirection: viewMode === 'list' ? 'column' : 'none',
            gap: '16px'
          }}>
            {shops.map((shop, index) => (
              <Link 
                key={shop._id} 
                to={`/shop/${shop._id}`} 
                style={{
                  background: colors.white,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s',
                  border: `1px solid ${colors.primaryLight}`,
                  display: viewMode === 'list' ? 'flex' : 'block',
                  flexDirection: viewMode === 'list' ? 'row' : 'column',
                  alignItems: viewMode === 'list' ? 'center' : 'stretch',
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
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
                  height: viewMode === 'list' ? '120px' : '140px',
                  width: viewMode === 'list' ? '120px' : '100%',
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: viewMode === 'list' ? '32px' : '48px',
                  fontWeight: 'bold',
                  color: 'rgba(255,255,255,0.3)'
                }}>
                  {shop.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{
                  padding: viewMode === 'list' ? '16px 20px' : '16px 20px',
                  flex: 1
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <h3 style={{ fontSize: viewMode === 'list' ? '18px' : '16px', fontWeight: '600', color: colors.text }}>
                      {shop.name}
                    </h3>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      fontWeight: '600',
                      background: shop.isOpen ? '#E8F8F5' : '#FDE8E8',
                      color: shop.isOpen ? colors.success : colors.accent2
                    }}>
                      {shop.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  {viewMode === 'list' ? (
                    <>
                      <p style={{ fontSize: '14px', color: colors.textLight, marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {shop.description || 'Local shop near you'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', color: colors.textLight, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiStar style={{ color: colors.accent }} />
                          {shop.rating?.toFixed(1) || 'New'}
                        </span>
                        <span style={{ fontSize: '13px', color: colors.textLight }}>{shop.category}</span>
                        <span style={{ fontSize: '13px', color: colors.textLight }}>{shop.distance?.toFixed(1) || '0'} km</span>
                        <span style={{ fontSize: '13px', color: colors.textLight, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiClock size={13} />
                          {shop.openingTime || '09:00'} - {shop.closingTime || '21:00'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '13px', color: colors.textLight, marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {shop.description || 'Local shop near you'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: colors.textLight, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiStar style={{ color: colors.accent }} />
                          {shop.rating?.toFixed(1) || 'New'}
                        </span>
                        <span style={{ fontSize: '12px', color: colors.textLight }}>{shop.category}</span>
                        <span style={{ fontSize: '12px', color: colors.textLight }}>{shop.distance?.toFixed(1) || '0'} km</span>
                        <span style={{ fontSize: '12px', color: colors.textLight, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiClock size={12} />
                          {shop.openingTime || '09:00'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Add fadeInUp animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ShopList;