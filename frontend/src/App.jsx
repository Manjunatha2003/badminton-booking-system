import React, { useState, useEffect } from 'react';
import HomePage from './components/home/HomePage';
import CustomerDashboard from './components/customer/CustomerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AuthModal from './components/auth/AuthModal';

const App = () => {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authType, setAuthType] = useState('customer');
  
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const openAuth = (mode, type) => {
    setAuthMode(mode);
    setAuthType(type);
    setShowAuth(true);
  };

  if (!user) {
    return (
      <>
        <HomePage onOpenAuth={openAuth} />
        {showAuth && (
          <AuthModal 
            onClose={() => setShowAuth(false)} 
            onLogin={handleLogin}
            mode={authMode}
            setMode={setAuthMode}
            authType={authType}
          />
        )}
      </>
    );
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return <CustomerDashboard user={user} onLogout={handleLogout} />;
};

export default App;