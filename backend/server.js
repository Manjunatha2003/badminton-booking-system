const express = require('express');
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { initializeDatabase } = require('./models/initDb');

const authRoutes = require('./routes/authRoutes');
const courtRoutes = require('./routes/courtRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const coachRoutes = require('./routes/coachRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// 🚀 SAFE INIT (NO CRASH)
initializeDatabase()
  .then(() => {
    console.log('Database ready');
  })
  .catch(err => {
    console.error('Database init failed:', err.message);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
