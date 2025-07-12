const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Main dashboard routes
router.get('/summary', dashboardController.getDashboardSummary);
router.get('/quick-stats', dashboardController.getQuickStats);

// Net worth routes
router.get('/networth', dashboardController.getNetWorthHistory);
router.post('/networth/snapshot', dashboardController.saveNetWorthSnapshot);

// Cash flow overview
router.get('/cashflow', dashboardController.getCashFlowOverview);

// Goals and planning
router.get('/goals', dashboardController.getFinancialGoals);

module.exports = router;