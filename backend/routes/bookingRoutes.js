const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, cancelBooking, getAvailableSlots } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getUserBookings);
router.delete('/:id', cancelBooking);
router.get('/availability', getAvailableSlots);

module.exports = router;