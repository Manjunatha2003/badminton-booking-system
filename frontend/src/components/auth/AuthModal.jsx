import React, { useState } from 'react';
import { XCircle, User, Lock, Eye, EyeOff, Mail, Shield } from 'lucide-react';
import { api } from '../../services/api';

const AuthModal = ({ onClose, onLogin, mode, setMode, authType }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      let data;
      if (mode === 'signup') {
        data = await api.auth.signup(username, email, password);
      } else {
        data = await api.auth.login(username, password);
        
        if (authType === 'admin' && data.user.role !== 'admin') {
          setError('Invalid admin credentials');
          setLoading(false);
          return;
        }
        
        if (authType === 'customer' && data.user.role !== 'user') {
          setError('Invalid customer credentials');
          setLoading(false);
          return;
        }
      }
      
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
      onClose();
    } catch (err) {
      setError(err.message || `${mode === 'signup' ? 'Signup' : 'Login'} failed`);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
        >
          <XCircle size={24} />
        </button>

        <div className="text-center" style={{ marginBottom: '24px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: authType === 'admin' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px' 
          }}>
            {authType === 'admin' ? <Shield style={{ color: 'white' }} size={32} /> : <User style={{ color: 'white' }} size={32} />}
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
            {authType === 'admin' ? 'Admin ' : 'Customer '}
            {mode === 'signup' ? 'Sign Up' : 'Login'}
          </h2>
          <p style={{ color: '#666' }}>
            {mode === 'signup' ? 'Create your account' : 'Welcome back!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '40px' }}
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: '#fee', border: '1px solid #fcc', color: '#c33', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            {loading ? 'Processing...' : mode === 'signup' ? 'Sign Up' : 'Login'}
          </button>
        </form>

        {authType === 'customer' && (
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#666' }}>
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                style={{ background: 'none', border: 'none', color: '#667eea', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {mode === 'signup' ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>
        )}

        {authType === 'admin' && mode === 'login' && (
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#999' }}>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;