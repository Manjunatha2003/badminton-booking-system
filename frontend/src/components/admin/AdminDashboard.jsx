import React, { useState } from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import AdminPanel from './AdminPanel';
import ProfileView from '../auth/ProfileView';

const AdminDashboard = ({ user, onLogout }) => {
  const [view, setView] = useState('admin');

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings style={{ color: 'white' }} size={24} />
            </div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Admin Dashboard
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setView('admin')}
              className={view === 'admin' ? 'btn-success' : 'btn-secondary'}
            >
              <Settings size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Manage
            </button>
            <button
              onClick={() => setView('profile')}
              className={view === 'profile' ? 'btn-success' : 'btn-secondary'}
            >
              <User size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Profile
            </button>
            <button onClick={onLogout} className="btn-danger">
              <LogOut size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
        {view === 'admin' && <AdminPanel />}
        {view === 'profile' && <ProfileView user={user} />}
      </div>
    </div>
  );
};

export default AdminDashboard;