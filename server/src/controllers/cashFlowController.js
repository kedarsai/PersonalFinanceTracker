const Transaction = require('../models/Transaction');
const { incomeSchema, expenseSchema } = require('../middleware/validation');

// Income Controllers
const getIncome = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const income = await Transaction.getAllIncome(startDate, endDate);
    res.json(income);
  } catch (error) {
    next(error);
  }
};

const getIncomeById = async (req, res, next) => {
  try {
    const income = await Transaction.getIncomeById(req.params.id);
    if (!income) {
      return res.status(404).json({ error: 'Income record not found' });
    }
    res.json(income);
  } catch (error) {
    next(error);
  }
};

const createIncome = async (req, res, next) => {
  try {
    const { error } = incomeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const income = await Transaction.createIncome(req.body);
    res.status(201).json(income);
  } catch (error) {
    next(error);
  }
};

const updateIncome = async (req, res, next) => {
  try {
    const { error } = incomeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const income = await Transaction.updateIncome(req.params.id, req.body);
    if (!income) {
      return res.status(404).json({ error: 'Income record not found' });
    }
    res.json(income);
  } catch (error) {
    next(error);
  }
};

const deleteIncome = async (req, res, next) => {
  try {
    const deleted = await Transaction.deleteIncome(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Income record not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Expense Controllers
const getExpenses = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const expenses = await Transaction.getAllExpenses(startDate, endDate);
    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Transaction.getExpenseById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense record not found' });
    }
    res.json(expense);
  } catch (error) {
    next(error);
  }
};

const createExpense = async (req, res, next) => {
  try {
    const { error } = expenseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const expense = await Transaction.createExpense(req.body);
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const { error } = expenseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const expense = await Transaction.updateExpense(req.params.id, req.body);
    if (!expense) {
      return res.status(404).json({ error: 'Expense record not found' });
    }
    res.json(expense);
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const deleted = await Transaction.deleteExpense(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Expense record not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Analysis Controllers
const getCashFlowSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const summary = await Transaction.getCashFlowSummary(startDate, endDate);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

const getIncomeByCategory = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const incomeByCategory = await Transaction.getIncomeByCategory(startDate, endDate);
    res.json(incomeByCategory);
  } catch (error) {
    next(error);
  }
};

const getExpensesByCategory = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const expensesByCategory = await Transaction.getExpensesByCategory(startDate, endDate);
    res.json(expensesByCategory);
  } catch (error) {
    next(error);
  }
};

const getMonthlyCashFlow = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const monthlyCashFlow = await Transaction.getMonthlyCashFlow(year);
    res.json(monthlyCashFlow);
  } catch (error) {
    next(error);
  }
};

const getRecurringTransactions = async (req, res, next) => {
  try {
    const recurringTransactions = await Transaction.getRecurringTransactions();
    res.json(recurringTransactions);
  } catch (error) {
    next(error);
  }
};

const getRecentTransactions = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recentTransactions = await Transaction.getRecentTransactions(limit);
    res.json(recentTransactions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Income routes
  getIncome,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
  
  // Expense routes
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  
  // Analysis routes
  getCashFlowSummary,
  getIncomeByCategory,
  getExpensesByCategory,
  getMonthlyCashFlow,
  getRecurringTransactions,
  getRecentTransactions
};