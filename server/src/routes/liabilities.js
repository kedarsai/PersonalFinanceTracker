const express = require('express');
const router = express.Router();
const liabilityController = require('../controllers/liabilityController');

// CRUD routes
router.get('/', liabilityController.getLiabilities);
router.get('/:id', liabilityController.getLiability);
router.post('/', liabilityController.createLiability);
router.put('/:id', liabilityController.updateLiability);
router.delete('/:id', liabilityController.deleteLiability);

// Summary and analysis routes
router.get('/summary/overview', liabilityController.getLiabilitySummary);
router.get('/summary/upcoming-payments', liabilityController.getUpcomingPayments);
router.get('/summary/payoff-projections', liabilityController.getPayoffProjections);

module.exports = router;