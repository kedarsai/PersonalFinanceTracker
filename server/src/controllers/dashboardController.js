const Asset = require('../models/Asset');
const Liability = require('../models/Liability');
const Transaction = require('../models/Transaction');
const NetWorth = require('../models/NetWorth');

const getDashboardSummary = async (req, res, next) => {
  try {
    // Get current net worth calculation
    const netWorthData = await NetWorth.calculateCurrentNetWorth();
    
    // Get recent transactions
    const recentTransactions = await Transaction.getRecentTransactions(5);
    
    // Get upcoming payments (next 30 days)
    const upcomingPayments = await Liability.getUpcomingPayments(30);
    
    // Get this month's cash flow
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const monthlyCashFlow = await Transaction.getCashFlowSummary(
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    );
    
    // Get asset breakdown
    const assetBreakdown = await Asset.getAssetBreakdown();
    
    // Get liability breakdown
    const liabilityBreakdown = await Liability.getLiabilitiesByCategory();
    
    res.json({
      netWorth: netWorthData,
      recentTransactions,
      upcomingPayments,
      monthlyCashFlow,
      assetBreakdown,
      liabilityBreakdown,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

const getNetWorthHistory = async (req, res, next) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const history = await NetWorth.getNetWorthHistory(startDate, endDate, limit);
    
    // Also include current calculated net worth if no recent snapshot exists
    const latestSnapshot = history[0];
    const currentNetWorth = await NetWorth.calculateCurrentNetWorth();
    
    res.json({
      history,
      current: currentNetWorth,
      trend: history.length > 1 ? await NetWorth.getNetWorthTrend() : null
    });
  } catch (error) {
    next(error);
  }
};

const getCashFlowOverview = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    
    // Get monthly cash flow for the year
    const monthlyCashFlow = await Transaction.getMonthlyCashFlow(year);
    
    // Get recurring transactions
    const recurringTransactions = await Transaction.getRecurringTransactions();
    
    // Get income and expense breakdowns for the current year
    const yearStart = `${year}-01-01`;
    const yearEnd = `${year}-12-31`;
    
    const incomeByCategory = await Transaction.getIncomeByCategory(yearStart, yearEnd);
    const expensesByCategory = await Transaction.getExpensesByCategory(yearStart, yearEnd);
    
    res.json({
      year,
      monthlyCashFlow,
      recurringTransactions,
      incomeByCategory,
      expensesByCategory,
      yearToDateSummary: await Transaction.getCashFlowSummary(yearStart, new Date().toISOString().split('T')[0])
    });
  } catch (error) {
    next(error);
  }
};

const saveNetWorthSnapshot = async (req, res, next) => {
  try {
    const { date } = req.body;
    const snapshot = await NetWorth.saveNetWorthSnapshot(date);
    res.json(snapshot);
  } catch (error) {
    next(error);
  }
};

const getFinancialGoals = async (req, res, next) => {
  try {
    const goals = await NetWorth.getNetWorthGoals();
    res.json(goals);
  } catch (error) {
    next(error);
  }
};

const getQuickStats = async (req, res, next) => {
  try {
    // Get key financial metrics for quick overview
    const netWorth = await NetWorth.calculateCurrentNetWorth();
    const totalMonthlyPayments = await Liability.getTotalMonthlyPayments();
    
    // Current month cash flow
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const monthlyCashFlow = await Transaction.getCashFlowSummary(
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    );
    
    // Get net worth trend
    const trend = await NetWorth.getNetWorthTrend(6); // 6 months trend
    
    res.json({
      netWorth: netWorth.netWorth,
      totalAssets: netWorth.totalAssets,
      totalLiabilities: netWorth.totalLiabilities,
      monthlyIncome: monthlyCashFlow.totalIncome,
      monthlyExpenses: monthlyCashFlow.totalExpenses,
      monthlyNetCashFlow: monthlyCashFlow.netCashFlow,
      monthlyDebtPayments: totalMonthlyPayments,
      netWorthTrend: trend,
      calculatedAt: netWorth.calculatedAt
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
  getNetWorthHistory,
  getCashFlowOverview,
  saveNetWorthSnapshot,
  getFinancialGoals,
  getQuickStats
};