import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUpload, FiDownload, FiFile, FiCheck, FiX, FiPackage, FiRefreshCw, FiUserPlus, FiTruck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // States
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shops, setShops] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [deliveryAgents, setDeliveryAgents] = useState([]);
    const [showShopModal, setShowShopModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showAgentModal, setShowAgentModal] = useState(false);
    const [editingShop, setEditingShop] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [selectedShopForImport, setSelectedShopForImport] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Delivery Agent Form
    const [agentForm, setAgentForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        vehicleType: 'motorcycle',
        vehicleNumber: ''
    });

    // Form states
    const [shopForm, setShopForm] = useState({
        name: '', description: '', category: 'Grocery', address: '',
        latitude: '', longitude: '', contactNumber: '', email: '',
        deliveryRadius: 10, deliveryChargePerKm: 10, isOpen: true
    });

    const [productForm, setProductForm] = useState({
        name: '', description: '', category: 'Groceries', shopId: '',
        price: '', mrp: '', stock: '', unit: 'piece'
    });

    const categories = ['Grocery', 'Electronics', 'Clothing', 'Pharmacy', 'Restaurant', 'Stationery', 'Hardware', 'Other'];
    const productCategories = ['Groceries', 'Electronics', 'Clothing', 'Pharmacy', 'Food', 'Stationery', 'Hardware', 'Other'];
    const units = ['piece', 'kg', 'gram', 'liter', 'ml', 'pack', 'box'];
    const vehicleTypes = ['motorcycle', 'scooter', 'car', 'bicycle', 'van'];

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
            const [dashboardRes, shopsRes, productsRes, ordersRes, agentsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/shops'),
                axios.get('http://localhost:5000/api/products'),
                axios.get('http://localhost:5000/api/admin/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/admin/agents', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setStats(dashboardRes.data.stats);
            setShops(shopsRes.data.shops || []);
            setProducts(productsRes.data.products || []);
            setOrders(ordersRes.data.orders || []);
            setDeliveryAgents(agentsRes.data.agents || []);
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error('Admin access required');
                navigate('/');
            } else {
                toast.error('Failed to load data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // ============ DELIVERY AGENT CRUD ============

    const handleCreateAgent = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                'http://localhost:5000/api/admin/agents',
                agentForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Delivery Agent ${agentForm.name} created successfully!`);
            setShowAgentModal(false);
            resetAgentForm();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create delivery agent');
        }
    };

    const resetAgentForm = () => {
        setAgentForm({
            name: '',
            email: '',
            phone: '',
            password: '',
            vehicleType: 'motorcycle',
            vehicleNumber: ''
        });
    };

    // ============ SHOP CRUD ============

    const handleAddShop = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const data = {
                ...shopForm,
                latitude: parseFloat(shopForm.latitude) || 0,
                longitude: parseFloat(shopForm.longitude) || 0
            };
            const response = await axios.post('http://localhost:5000/api/shops', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Shop added successfully!');
            setShops([...shops, response.data.shop]);
            setShowShopModal(false);
            resetShopForm();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add shop');
        }
    };

    const handleEditShop = (shop) => {
        setEditingShop(shop);
        setShopForm({
            name: shop.name,
            description: shop.description || '',
            category: shop.category || 'Grocery',
            address: shop.address || '',
            latitude: shop.latitude || '',
            longitude: shop.longitude || '',
            contactNumber: shop.contactNumber || '',
            email: shop.email || '',
            deliveryRadius: shop.deliveryRadius || 10,
            deliveryChargePerKm: shop.deliveryChargePerKm || 10,
            isOpen: shop.isOpen !== undefined ? shop.isOpen : true
        });
        setShowShopModal(true);
    };

    const handleUpdateShop = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const data = {
                ...shopForm,
                latitude: parseFloat(shopForm.latitude) || 0,
                longitude: parseFloat(shopForm.longitude) || 0
            };
            await axios.put(`http://localhost:5000/api/shops/${editingShop._id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Shop updated successfully!');
            setShowShopModal(false);
            setEditingShop(null);
            resetShopForm();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update shop');
        }
    };

    const handleDeleteShop = async (id) => {
        if (!window.confirm('Are you sure you want to delete this shop?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/shops/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Shop deleted successfully!');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete shop');
        }
    };

    const resetShopForm = () => {
        setShopForm({
            name: '', description: '', category: 'Grocery', address: '',
            latitude: '', longitude: '', contactNumber: '', email: '',
            deliveryRadius: 10, deliveryChargePerKm: 10, isOpen: true
        });
    };

    // ============ PRODUCT CRUD ============

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const data = {
                ...productForm,
                price: parseFloat(productForm.price),
                mrp: parseFloat(productForm.mrp),
                stock: parseInt(productForm.stock)
            };
            const response = await axios.post('http://localhost:5000/api/products', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Product added successfully!');
            setProducts([...products, response.data.product]);
            setShowProductModal(false);
            resetProductForm();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add product');
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            description: product.description || '',
            category: product.category || 'Groceries',
            shopId: product.shopId,
            price: product.price,
            mrp: product.mrp,
            stock: product.stock,
            unit: product.unit || 'piece'
        });
        setShowProductModal(true);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const data = {
                ...productForm,
                price: parseFloat(productForm.price),
                mrp: parseFloat(productForm.mrp),
                stock: parseInt(productForm.stock)
            };
            await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Product updated successfully!');
            setShowProductModal(false);
            setEditingProduct(null);
            resetProductForm();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update product');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Product deleted successfully!');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const resetProductForm = () => {
        setProductForm({
            name: '', description: '', category: 'Groceries', shopId: '',
            price: '', mrp: '', stock: '', unit: 'piece'
        });
    };

    // ============ ASSIGN AGENT ============

    const handleAssignAgent = async (orderId, agentId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/orders/${orderId}/assign`,
                { deliveryAgentId: agentId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Delivery agent assigned successfully!');
            setShowAssignModal(false);
            setSelectedOrder(null);
            fetchData();
        } catch (error) {
            toast.error('Failed to assign agent');
        }
    };

    // ============ IMPORT FUNCTIONS ============

    const downloadShopTemplate = async (shopId, shopName) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/import/template/${shopId}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `products_${shopName.replace(/\s/g, '_')}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Template downloaded!');
        } catch (error) {
            toast.error('Failed to download template');
        }
    };

    const handleShopImport = async () => {
        if (!importFile || !selectedShopForImport) {
            toast.error('Please select a file and shop');
            return;
        }

        const formData = new FormData();
        formData.append('file', importFile);

        setImporting(true);
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                `http://localhost:5000/api/admin/import/products/${selectedShopForImport._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setImportResult(response.data);
            toast.success(`✅ ${response.data.imported} products imported to "${response.data.shop}"!`);

            if (response.data.skipped > 0) {
                toast.warning(`⚠️ ${response.data.skipped} rows were skipped`);
            }

            fetchData();
            setTimeout(() => {
                setShowImportModal(false);
                setImportFile(null);
                setImportResult(null);
                setSelectedShopForImport(null);
            }, 3000);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Import failed');
        } finally {
            setImporting(false);
        }
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
                    <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: '#2d3748' }}>👑 Admin Dashboard</h1>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => { resetAgentForm(); setShowAgentModal(true); }}
                            style={{
                                padding: '10px 20px',
                                background: '#805ad5',
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
                            <FiUserPlus /> Add Delivery Agent
                        </button>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '10px 20px',
                                background: '#fc8181',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    background: 'white',
                    padding: '8px',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                    {[
                        { id: 'dashboard', label: '📊 Dashboard' },
                        { id: 'shops', label: '🏪 Shops' },
                        { id: 'products', label: '📦 Products' },
                        { id: 'orders', label: '📋 Orders' },
                        { id: 'agents', label: '🚚 Delivery Agents' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '10px 20px',
                                background: activeTab === tab.id ? '#48bb78' : 'transparent',
                                color: activeTab === tab.id ? 'white' : '#4a5568',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontWeight: activeTab === tab.id ? '600' : '500',
                                transition: 'all 0.3s',
                                flex: '1',
                                minWidth: '100px'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ============ DASHBOARD TAB ============ */}
                {activeTab === 'dashboard' && (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '16px',
                            marginBottom: '24px'
                        }}>
                            {[
                                { label: 'Total Users', value: stats?.totalUsers || 0, color: '#3182ce' },
                                { label: 'Total Shops', value: stats?.totalShops || 0, color: '#48bb78' },
                                { label: 'Total Products', value: stats?.totalProducts || 0, color: '#805ad5' },
                                { label: 'Total Orders', value: stats?.totalOrders || 0, color: '#d69e2e' },
                                { label: 'Delivery Agents', value: stats?.totalDeliveryAgents || 0, color: '#e53e3e' },
                                { label: 'Revenue', value: `₹${stats?.totalRevenue || 0}`, color: '#38a169' }
                            ].map((stat, i) => (
                                <div key={i} style={{
                                    background: 'white',
                                    padding: '20px',
                                    borderRadius: '16px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ color: '#718096', fontSize: '14px' }}>{stat.label}</p>
                                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            background: '#f0fff4',
                            padding: '16px',
                            borderRadius: '16px',
                            border: '1px solid #c6f6d5'
                        }}>
                            <p style={{ color: '#38a169' }}>
                                ✅ You are logged in as <strong>Admin</strong>. You can manage shops, products, orders, and delivery agents.
                            </p>
                        </div>
                    </>
                )}

                {/* ============ SHOPS TAB ============ */}
                {activeTab === 'shops' && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                            <h2 style={{ fontSize: '24px', color: '#2d3748' }}>🏪 Manage Shops ({shops.length})</h2>
                            <button
                                onClick={() => { setEditingShop(null); resetShopForm(); setShowShopModal(true); }}
                                style={{
                                    padding: '10px 20px',
                                    background: '#48bb78',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }}
                            >
                                + Add Shop
                            </button>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '16px'
                        }}>
                            {shops.map(shop => {
                                const shopProducts = products.filter(p => p.shopId === shop._id && p.isArchived !== true);
                                return (
                                    <div key={shop._id} style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '20px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        border: '1px solid #f0f0f0'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748' }}>{shop.name}</h3>
                                                <p style={{ fontSize: '14px', color: '#718096' }}>{shop.category}</p>
                                            </div>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                background: shop.isOpen ? '#c6f6d5' : '#fed7d7',
                                                color: shop.isOpen ? '#276749' : '#9b2c2c'
                                            }}>
                                                {shop.isOpen ? 'Open' : 'Closed'}
                                            </span>
                                        </div>

                                        <p style={{ fontSize: '14px', color: '#718096', margin: '12px 0' }}>{shop.description}</p>

                                        <div style={{ fontSize: '13px', color: '#a0aec0' }}>
                                            <p>📍 {shop.address || 'No address'}</p>
                                            <p>📞 {shop.contactNumber || 'N/A'}</p>
                                            <p style={{ marginTop: '4px' }}>
                                                📦 <strong>{shopProducts.length}</strong> products
                                            </p>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                                            <button
                                                onClick={() => handleEditShop(shop)}
                                                style={{
                                                    padding: '6px 16px',
                                                    background: '#ebf8ff',
                                                    color: '#3182ce',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Edit Shop
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedShopForImport(shop);
                                                    setImportFile(null);
                                                    setImportResult(null);
                                                    setShowImportModal(true);
                                                }}
                                                style={{
                                                    padding: '6px 16px',
                                                    background: '#805ad5',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                <FiUpload size={14} /> Import Products
                                            </button>
                                            <button
                                                onClick={() => handleDeleteShop(shop._id)}
                                                style={{
                                                    padding: '6px 16px',
                                                    background: '#fff5f5',
                                                    color: '#e53e3e',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {shops.length === 0 && (
                                <div style={{
                                    gridColumn: '1 / -1',
                                    textAlign: 'center',
                                    padding: '40px',
                                    background: 'white',
                                    borderRadius: '16px',
                                    color: '#a0aec0'
                                }}>
                                    No shops added yet. Click "Add Shop" to get started!
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ============ PRODUCTS TAB ============ */}
                {activeTab === 'products' && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                            <h2 style={{ fontSize: '24px', color: '#2d3748' }}>📦 Manage Products ({products.length})</h2>
                            <button
                                onClick={() => { setEditingProduct(null); resetProductForm(); setShowProductModal(true); }}
                                style={{
                                    padding: '10px 20px',
                                    background: '#48bb78',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }}
                            >
                                + Add Product
                            </button>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                            gap: '16px'
                        }}>
                            {products.map(product => {
                                const shop = shops.find(s => s._id === product.shopId);
                                return (
                                    <div key={product._id} style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '16px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        border: '1px solid #f0f0f0'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748' }}>{product.name}</h4>
                                                <p style={{ fontSize: '13px', color: '#718096' }}>{shop?.name || 'Unknown Shop'}</p>
                                            </div>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '9999px',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                background: product.isAvailable ? '#c6f6d5' : '#fed7d7',
                                                color: product.isAvailable ? '#276749' : '#9b2c2c'
                                            }}>
                                                {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                        <div style={{ marginTop: '8px' }}>
                                            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#48bb78' }}>₹{product.price}</span>
                                            {product.mrp > product.price && (
                                                <span style={{ fontSize: '14px', color: '#a0aec0', textDecoration: 'line-through', marginLeft: '8px' }}>
                                                    ₹{product.mrp}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#a0aec0', marginTop: '4px' }}>Stock: {product.stock} {product.unit}s</p>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                style={{
                                                    padding: '6px 16px',
                                                    background: '#ebf8ff',
                                                    color: '#3182ce',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '13px'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product._id)}
                                                style={{
                                                    padding: '6px 16px',
                                                    background: '#fff5f5',
                                                    color: '#e53e3e',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '13px'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {products.length === 0 && (
                                <div style={{
                                    gridColumn: '1 / -1',
                                    textAlign: 'center',
                                    padding: '40px',
                                    background: 'white',
                                    borderRadius: '16px',
                                    color: '#a0aec0'
                                }}>
                                    No products added yet. Click "Add Product" to get started!
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ============ ORDERS TAB ============ */}
                {activeTab === 'orders' && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '24px', color: '#2d3748' }}>📋 All Orders ({orders.length})</h2>
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

                        {orders.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px',
                                background: 'white',
                                borderRadius: '16px',
                                color: '#a0aec0'
                            }}>
                                No orders placed yet.
                            </div>
                        ) : (
                            <div style={{
                                background: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                            }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                                        <thead style={{ background: '#f7fafc' }}>
                                            <tr>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', color: '#4a5568' }}>Order #</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', color: '#4a5568' }}>Customer</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', color: '#4a5568' }}>Items</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', color: '#4a5568' }}>Total</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', color: '#4a5568' }}>Status</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', color: '#4a5568' }}>Delivery Agent</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', color: '#4a5568' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => {
                                                const agent = deliveryAgents.find(a => a.userId === order.deliveryAgentId);
                                                const agentName = agent?.user?.name || 'Not Assigned';

                                                return (
                                                    <tr key={order._id} style={{ borderTop: '1px solid #f0f0f0' }}>
                                                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#2d3748' }}>
                                                            #{order.orderNumber}
                                                        </td>
                                                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#2d3748' }}>
                                                            User #{order.userId}
                                                        </td>
                                                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#2d3748' }}>
                                                            {order.items?.length || 0}
                                                        </td>
                                                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#48bb78', fontWeight: '600' }}>
                                                            ₹{order.totalAmount}
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <span style={{
                                                                padding: '4px 12px',
                                                                borderRadius: '9999px',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                                background: order.orderStatus === 'delivered' ? '#c6f6d5' :
                                                                    order.orderStatus === 'pending' ? '#fefcbf' :
                                                                        order.orderStatus === 'cancelled' ? '#fed7d7' : '#bee3f8',
                                                                color: order.orderStatus === 'delivered' ? '#276749' :
                                                                    order.orderStatus === 'pending' ? '#975a16' :
                                                                        order.orderStatus === 'cancelled' ? '#9b2c2c' : '#2a69ac'
                                                            }}>
                                                                {order.orderStatus?.replace('_', ' ').toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4a5568' }}>
                                                            {order.deliveryAgentId ? agentName : '⚠️ Not Assigned'}
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedOrder(order);
                                                                        setShowAssignModal(true);
                                                                    }}
                                                                    style={{
                                                                        padding: '6px 14px',
                                                                        background: '#805ad5',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '8px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '13px',
                                                                        fontWeight: '500'
                                                                    }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#6b46c1'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.background = '#805ad5'}
                                                                >
                                                                    Assign Agent
                                                                </button>
                                                            )}
                                                            {order.orderStatus === 'delivered' && (
                                                                <span style={{ fontSize: '13px', color: '#48bb78' }}>✅ Delivered</span>
                                                            )}
                                                            {order.orderStatus === 'cancelled' && (
                                                                <span style={{ fontSize: '13px', color: '#fc8181' }}>❌ Cancelled</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ============ DELIVERY AGENTS TAB ============ */}
                {activeTab === 'agents' && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '24px', color: '#2d3748' }}>🚚 Delivery Agents ({deliveryAgents.length})</h2>
                            <button
                                onClick={() => { resetAgentForm(); setShowAgentModal(true); }}
                                style={{
                                    padding: '10px 20px',
                                    background: '#805ad5',
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
                                <FiUserPlus /> Add Agent
                            </button>
                        </div>

                        {deliveryAgents.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px',
                                background: 'white',
                                borderRadius: '16px',
                                color: '#a0aec0'
                            }}>
                                <FiTruck style={{ fontSize: '48px', marginBottom: '12px', color: '#a0aec0' }} />
                                <p>No delivery agents registered yet.</p>
                                <p style={{ fontSize: '14px', marginTop: '4px' }}>Click "Add Agent" to create one.</p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '16px'
                            }}>
                                {deliveryAgents.map(agent => {
                                    const user = agent?.user;
                                    return (
                                        <div key={agent._id} style={{
                                            background: 'white',
                                            borderRadius: '16px',
                                            padding: '20px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            border: '1px solid #f0f0f0'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                <div style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '50%',
                                                    background: '#f0fff4',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '20px',
                                                    color: '#48bb78'
                                                }}>
                                                    {agent.vehicleType === 'motorcycle' ? '🏍️' :
                                                     agent.vehicleType === 'scooter' ? '🛵' :
                                                     agent.vehicleType === 'car' ? '🚗' :
                                                     agent.vehicleType === 'van' ? '🚐' : '🚲'}
                                                </div>
                                                <div>
                                                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748' }}>
                                                        {user?.name || 'Unknown'}
                                                    </h4>
                                                    <p style={{ fontSize: '13px', color: '#718096' }}>
                                                        {user?.email || 'No email'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '8px',
                                                fontSize: '14px',
                                                color: '#4a5568',
                                                marginBottom: '12px'
                                            }}>
                                                <div>
                                                    <span style={{ color: '#a0aec0' }}>Phone:</span>
                                                    <span style={{ marginLeft: '4px' }}>{user?.phone || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span style={{ color: '#a0aec0' }}>Vehicle:</span>
                                                    <span style={{ marginLeft: '4px' }}>
                                                        {agent.vehicleNumber || 'Not set'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span style={{ color: '#a0aec0' }}>Deliveries:</span>
                                                    <span style={{ marginLeft: '4px', fontWeight: '600' }}>
                                                        {agent.totalDeliveries || 0}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span style={{ color: '#a0aec0' }}>Rating:</span>
                                                    <span style={{ marginLeft: '4px' }}>
                                                        ⭐ {agent.rating?.toFixed(1) || 'New'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '9999px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    background: agent.availabilityStatus === 'available' ? '#c6f6d5' :
                                                              agent.availabilityStatus === 'busy' ? '#fefcbf' : '#fed7d7',
                                                    color: agent.availabilityStatus === 'available' ? '#276749' :
                                                           agent.availabilityStatus === 'busy' ? '#975a16' : '#9b2c2c'
                                                }}>
                                                    {agent.availabilityStatus?.toUpperCase() || 'OFFLINE'}
                                                </span>
                                                <span style={{ fontSize: '13px', color: '#a0aec0' }}>
                                                    Earnings: ₹{agent.totalEarnings || 0}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ============ SHOP MODAL ============ */}
            {showShopModal && (
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
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '24px', color: '#2d3748' }}>
                                {editingShop ? 'Edit Shop' : 'Add New Shop'}
                            </h2>
                            <button
                                onClick={() => { setShowShopModal(false); setEditingShop(null); resetShopForm(); }}
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

                        <form onSubmit={editingShop ? handleUpdateShop : handleAddShop}>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Shop Name *</label>
                                <input
                                    type="text"
                                    value={shopForm.name}
                                    onChange={(e) => setShopForm({...shopForm, name: e.target.value})}
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Description *</label>
                                <textarea
                                    value={shopForm.description}
                                    onChange={(e) => setShopForm({...shopForm, description: e.target.value})}
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none', minHeight: '80px' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Category *</label>
                                <select
                                    value={shopForm.category}
                                    onChange={(e) => setShopForm({...shopForm, category: e.target.value})}
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Address</label>
                                <input
                                    type="text"
                                    value={shopForm.address}
                                    onChange={(e) => setShopForm({...shopForm, address: e.target.value})}
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={shopForm.latitude}
                                        onChange={(e) => setShopForm({...shopForm, latitude: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={shopForm.longitude}
                                        onChange={(e) => setShopForm({...shopForm, longitude: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Contact Number</label>
                                    <input
                                        type="text"
                                        value={shopForm.contactNumber}
                                        onChange={(e) => setShopForm({...shopForm, contactNumber: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Email</label>
                                    <input
                                        type="email"
                                        value={shopForm.email}
                                        onChange={(e) => setShopForm({...shopForm, email: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Delivery Radius (km)</label>
                                    <input
                                        type="number"
                                        value={shopForm.deliveryRadius}
                                        onChange={(e) => setShopForm({...shopForm, deliveryRadius: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Delivery Charge (per km)</label>
                                    <input
                                        type="number"
                                        value={shopForm.deliveryChargePerKm}
                                        onChange={(e) => setShopForm({...shopForm, deliveryChargePerKm: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={shopForm.isOpen}
                                        onChange={(e) => setShopForm({...shopForm, isOpen: e.target.checked})}
                                    />
                                    <span style={{ fontSize: '14px', color: '#4a5568' }}>Shop is open</span>
                                </label>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: '#48bb78',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {editingShop ? 'Update Shop' : 'Add Shop'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowShopModal(false); setEditingShop(null); resetShopForm(); }}
                                    style={{
                                        padding: '14px 24px',
                                        background: '#e2e8f0',
                                        color: '#4a5568',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============ PRODUCT MODAL ============ */}
            {showProductModal && (
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
                        maxWidth: '500px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '24px', color: '#2d3748' }}>
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button
                                onClick={() => { setShowProductModal(false); setEditingProduct(null); resetProductForm(); }}
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

                        <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Product Name *</label>
                                <input
                                    type="text"
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Description</label>
                                <textarea
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none', minHeight: '60px' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Category *</label>
                                    <select
                                        value={productForm.category}
                                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    >
                                        {productCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Shop *</label>
                                    <select
                                        value={productForm.shopId}
                                        onChange={(e) => setProductForm({...productForm, shopId: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                        required
                                    >
                                        <option value="">Select a shop</option>
                                        {shops.map(shop => <option key={shop._id} value={shop._id}>{shop.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Price (₹) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>MRP (₹) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={productForm.mrp}
                                        onChange={(e) => setProductForm({...productForm, mrp: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Stock *</label>
                                    <input
                                        type="number"
                                        value={productForm.stock}
                                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Unit</label>
                                    <select
                                        value={productForm.unit}
                                        onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    >
                                        {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: '#48bb78',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowProductModal(false); setEditingProduct(null); resetProductForm(); }}
                                    style={{
                                        padding: '14px 24px',
                                        background: '#e2e8f0',
                                        color: '#4a5568',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============ ASSIGN DELIVERY AGENT MODAL ============ */}
            {showAssignModal && selectedOrder && (
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
                        maxWidth: '500px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '24px', color: '#2d3748' }}>
                                🚚 Assign Delivery Agent
                            </h2>
                            <button
                                onClick={() => { setShowAssignModal(false); setSelectedOrder(null); }}
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

                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ fontSize: '14px', color: '#718096' }}>
                                Order: <strong>#{selectedOrder.orderNumber}</strong>
                            </p>
                            <p style={{ fontSize: '14px', color: '#718096' }}>
                                Customer: <strong>User #{selectedOrder.userId}</strong>
                            </p>
                            <p style={{ fontSize: '14px', color: '#718096' }}>
                                Total: <strong style={{ color: '#48bb78' }}>₹{selectedOrder.totalAmount}</strong>
                            </p>
                            <p style={{ fontSize: '14px', color: '#718096' }}>
                                Status: <strong>{selectedOrder.orderStatus?.replace('_', ' ').toUpperCase()}</strong>
                            </p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                                Select Delivery Agent
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {deliveryAgents.length === 0 ? (
                                    <p style={{ color: '#a0aec0', fontSize: '14px' }}>No delivery agents available. Please register a delivery agent first.</p>
                                ) : (
                                    deliveryAgents.map(agent => {
                                        const user = agent?.user;
                                        return (
                                            <button
                                                key={agent._id}
                                                onClick={() => handleAssignAgent(selectedOrder._id, agent.userId)}
                                                style={{
                                                    padding: '12px 16px',
                                                    background: '#f7fafc',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'all 0.3s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = '#48bb78';
                                                    e.currentTarget.style.background = '#f0fff4';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                                    e.currentTarget.style.background = '#f7fafc';
                                                }}
                                            >
                                                <div>
                                                    <strong>{user?.name || 'Unknown'}</strong>
                                                    <div style={{ fontSize: '12px', color: '#718096' }}>
                                                        {agent.vehicleType} • {agent.totalDeliveries || 0} deliveries
                                                    </div>
                                                </div>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '9999px',
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    background: agent.availabilityStatus === 'available' ? '#c6f6d5' : '#fefcbf',
                                                    color: agent.availabilityStatus === 'available' ? '#276749' : '#975a16'
                                                }}>
                                                    {agent.availabilityStatus}
                                                </span>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => { setShowAssignModal(false); setSelectedOrder(null); }}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#e2e8f0',
                                color: '#4a5568',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* ============ SHOP-SPECIFIC IMPORT MODAL ============ */}
            {showImportModal && selectedShopForImport && (
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
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '24px', color: '#2d3748' }}>
                                📤 Import Products to <span style={{ color: '#48bb78' }}>"{selectedShopForImport.name}"</span>
                            </h2>
                            <button
                                onClick={() => { setShowImportModal(false); setImportFile(null); setImportResult(null); setSelectedShopForImport(null); }}
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

                        <div style={{
                            background: '#f0fff4',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            border: '1px solid #c6f6d5'
                        }}>
                            <p style={{ fontSize: '14px', color: '#276749' }}>
                                🏪 Importing products for: <strong>{selectedShopForImport.name}</strong>
                                <br />
                                <span style={{ fontSize: '12px' }}>Products will be automatically assigned to this shop</span>
                            </p>
                        </div>

                        <div style={{
                            background: '#f7fafc',
                            padding: '16px',
                            borderRadius: '12px',
                            marginBottom: '16px'
                        }}>
                            <h4 style={{ fontSize: '16px', color: '#2d3748', marginBottom: '8px' }}>Step 1: Download Template</h4>
                            <p style={{ fontSize: '14px', color: '#718096', marginBottom: '12px' }}>
                                Download the template with the correct format for this shop.
                            </p>
                            <button
                                onClick={() => downloadShopTemplate(selectedShopForImport._id, selectedShopForImport.name)}
                                style={{
                                    padding: '10px 20px',
                                    background: '#48bb78',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <FiDownload /> Download Template
                            </button>
                        </div>

                        <div style={{
                            background: '#f7fafc',
                            padding: '16px',
                            borderRadius: '12px',
                            marginBottom: '16px'
                        }}>
                            <h4 style={{ fontSize: '16px', color: '#2d3748', marginBottom: '8px' }}>Step 2: Upload Your File</h4>
                            <p style={{ fontSize: '14px', color: '#718096', marginBottom: '12px' }}>
                                Upload your Excel (.xlsx) or CSV file with product data.
                            </p>

                            <div style={{
                                border: '2px dashed #e2e8f0',
                                borderRadius: '12px',
                                padding: '24px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                background: importFile ? '#f0fff4' : 'transparent',
                                borderColor: importFile ? '#48bb78' : '#e2e8f0'
                            }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = '#48bb78';
                                    e.currentTarget.style.background = '#f0fff4';
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file) {
                                        setImportFile(file);
                                    }
                                }}
                            >
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setImportFile(file);
                                        }
                                    }}
                                    style={{ display: 'none' }}
                                    id="import-file-input-shop"
                                />
                                <label htmlFor="import-file-input-shop" style={{ cursor: 'pointer' }}>
                                    {importFile ? (
                                        <div>
                                            <FiFile style={{ fontSize: '40px', color: '#48bb78' }} />
                                            <p style={{ color: '#2d3748', fontWeight: '600', marginTop: '8px' }}>
                                                {importFile.name}
                                            </p>
                                            <p style={{ color: '#718096', fontSize: '14px' }}>
                                                {(importFile.size / 1024).toFixed(1)} KB
                                            </p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setImportFile(null);
                                                }}
                                                style={{
                                                    marginTop: '8px',
                                                    padding: '4px 12px',
                                                    background: '#fed7d7',
                                                    color: '#9b2c2c',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <FiUpload style={{ fontSize: '40px', color: '#a0aec0' }} />
                                            <p style={{ color: '#4a5568', fontWeight: '500', marginTop: '8px' }}>
                                                Click or drag to upload
                                            </p>
                                            <p style={{ color: '#a0aec0', fontSize: '14px' }}>
                                                Supports .xlsx, .xls, .csv
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={handleShopImport}
                                disabled={!importFile || importing}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    background: !importFile || importing ? '#a0aec0' : '#48bb78',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: !importFile || importing ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                {importing ? (
                                    <span>⏳ Importing to {selectedShopForImport.name}...</span>
                                ) : (
                                    <><FiUpload /> Import Products to Shop</>
                                )}
                            </button>
                            <button
                                onClick={() => { setShowImportModal(false); setImportFile(null); setImportResult(null); setSelectedShopForImport(null); }}
                                style={{
                                    padding: '14px 24px',
                                    background: '#e2e8f0',
                                    color: '#4a5568',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>

                        {importResult && (
                            <div style={{
                                marginTop: '16px',
                                padding: '16px',
                                borderRadius: '12px',
                                background: importResult.imported > 0 ? '#f0fff4' : '#fff5f5',
                                border: `1px solid ${importResult.imported > 0 ? '#c6f6d5' : '#fed7d7'}`
                            }}>
                                <h4 style={{ fontSize: '16px', color: '#2d3748', marginBottom: '8px' }}>
                                    Import Results for "{importResult.shop}"
                                </h4>
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                    <span style={{ color: '#48bb78' }}>
                                        <FiCheck style={{ display: 'inline', marginRight: '4px' }} />
                                        {importResult.imported} imported
                                    </span>
                                    {importResult.skipped > 0 && (
                                        <span style={{ color: '#e53e3e' }}>
                                            <FiX style={{ display: 'inline', marginRight: '4px' }} />
                                            {importResult.skipped} skipped
                                        </span>
                                    )}
                                </div>
                                {importResult.errors?.length > 0 && (
                                    <details style={{ marginTop: '8px' }}>
                                        <summary style={{ fontSize: '14px', color: '#718096', cursor: 'pointer' }}>
                                            View errors ({importResult.errors.length})
                                        </summary>
                                        <div style={{
                                            marginTop: '8px',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            fontSize: '13px',
                                            color: '#e53e3e',
                                            background: 'white',
                                            padding: '8px',
                                            borderRadius: '8px'
                                        }}>
                                            {importResult.errors.map((error, index) => (
                                                <div key={index} style={{
                                                    padding: '4px 0',
                                                    borderBottom: '1px solid #f0f0f0'
                                                }}>
                                                    Row {index + 1}: {error.reason}
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ============ CREATE DELIVERY AGENT MODAL ============ */}
            {showAgentModal && (
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
                        maxWidth: '500px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '24px', color: '#2d3748' }}>
                                🚚 Create Delivery Agent
                            </h2>
                            <button
                                onClick={() => { setShowAgentModal(false); resetAgentForm(); }}
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

                        <form onSubmit={handleCreateAgent}>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Full Name *</label>
                                <input
                                    type="text"
                                    value={agentForm.name}
                                    onChange={(e) => setAgentForm({...agentForm, name: e.target.value})}
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Email Address *</label>
                                <input
                                    type="email"
                                    value={agentForm.email}
                                    onChange={(e) => setAgentForm({...agentForm, email: e.target.value})}
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Phone Number *</label>
                                <input
                                    type="tel"
                                    value={agentForm.phone}
                                    onChange={(e) => setAgentForm({...agentForm, phone: e.target.value})}
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Password *</label>
                                <input
                                    type="password"
                                    value={agentForm.password}
                                    onChange={(e) => setAgentForm({...agentForm, password: e.target.value})}
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    required
                                    minLength="6"
                                />
                                <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '4px' }}>Minimum 6 characters</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Vehicle Type *</label>
                                    <select
                                        value={agentForm.vehicleType}
                                        onChange={(e) => setAgentForm({...agentForm, vehicleType: e.target.value})}
                                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                        required
                                    >
                                        {vehicleTypes.map(type => (
                                            <option key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' }}>Vehicle Number</label>
                                    <input
                                        type="text"
                                        value={agentForm.vehicleNumber}
                                        onChange={(e) => setAgentForm({...agentForm, vehicleNumber: e.target.value})}
                                        placeholder="KL-01-AB-1234"
                                        style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: '#805ad5',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <FiUserPlus style={{ display: 'inline', marginRight: '8px' }} />
                                    Create Delivery Agent
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowAgentModal(false); resetAgentForm(); }}
                                    style={{
                                        padding: '14px 24px',
                                        background: '#e2e8f0',
                                        color: '#4a5568',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;