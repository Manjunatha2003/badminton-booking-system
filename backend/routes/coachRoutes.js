const express = require('express');
const router = express.Router();
const { getAllCoaches, createCoach, updateCoach, deleteCoach } = require('../controllers/coachController');

router.get('/', getAllCoaches);
router.post('/', createCoach);
router.put('/:id', updateCoach);
router.delete('/:id', deleteCoach);

module.exports = router;