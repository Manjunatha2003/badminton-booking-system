import React from 'react';
import { Shield, User, Calendar, Clock, DollarSign, Trophy } from 'lucide-react';

const HomePage = ({ onOpenAuth }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '20px 0', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>CourtBook Pro</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => onOpenAuth('login', 'admin')}
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              <Shield size={18} style={{ display: 'inline', marginRight: '8px' }} />
              Admin Login
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '56px', fontWeight: 'bold', color: 'white', marginBottom: '20px', lineHeight: '1.2' }}>
            Book Your Badminton Court
          </h1>
          <p style={{ fontSize: '22px', color: 'rgba(255,255,255,0.9)', marginBottom: '40px' }}>
            Premium courts, professional coaches, and complete equipment rental
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onOpenAuth('signup', 'customer')}
              className="btn-primary"
              style={{ padding: '16px 40px', fontSize: '18px', background: 'white', color: '#667eea', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}
            >
              <User size={20} style={{ display: 'inline', marginRight: '8px' }} />
              Sign Up Now
            </button>
            <button 
              onClick={() => onOpenAuth('login', 'customer')}
              style={{ padding: '16px 40px', fontSize: '18px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
>
Already have an account? Login
</button>
</div>
</div>
    <div className="grid grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
        <Calendar size={48} style={{ color: '#667eea', margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Easy Booking</h3>
        <p style={{ color: '#666' }}>Book courts in seconds with our simple interface</p>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
        <Clock size={48} style={{ color: '#667eea', margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Flexible Timing</h3>
        <p style={{ color: '#666' }}>Choose from multiple time slots every day</p>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
        <DollarSign size={48} style={{ color: '#667eea', margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Transparent Pricing</h3>
        <p style={{ color: '#666' }}>Clear pricing with no hidden charges</p>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
        <Trophy size={48} style={{ color: '#667eea', margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Pro Coaches</h3>
        <p style={{ color: '#666' }}>Learn from experienced badminton coaches</p>
      </div>
    </div>
  </div>

  <footer style={{ padding: '20px 0', background: 'rgba(0,0,0,0.2)', textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
    <p>&copy; 2024 CourtBook Pro. All rights reserved.</p>
  </footer>
</div>
);
};
export default HomePage;