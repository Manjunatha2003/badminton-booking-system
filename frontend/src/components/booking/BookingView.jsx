import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { api } from '../../services/api';

const BookingView = ({ user }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [courts, setCourts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (date) fetchSlots();
  }, [date]);

  useEffect(() => {
    if (selectedSlot && selectedCourt) {
      calculatePrice();
    }
  }, [selectedSlot, selectedCourt, selectedEquipment, selectedCoach]);

  const fetchResources = async () => {
    try {
      const [courtsData, equipData, coachesData] = await Promise.all([
        api.courts.getAll(),
        api.equipment.getAll(),
        api.coaches.getAll()
      ]);
      setCourts(courtsData.filter(c => c.is_active));
      setEquipment(equipData);
      setCoaches(coachesData.filter(c => c.is_available));
    } catch (err) {
      console.error('Error fetching resources:', err);
    }
  };

  const fetchSlots = async () => {
    try {
      const slotsData = await api.bookings.getAvailableSlots(date);
      setSlots(slotsData);
    } catch (err) {
      console.error('Error fetching slots:', err);
    }
  };

  const calculatePrice = async () => {
    try {
      const pricingData = await api.pricing.calculate({
        courtId: selectedCourt,
        date,
        startTime: selectedSlot,
        equipmentIds: selectedEquipment,
        coachId: selectedCoach
      });
      setPricing(pricingData);
    } catch (err) {
      console.error('Error calculating price:', err);
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      await api.bookings.create({
        courtId: selectedCourt,
        date,
        startTime: selectedSlot,
        equipmentIds: selectedEquipment,
        coachId: selectedCoach,
        userId: user.id
      });

      alert('Booking confirmed successfully!');
      resetBooking();
      fetchSlots();
    } catch (err) {
      alert(`Booking failed: ${err.message}`);
    }
    setLoading(false);
  };

  const resetBooking = () => {
    setSelectedSlot(null);
    setSelectedCourt(null);
    setSelectedEquipment([]);
    setSelectedCoach(null);
    setPricing(null);
  };

  const toggleEquipment = (id) => {
    setSelectedEquipment(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
        <Calendar size={32} style={{ marginRight: '12px', color: '#667eea' }} />
        Book Your Court
      </h2>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
          <Calendar size={18} style={{ display: 'inline', marginRight: '6px' }} />
          Select Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
          <Clock size={20} style={{ marginRight: '8px', color: '#667eea' }} />
          Available Time Slots
        </h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={selectedSlot === slot ? 'btn-primary' : 'btn-secondary'}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {selectedSlot && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Select Court</h3>
          <div className="grid grid-2">
            {courts.map((court) => (
              <button
                key={court.id}
                onClick={() => setSelectedCourt(court.id)}
                style={{
                  padding: '20px',
                  border: selectedCourt === court.id ? '3px solid #667eea' : '2px solid #e2e8f0',
                  borderRadius: '8px',
                  background: selectedCourt === court.id ? '#f0f4ff' : 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '4px' }}>{court.name}</div>
                <div style={{ color: '#666', textTransform: 'capitalize', fontSize: '14px' }}>{court.court_type}</div>
                <div style={{ color: '#667eea', fontWeight: 'bold', marginTop: '8px' }}>₹{court.base_price}/hour</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedCourt && (
        <>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Add Equipment (Optional)</h3>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {equipment.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleEquipment(item.id)}
                  disabled={item.available_quantity === 0}
                  style={{
                    padding: '20px',
                    border: selectedEquipment.includes(item.id) ? '3px solid #10b981' : '2px solid #e2e8f0',
                    borderRadius: '8px',
                    background: selectedEquipment.includes(item.id) ? '#f0fdf4' : 'white',
                    cursor: item.available_quantity > 0 ? 'pointer' : 'not-allowed',
                    opacity: item.available_quantity > 0 ? 1 : 0.5,
                    textAlign: 'left',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>{item.available_quantity} available</div>
                  <div style={{ color: '#10b981', fontWeight: 'bold', marginTop: '8px' }}>₹{item.rental_price}/hour</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
              <Users size={20} style={{ marginRight: '8px', color: '#667eea' }} />
              Book a Coach (Optional)
            </h3>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {coaches.map((coach) => (
                <button
                  key={coach.id}
                  onClick={() => setSelectedCoach(selectedCoach === coach.id ? null : coach.id)}
                  style={{
                    padding: '20px',
                    border: selectedCoach === coach.id ? '3px solid #8b5cf6' : '2px solid #e2e8f0',
                    borderRadius: '8px',
                    background: selectedCoach === coach.id ? '#faf5ff' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{coach.name}</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>{coach.specialization}</div>
                  <div style={{ color: '#8b5cf6', fontWeight: 'bold', marginTop: '8px' }}>₹{coach.hourly_rate}/hour</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {pricing && (
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', padding: '24px', color: 'white' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <DollarSign size={28} style={{ marginRight: '8px' }} />
            Price Breakdown
          </h3>
          <div style={{ marginBottom: '16px' }}>
            {pricing.breakdown.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                <span>{item.description}</span>
                <span style={{ fontWeight: 'bold' }}>₹{item.amount}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontWeight: 'bold', paddingTop: '16px', borderTop: '2px solid rgba(255,255,255,0.5)' }}>
            <span>Total Amount</span>
            <span>₹{pricing.total}</span>
          </div>
          <button
            onClick={handleBooking}
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '16px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingView;