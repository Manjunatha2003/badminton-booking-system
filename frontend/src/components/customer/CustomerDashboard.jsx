import React, { useState } from 'react';
import { LogOut, User, Calendar, Clock } from 'lucide-react';
import BookingView from '../booking/BookingView';
import BookingHistory from '../booking/BookingHistory';
import ProfileView from '../auth/ProfileView';

const CustomerDashboard = ({ user, onLogout }) => {
  const [view, setView] = useState('booking');

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar style={{ color: 'white' }} size={24} />
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
              <Calendar size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Book Court
            </button>
            <button
              onClick={() => setView('history')}
              className={view === 'history' ? 'btn-primary' : 'btn-secondary'}
            >
              <Clock size={16} style={{ display: 'inline', marginRight: '6px' }} />
              My Bookings
            </button>
            <button
              onClick={() => setView('profile')}
              className={view === 'profile' ? 'btn-primary' : 'btn-secondary'}
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
        {view === 'booking' && <BookingView user={user} />}
        {view === 'history' && <BookingHistory user={user} />}
        {view === 'profile' && <ProfileView user={user} />}
      </div>
    </div>
  );
};

export default CustomerDashboard;