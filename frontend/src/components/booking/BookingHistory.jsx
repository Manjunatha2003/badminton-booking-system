import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';
import { api } from '../../services/api';

const BookingHistory = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.bookings.getByUserId(user.id);
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
    setLoading(false);
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.bookings.cancel(id);
      fetchBookings();
    } catch (err) {
      alert('Error cancelling booking');
    }
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
        <Calendar size={32} style={{ marginRight: '12px', color: '#667eea' }} />
        My Bookings
      </h2>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>No bookings found</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map((booking) => (
            <div key={booking.id} style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{booking.court_name}</h3>
                <p style={{ color: '#666', marginBottom: '4px' }}>
                  {new Date(booking.booking_date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p style={{ color: '#666', marginBottom: '8px' }}>Time: {booking.start_time} - {booking.end_time}</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginTop: '8px' }}>Total: ₹{booking.total_price}</p>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                  {booking.status === 'confirmed' ? (
                    <CheckCircle size={20} style={{ color: '#10b981', marginRight: '6px' }} />
                  ) : (
                    <XCircle size={20} style={{ color: '#ef4444', marginRight: '6px' }} />
                  )}
                  <span style={{ fontWeight: '600', color: booking.status === 'confirmed' ? '#10b981' : '#ef4444', textTransform: 'uppercase', fontSize: '14px' }}>
                    {booking.status}
                  </span>
                </div>
              </div>
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => cancelBooking(booking.id)}
                  className="btn-danger"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;