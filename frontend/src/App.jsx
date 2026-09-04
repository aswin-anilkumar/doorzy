import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Pages
import Home from './pages/Home';
import ShopList from './pages/ShopList';
import ShopDetails from './pages/ShopDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Addresses from './pages/Addresses';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';

// Delivery Pages
import DeliveryDashboard from './pages/DeliveryDashboard';
import DeliveryHistory from './pages/DeliveryHistory';

// Protected Route Component - Only for pages that require login
const ProtectedRoute = ({ children, adminOnly = false, deliveryOnly = false }) => {
  const { user, loading, isAuthenticated, isAdmin, isDeliveryAgent } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (deliveryOnly && !isDeliveryAgent) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Root Redirect - Shows Home for everyone, but redirects logged-in users to their dashboard
const RootRedirect = () => {
  const { user, loading, isAuthenticated, isAdmin, isDeliveryAgent } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  // If NOT logged in, show Home page (with products and shops)
  if (!isAuthenticated) {
    return <Home />;
  }

  // If logged in, redirect to appropriate dashboard
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (isDeliveryAgent) {
    return <Navigate to="/delivery/dashboard" replace />;
  } else {
    return <Navigate to="/user/home" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            {/* Root - Shows Home for guests, Dashboard for logged in users */}
            <Route path="/" element={<RootRedirect />} />
            
            {/* Public Routes - Accessible to everyone */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Public Shop Routes - Accessible to everyone */}
            <Route path="/shops" element={<ShopList />} />
            <Route path="/shop/:id" element={<ShopDetails />} />

            {/* Protected Routes - Require login */}
            <Route path="/user/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/user/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/user/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/user/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/user/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/user/addresses" element={
              <ProtectedRoute>
                <Addresses />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Delivery Routes */}
            <Route path="/delivery/dashboard" element={
              <ProtectedRoute deliveryOnly>
                <DeliveryDashboard />
              </ProtectedRoute>
            } />
            <Route path="/delivery/history" element={
              <ProtectedRoute deliveryOnly>
                <DeliveryHistory />
              </ProtectedRoute>
            } />

            {/* Catch-all - Redirect to root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;