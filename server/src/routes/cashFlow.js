const express = require('express');
const router = express.Router();
const cashFlowController = require('../controllers/cashFlowController');

// Income routes
router.get('/income', cashFlowController.getIncome);
router.get('/income/:id', cashFlowController.getIncomeById);
router.post('/income', cashFlowController.createIncome);
router.put('/income/:id', cashFlowController.updateIncome);
router.delete('/income/:id', cashFlowController.deleteIncome);

// Expense routes
router.get('/expenses', cashFlowController.getExpenses);
router.get('/expenses/:id', cashFlowController.getExpenseById);
router.post('/expenses', cashFlowController.createExpense);
router.put('/expenses/:id', cashFlowController.updateExpense);
router.delete('/expenses/:id', cashFlowController.deleteExpense);

// Analysis routes
router.get('/summary', cashFlowController.getCashFlowSummary);
router.get('/income/by-category', cashFlowController.getIncomeByCategory);
router.get('/expenses/by-category', cashFlowController.getExpensesByCategory);
router.get('/monthly', cashFlowController.getMonthlyCashFlow);
router.get('/recurring', cashFlowController.getRecurringTransactions);
router.get('/recent', cashFlowController.getRecentTransactions);

module.exports = router;