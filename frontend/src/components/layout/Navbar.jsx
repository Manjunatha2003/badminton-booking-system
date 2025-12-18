import React from 'react';
import { Menu, Settings, LogOut, User, UserPlus } from 'lucide-react';

const Navbar = ({ view, setView, user, onLogout, onShowAuth, onShowSignup }) => {
  return (
    <nav style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Menu style={{ color: 'white' }} size={24} />
          </div>
          <span style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CourtBook Pro
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setView('booking')}
            className={view === 'booking' ? 'btn-primary' : 'btn-secondary'}
          >
            Book Court
          </button>
          <button
            onClick={() => setView('history')}
            className={view === 'history' ? 'btn-primary' : 'btn-secondary'}
          >
            My Bookings
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => setView('admin')}
              className={view === 'admin' ? 'btn-success' : 'btn-secondary'}
            >
              <Settings size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Admin
            </button>
          )}
          {user ? (
            <>
              <button
                onClick={() => setView('profile')}
                className="btn-secondary"
              >
                <User size={16} style={{ display: 'inline', marginRight: '6px' }} />
                {user.username}
              </button>
              <button
                onClick={onLogout}
                className="btn-danger"
              >
                <LogOut size={16} style={{ display: 'inline', marginRight: '6px' }} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={onShowSignup} className="btn-secondary">
                <UserPlus size={16} style={{ display: 'inline', marginRight: '6px' }} />
                Sign Up
              </button>
              <button onClick={onShowAuth} className="btn-primary">
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;