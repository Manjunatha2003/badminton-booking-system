const pool = require('../config/database');
const { calculatePrice } = require('../utils/pricingEngine');
const { 
  checkAvailability, 
  checkEquipmentAvailability, 
  checkCoachAvailability,
  calculateEndTime 
} = require('../utils/validators');

const createBooking = async (req, res) => {
  const client = await pool.connect();
  try {
    const { courtId, date, startTime, equipmentIds = [], coachId, userId } = req.body;

    await client.query('BEGIN');

    const courtAvailable = await checkAvailability(client, courtId, date, startTime);
    if (!courtAvailable) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Court not available for selected slot' });
    }

    if (equipmentIds.length > 0) {
      const equipAvailable = await checkEquipmentAvailability(client, equipmentIds, date, startTime);
      if (!equipAvailable) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Equipment not available' });
      }
    }

    if (coachId) {
      const coachAvailable = await checkCoachAvailability(client, coachId, date, startTime);
      if (!coachAvailable) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Coach not available' });
      }
    }

    const pricing = await calculatePrice(courtId, date, startTime, equipmentIds, coachId);
    const endTime = calculateEndTime(startTime);

    const userResult = await client.query('SELECT username, email FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    const bookingResult = await client.query(
      `INSERT INTO bookings (user_id, court_id, booking_date, start_time, end_time, user_name, user_email, total_price, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'confirmed') RETURNING id`,
      [userId, courtId, date, startTime, endTime, user.username, user.email, pricing.total]
    );

    const bookingId = bookingResult.rows[0].id;

    if (equipmentIds.length > 0) {
      for (const equipId of equipmentIds) {
        await client.query(
          'INSERT INTO booking_equipment (booking_id, equipment_id, quantity) VALUES ($1, $2, 1)',
          [bookingId, equipId]
        );
      }
    }

    if (coachId) {
      await client.query(
        'INSERT INTO booking_coaches (booking_id, coach_id) VALUES ($1, $2)',
        [bookingId, coachId]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true, bookingId, pricing });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.query;
    const result = await pool.query(
      `SELECT b.*, c.name as court_name 
       FROM bookings b 
       JOIN courts c ON b.court_id = c.id 
       WHERE b.user_id = $1 
       ORDER BY b.booking_date DESC, b.start_time DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cancelBooking = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const bookingResult = await client.query(
      'SELECT court_id, booking_date, start_time FROM bookings WHERE id = $1',
      [req.params.id]
    );
    
    if (bookingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Booking not found' });
    }

    const { court_id, booking_date, start_time } = bookingResult.rows[0];

    await client.query('UPDATE bookings SET status = $1 WHERE id = $2', ['cancelled', req.params.id]);

    const waitlistResult = await client.query(
      `SELECT * FROM waitlist 
       WHERE court_id = $1 AND booking_date = $2 AND start_time = $3 AND notified = false 
       ORDER BY created_at LIMIT 1`,
      [court_id, booking_date, start_time]
    );

    if (waitlistResult.rows.length > 0) {
      const waitlistEntry = waitlistResult.rows[0];
      await client.query('UPDATE waitlist SET notified = true WHERE id = $1', [waitlistEntry.id]);
      console.log(`Notifying ${waitlistEntry.user_email} about slot availability`);
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const slots = [
      '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
      '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
      '18:00', '19:00', '20:00', '21:00'
    ];
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createBooking, getUserBookings, cancelBooking, getAvailableSlots };