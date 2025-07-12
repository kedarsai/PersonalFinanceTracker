import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error - please check your connection');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred');
    }
  }
);

// Asset API
export const assetAPI = {
  // Investments
  getInvestments: () => api.get('/assets/investments'),
  getInvestment: (id) => api.get(`/assets/investments/${id}`),
  createInvestment: (data) => api.post('/assets/investments', data),
  updateInvestment: (id, data) => api.put(`/assets/investments/${id}`, data),
  deleteInvestment: (id) => api.delete(`/assets/investments/${id}`),

  // Cash Accounts
  getCashAccounts: () => api.get('/assets/cash'),
  getCashAccount: (id) => api.get(`/assets/cash/${id}`),
  createCashAccount: (data) => api.post('/assets/cash', data),
  updateCashAccount: (id, data) => api.put(`/assets/cash/${id}`, data),
  deleteCashAccount: (id) => api.delete(`/assets/cash/${id}`),

  // Physical Assets
  getPhysicalAssets: () => api.get('/assets/physical'),
  getPhysicalAsset: (id) => api.get(`/assets/physical/${id}`),
  createPhysicalAsset: (data) => api.post('/assets/physical', data),
  updatePhysicalAsset: (id, data) => api.put(`/assets/physical/${id}`, data),
  deletePhysicalAsset: (id) => api.delete(`/assets/physical/${id}`),

  // Ownership Stakes
  getOwnershipStakes: () => api.get('/assets/ownership'),
  getOwnershipStake: (id) => api.get(`/assets/ownership/${id}`),
  createOwnershipStake: (data) => api.post('/assets/ownership', data),
  updateOwnershipStake: (id, data) => api.put(`/assets/ownership/${id}`, data),
  deleteOwnershipStake: (id) => api.delete(`/assets/ownership/${id}`),

  // Summary
  getAssetSummary: () => api.get('/assets/summary'),
  getAssetBreakdown: () => api.get('/assets/breakdown'),
};

// Liability API
export const liabilityAPI = {
  getLiabilities: () => api.get('/liabilities'),
  getLiability: (id) => api.get(`/liabilities/${id}`),
  createLiability: (data) => api.post('/liabilities', data),
  updateLiability: (id, data) => api.put(`/liabilities/${id}`, data),
  deleteLiability: (id) => api.delete(`/liabilities/${id}`),
  
  // Summary and analysis
  getLiabilitySummary: () => api.get('/liabilities/summary/overview'),
  getUpcomingPayments: (days = 30) => api.get(`/liabilities/summary/upcoming-payments?days=${days}`),
  getPayoffProjections: () => api.get('/liabilities/summary/payoff-projections'),
};

// Cash Flow API
export const cashFlowAPI = {
  // Income
  getIncome: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/cashflow/income${queryString ? `?${queryString}` : ''}`);
  },
  getIncomeById: (id) => api.get(`/cashflow/income/${id}`),
  createIncome: (data) => api.post('/cashflow/income', data),
  updateIncome: (id, data) => api.put(`/cashflow/income/${id}`, data),
  deleteIncome: (id) => api.delete(`/cashflow/income/${id}`),

  // Expenses
  getExpenses: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/cashflow/expenses${queryString ? `?${queryString}` : ''}`);
  },
  getExpenseById: (id) => api.get(`/cashflow/expenses/${id}`),
  createExpense: (data) => api.post('/cashflow/expenses', data),
  updateExpense: (id, data) => api.put(`/cashflow/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/cashflow/expenses/${id}`),

  // Analysis
  getCashFlowSummary: (startDate, endDate) => 
    api.get(`/cashflow/summary?startDate=${startDate}&endDate=${endDate}`),
  getIncomeByCategory: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/cashflow/income/by-category${queryString ? `?${queryString}` : ''}`);
  },
  getExpensesByCategory: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/cashflow/expenses/by-category${queryString ? `?${queryString}` : ''}`);
  },
  getMonthlyCashFlow: (year) => 
    api.get(`/cashflow/monthly${year ? `?year=${year}` : ''}`),
  getRecurringTransactions: () => api.get('/cashflow/recurring'),
  getRecentTransactions: (limit = 10) => 
    api.get(`/cashflow/recent?limit=${limit}`),
};

// Dashboard API
export const dashboardAPI = {
  getDashboardSummary: () => api.get('/dashboard/summary'),
  getQuickStats: () => api.get('/dashboard/quick-stats'),
  getNetWorthHistory: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/dashboard/networth${queryString ? `?${queryString}` : ''}`);
  },
  saveNetWorthSnapshot: (date) => api.post('/dashboard/networth/snapshot', { date }),
  getCashFlowOverview: (year) => 
    api.get(`/dashboard/cashflow${year ? `?year=${year}` : ''}`),
  getFinancialGoals: () => api.get('/dashboard/goals'),
};

// Utility functions for common date ranges
export const dateUtils = {
  getCurrentMonth: () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  },

  getCurrentYear: () => {
    const now = new Date();
    return {
      startDate: `${now.getFullYear()}-01-01`,
      endDate: `${now.getFullYear()}-12-31`
    };
  },

  getLastNMonths: (months) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  }
};

export default api;