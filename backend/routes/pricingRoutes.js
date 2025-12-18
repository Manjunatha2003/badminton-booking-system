const express = require('express');
const router = express.Router();
const { getAllRules, createRule, updateRule, deleteRule, calculate } = require('../controllers/pricingController');

router.get('/rules', getAllRules);
router.post('/rules', createRule);
router.put('/rules/:id', updateRule);
router.delete('/rules/:id', deleteRule);
router.post('/calculate', calculate);

module.exports = router;