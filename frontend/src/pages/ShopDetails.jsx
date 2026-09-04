import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FiStar, FiClock, FiMapPin, FiPhone, FiMail, 
  FiChevronLeft, FiShoppingBag, FiPlus, FiMinus,
  FiCheckCircle, FiX, FiTruck
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

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
    fetchShopDetails();
  }, [id]);

  const fetchShopDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/shops/${id}`);
      setShop(response.data.shop);
      setProducts(response.data.products || []);
      const initialQuantities = {};
      (response.data.products || []).forEach(p => {
        initialQuantities[p._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching shop:', error);
      toast.error('Failed to load shop details');
      navigate('/shops');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId, delta) => {
    setQuantities(prev => {
      const newQty = Math.max(1, (prev[productId] || 1) + delta);
      const product = products.find(p => p._id === productId);
      if (product && newQty > product.stock) {
        toast.error('Not enough stock available');
        return prev;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const handleAddToCart = (product) => {
    const qty = quantities[product._id] || 1;
    addToCart({ ...product, id: product._id }, qty);
  };

  const categories = [...new Set(products.map(p => p.category))];
  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory) 
    : products;

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: colors.bg 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: `4px solid ${colors.primaryLight}`, 
            borderTopColor: colors.primary, 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }}></div>
          <p style={{ color: colors.textLight }}>Loading shop details...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!shop) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: colors.bg 
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: colors.textLight }}>Shop not found</p>
          <Link to="/shops" style={{ color: colors.primary, textDecoration: 'none' }}>Back to shops</Link>
        </div>
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <BackButton label="Back to Shops" to="/shops" />
        </div>

        {/* Shop Header */}
        <div style={{
          background: colors.white,
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          marginBottom: '24px',
          border: `1px solid ${colors.primaryLight}`
        }}>
          <div style={{
            height: '200px',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px',
            fontWeight: 'bold',
            color: 'rgba(255,255,255,0.15)'
          }}>
            {shop.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: colors.text }}>
                  {shop.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '14px', color: colors.textLight, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiStar style={{ color: colors.accent }} />
                    {shop.rating?.toFixed(1) || 'New'}
                  </span>
                  <span style={{ fontSize: '14px', color: colors.textLight }}>{shop.category}</span>
                  <span style={{
                    fontSize: '13px',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    background: shop.isOpen ? '#E8F8F5' : '#FDE8E8',
                    color: shop.isOpen ? colors.success : colors.accent2,
                    fontWeight: '600'
                  }}>
                    {shop.isOpen ? '🟢 Open Now' : '🔴 Closed'}
                  </span>
                </div>
                <p style={{ color: colors.textLight, marginTop: '8px', maxWidth: '600px' }}>
                  {shop.description}
                </p>
              </div>
              <div style={{
                background: colors.bg,
                padding: '16px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                color: colors.text,
                minWidth: '180px',
                border: `1px solid ${colors.primaryLight}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <FiMapPin style={{ color: colors.primary }} /> {shop.address || 'No address'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <FiPhone style={{ color: colors.primary }} /> {shop.contactNumber || 'N/A'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiMail style={{ color: colors.primary }} /> {shop.email || 'N/A'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', color: colors.textLight }}>
                  <FiClock /> {shop.openingTime || '09:00'} - {shop.closingTime || '21:00'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: colors.text }}>
              Products
              <span style={{ 
                fontSize: '14px', 
                fontWeight: '400', 
                color: colors.textLight, 
                marginLeft: '10px' 
              }}>
                ({filteredProducts.length})
              </span>
            </h2>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '16px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setSelectedCategory('')}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: !selectedCategory ? colors.primary : colors.primaryLight,
                  color: !selectedCategory ? 'white' : colors.textLight,
                  cursor: 'pointer',
                  fontWeight: !selectedCategory ? '600' : '500',
                  fontSize: '14px',
                  transition: 'all 0.3s',
                  boxShadow: !selectedCategory ? '0 2px 8px rgba(0,91,150,0.2)' : 'none'
                }}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: selectedCategory === cat ? colors.primary : colors.primaryLight,
                    color: selectedCategory === cat ? 'white' : colors.textLight,
                    cursor: 'pointer',
                    fontWeight: selectedCategory === cat ? '600' : '500',
                    fontSize: '14px',
                    transition: 'all 0.3s',
                    boxShadow: selectedCategory === cat ? '0 2px 8px rgba(0,91,150,0.2)' : 'none'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div style={{
              background: colors.white,
              borderRadius: '16px',
              padding: '40px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: `1px solid ${colors.primaryLight}`
            }}>
              <p style={{ color: colors.textLight }}>No products available in this category.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px'
            }}>
              {filteredProducts.map((product, index) => (
                <div 
                  key={product._id} 
                  style={{
                    background: colors.white,
                    borderRadius: '16px',
                    padding: '16px 20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: `1px solid ${colors.primaryLight}`,
                    transition: 'all 0.3s',
                    animation: `slideUp 0.4s ease-out ${index * 0.05}s both`
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: colors.text }}>
                        {product.name}
                      </h4>
                      <p style={{ fontSize: '13px', color: colors.textLight, marginTop: '2px' }}>
                        {product.description || 'No description'}
                      </p>
                    </div>
                    {product.discount > 0 && (
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 10px',
                        borderRadius: '9999px',
                        background: '#FDE8E8',
                        color: colors.accent2,
                        fontWeight: '600'
                      }}>
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: colors.primary }}>
                      ₹{product.price}
                    </span>
                    {product.mrp > product.price && (
                      <span style={{ fontSize: '14px', color: colors.textLight, textDecoration: 'line-through', marginLeft: '8px' }}>
                        ₹{product.mrp}
                      </span>
                    )}
                    <span style={{ fontSize: '13px', color: colors.textLight, marginLeft: '12px' }}>
                      {product.unit}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: product.stock > 0 ? colors.success : colors.accent2, marginTop: '4px' }}>
                    {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
                  </div>
                  {product.stock > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${colors.primaryLight}`, borderRadius: '8px' }}>
                        <button
                          onClick={() => handleQuantityChange(product._id, -1)}
                          style={{
                            padding: '4px 10px',
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
                          <FiMinus />
                        </button>
                        <span style={{ padding: '4px 12px', fontSize: '14px', fontWeight: '600', color: colors.text }}>
                          {quantities[product._id] || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(product._id, 1)}
                          style={{
                            padding: '4px 10px',
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
                          <FiPlus />
                        </button>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        style={{
                          padding: '8px 16px',
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          flex: 1,
                          transition: 'all 0.3s',
                          boxShadow: '0 2px 8px rgba(0,91,150,0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,91,150,0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,91,150,0.2)';
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ShopDetails;