import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiShoppingBag, 
  FiTruck, 
  FiShield, 
  FiUsers, 
  FiArrowRight, 
  FiMapPin, 
  FiClock, 
  FiStar,
  FiSearch,
  FiMenu,
  FiX,
  FiCheck,
  FiAward
} from 'react-icons/fi';

const Landing = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Color palette - Peacock Blue Theme
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

  useEffect(() => {
    fetchShops();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  const fetchShops = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/shops');
      setShops(response.data.shops || []);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop =>
    shop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShopClick = (shopId) => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/user/shop/${shopId}`);
    } else {
      navigate('/login');
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      const role = user?.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'delivery_agent') navigate('/delivery/dashboard');
      else navigate('/user/home');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: FiShoppingBag,
      title: 'Local Shopping',
      desc: 'Support local businesses and discover unique products in your neighborhood',
      color: colors.primary,
      bg: colors.primaryLight
    },
    {
      icon: FiTruck,
      title: 'Fast Delivery',
      desc: 'Get your orders delivered quickly with our smart logistics network',
      color: colors.secondary,
      bg: '#E8F8FA'
    },
    {
      icon: FiShield,
      title: 'Secure Payments',
      desc: 'Multiple payment options with 100% secure transactions and buyer protection',
      color: '#6C5CE7',
      bg: '#F3E8FF'
    },
    {
      icon: FiUsers,
      title: 'Real-time Tracking',
      desc: 'Track your orders in real-time from shop to doorstep with live updates',
      color: colors.accent,
      bg: '#FEF9E7'
    }
  ];

  const howItWorks = [
    { step: '1', title: 'Find Shops', desc: 'Browse through local shops near you', icon: '📍' },
    { step: '2', title: 'Order Products', desc: 'Add items to your cart and checkout', icon: '🛒' },
    { step: '3', title: 'Get Delivered', desc: 'Receive your order at your doorstep', icon: '🚚' }
  ];

  // Mobile Navigation
  const MobileNav = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '280px',
      background: 'white',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
      zIndex: 1000,
      padding: '24px',
      transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
      overflowY: 'auto'
    }}>
      <button
        onClick={() => setIsMenuOpen(false)}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: colors.text
        }}
      >
        <FiX />
      </button>
      <div style={{ marginTop: '48px' }}>
        <Link to="/" style={{ display: 'block', padding: '12px 0', color: colors.text, textDecoration: 'none', fontWeight: '500' }} onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>
        <a href="#shops" style={{ display: 'block', padding: '12px 0', color: colors.text, textDecoration: 'none', fontWeight: '500' }} onClick={() => setIsMenuOpen(false)}>
          Browse Shops
        </a>
        <a href="#features" style={{ display: 'block', padding: '12px 0', color: colors.text, textDecoration: 'none', fontWeight: '500' }} onClick={() => setIsMenuOpen(false)}>
          Features
        </a>
        {isAuthenticated ? (
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleGetStarted();
            }}
            style={{
              display: 'block',
              width: '100%',
              marginTop: '12px',
              padding: '12px 24px',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Go to Dashboard
          </button>
        ) : (
          <>
            <Link to="/login" style={{ display: 'block', padding: '12px 0', color: colors.primary, textDecoration: 'none', fontWeight: '500' }} onClick={() => setIsMenuOpen(false)}>
              Sign In
            </Link>
            <Link to="/register" style={{
              display: 'block',
              marginTop: '12px',
              padding: '12px 24px',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: '600'
            }} onClick={() => setIsMenuOpen(false)}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </div>
  );

  const Overlay = () => (
    <div
      onClick={() => setIsMenuOpen(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 999,
        display: isMenuOpen ? 'block' : 'none'
      }}
    />
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.bg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden'
    }}>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .fade-in-up { animation: fadeInUp 0.6s ease-out; }
        .float { animation: float 3s ease-in-out infinite; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .desktop-nav { display: flex !important; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Overlay />
      <MobileNav />

      {/* ============ NAVBAR ============ */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.9)',
        backdropFilter: scrolled ? 'blur(10px)' : 'blur(10px)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.3s ease',
        padding: '16px 24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: colors.primary,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🛒 Doorzy
          </Link>

          <div style={{ 
            display: 'none',
            alignItems: 'center',
            gap: '32px'
          }} className="desktop-nav">
            <a href="#features" style={{ color: colors.text, textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>Features</a>
            <a href="#shops" style={{ color: colors.text, textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>Browse Shops</a>
            <a href="#how-it-works" style={{ color: colors.text, textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>How It Works</a>
            
            {isAuthenticated ? (
              <button
                onClick={handleGetStarted}
                style={{
                  padding: '10px 28px',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  color: 'white',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" style={{ color: colors.primary, textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>
                  Sign In
                </Link>
                <Link to="/register" style={{
                  padding: '10px 28px',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  color: 'white',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(true)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: colors.text,
              padding: '8px'
            }}
            className="mobile-menu-btn"
          >
            <FiMenu />
          </button>
        </div>
      </nav>

      {/* ============ HERO SECTION - REMOVED LOCATION & STATS ============ */}
      <section style={{
        paddingTop: '120px',
        paddingBottom: '80px',
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
        }} />

        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.15)',
            padding: '8px 20px',
            borderRadius: '9999px',
            color: 'white',
            fontSize: '14px',
            marginBottom: '24px',
            backdropFilter: 'blur(4px)'
          }}>
            🚀 Discover Local Shopping
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '16px',
            lineHeight: '1.1'
          }}>
            Shop Local,
            <br />
            <span style={{ color: colors.secondary }}>Get Delivered</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: '#f0fff4',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Order from nearby shops and get your products delivered to your doorstep within minutes.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <button
              onClick={handleGetStarted}
              style={{
                padding: '16px 40px',
                background: 'white',
                color: colors.primary,
                borderRadius: '16px',
                border: 'none',
                fontWeight: '700',
                fontSize: '18px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
              }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'} <FiArrowRight />
            </button>
            <a href="#shops" style={{
              padding: '16px 40px',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              borderRadius: '16px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '18px',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
              Browse Shops
            </a>
          </div>

          {/* REMOVED: Stats section with 500+, 10K+, 50K+, 4.8 */}
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section id="features" style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: '700',
            color: colors.text,
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            Why Choose <span style={{ color: colors.primary }}>Doorzy</span>?
          </h2>
          <p style={{
            textAlign: 'center',
            color: colors.textLight,
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto 48px'
          }}>
            The smartest way to shop locally and get delivered instantly
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {features.map((feature, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '32px 24px',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'all 0.3s',
                border: `1px solid ${colors.primaryLight}`,
                cursor: 'default',
                animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = colors.primaryLight;
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: feature.bg,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <feature.icon style={{ fontSize: '28px', color: feature.color }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.text, marginBottom: '8px' }}>
                  {feature.title}
                </h3>
                <p style={{ color: colors.textLight, fontSize: '15px', lineHeight: '1.6' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" style={{ padding: '80px 24px', background: colors.bg }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: '700',
            color: colors.text,
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            How It <span style={{ color: colors.primary }}>Works</span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
            position: 'relative'
          }}>
            {howItWorks.map((item, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '32px 24px',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                position: 'relative',
                border: `1px solid ${colors.primaryLight}`,
                animation: `fadeInUp 0.6s ease-out ${i * 0.1 + 0.3}s both`
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '40px',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  {item.step}
                </div>
                <div style={{ marginTop: '16px', fontSize: '40px', marginBottom: '12px' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.text, marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ color: colors.textLight, fontSize: '15px', lineHeight: '1.6' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BROWSE SHOPS SECTION ============ */}
      <section id="shops" style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            gap: '16px'
          }}>
            <div>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: '700',
                color: colors.text
              }}>
                Browse <span style={{ color: colors.primary }}>Shops</span>
              </h2>
              <p style={{ color: colors.textLight, marginTop: '4px' }}>
                Discover local shops near you
              </p>
            </div>
            <button
              onClick={handleGetStarted}
              style={{
                padding: '12px 24px',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              View All Shops →
            </button>
          </div>

          <div style={{
            position: 'relative',
            marginBottom: '24px'
          }}>
            <FiSearch style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.textLight
            }} />
            <input
              type="text"
              placeholder="Search shops by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                border: `2px solid ${colors.primaryLight}`,
                borderRadius: '16px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s',
                background: colors.bg
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.background = 'white';
                e.target.style.boxShadow = `0 0 0 4px ${colors.primary}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.primaryLight;
                e.target.style.background = colors.bg;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ display: 'inline-block', width: '40px', height: '40px', border: `4px solid ${colors.primaryLight}`, borderTopColor: colors.primary, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '12px', color: colors.textLight }}>Loading shops...</p>
            </div>
          ) : filteredShops.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: colors.bg,
              borderRadius: '16px'
            }}>
              <p style={{ fontSize: '18px', color: colors.textLight }}>No shops found</p>
              <p style={{ color: colors.textLight, marginTop: '4px' }}>Try a different search term</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {filteredShops.slice(0, 6).map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => handleShopClick(shop.id)}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    border: `1px solid ${colors.primaryLight}`,
                    animation: `fadeInUp 0.6s ease-out`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                    e.currentTarget.style.borderColor = colors.primaryLight;
                  }}
                >
                  <div style={{
                    height: '160px',
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '64px',
                    fontWeight: 'bold',
                    color: 'rgba(255,255,255,0.2)'
                  }}>
                    {shop.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.text }}>
                        {shop.name}
                      </h3>
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 12px',
                        background: colors.primaryLight,
                        color: colors.primary,
                        borderRadius: '9999px',
                        fontWeight: '500'
                      }}>
                        {shop.category || 'General'}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: colors.textLight,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: '12px'
                    }}>
                      {shop.description || 'Local shop near you'}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '14px',
                      color: colors.textLight
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiStar style={{ color: colors.accent, fill: colors.accent }} />
                        {shop.rating || 'New'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiMapPin />
                        {shop.address ? 'Nearby' : 'Local'}
                      </span>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: shop.isOpen ? '#E8F8F5' : '#FDE8E8',
                        color: shop.isOpen ? colors.success : colors.accent2
                      }}>
                        {shop.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section style={{
        padding: '80px 24px',
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px'
          }}>
            Ready to Experience Local Shopping?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#c6f6d5',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Join thousands of happy customers who shop locally and get delivered instantly.
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <button
              onClick={handleGetStarted}
              style={{
                padding: '16px 40px',
                background: 'white',
                color: colors.primary,
                borderRadius: '16px',
                border: 'none',
                fontWeight: '700',
                fontSize: '18px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
              }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Now'} <FiArrowRight />
            </button>
            <a href="#shops" style={{
              padding: '16px 40px',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              borderRadius: '16px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '18px',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              Browse Shops
            </a>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer style={{
        background: '#1a202c',
        color: colors.textLight,
        padding: '48px 24px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            marginBottom: '32px'
          }}>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary, marginBottom: '12px' }}>
                🛒 Doorzy
              </h3>
              <p style={{ fontSize: '14px', color: colors.textLight }}>
                Local Shopping & Delivery Platform
              </p>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '12px' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
                <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: colors.textLight, textDecoration: 'none' }}>About Us</a></li>
                <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: colors.textLight, textDecoration: 'none' }}>Careers</a></li>
                <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: colors.textLight, textDecoration: 'none' }}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '12px' }}>Support</h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
                <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: colors.textLight, textDecoration: 'none' }}>Help Center</a></li>
                <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: colors.textLight, textDecoration: 'none' }}>Terms of Service</a></li>
                <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: colors.textLight, textDecoration: 'none' }}>Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '12px' }}>Download App</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button style={{
                  padding: '10px 20px',
                  background: '#2d3748',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  📱 iOS
                </button>
                <button style={{
                  padding: '10px 20px',
                  background: '#2d3748',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  📱 Android
                </button>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid #2d3748',
            paddingTop: '24px',
            textAlign: 'center',
            fontSize: '14px',
            color: colors.textLight
          }}>
            © 2024 Doorzy. All rights reserved. Made with ❤️ for local communities
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;