const express = require('express');
const router = express.Router();
const { getAllCourts, createCourt, updateCourt, deleteCourt } = require('../controllers/courtController');

router.get('/', getAllCourts);
router.post('/', createCourt);
router.put('/:id', updateCourt);
router.delete('/:id', deleteCourt);

module.exports = router;