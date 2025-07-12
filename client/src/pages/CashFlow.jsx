import { useState } from 'react';
import { useApi, useApiMutation } from '../hooks/useApi';
import { cashFlowAPI, dateUtils } from '../services/api';
import DataTable from '../components/ui/DataTable';
import TransactionForm from '../components/forms/TransactionForm';
import CashFlowChart from '../components/charts/CashFlowChart';
import CategoryChart from '../components/charts/CategoryChart';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Input, Label, FormGroup, Select } from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const CashFlow = () => {
  const [activeTab, setActiveTab] = useState('income');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dateRange, setDateRange] = useState(() => {
    const currentMonth = dateUtils.getCurrentMonth();
    return currentMonth;
  });

  // API hooks
  const { data: income, loading: incomeLoading, error: incomeError } = useApi(
    () => cashFlowAPI.getIncome(dateRange),
    [refreshKey, dateRange]
  );

  const { data: expenses, loading: expensesLoading, error: expensesError } = useApi(
    () => cashFlowAPI.getExpenses(dateRange),
    [refreshKey, dateRange]
  );

  const { data: cashFlowSummary } = useApi(
    () => cashFlowAPI.getCashFlowSummary(dateRange.startDate, dateRange.endDate),
    [refreshKey, dateRange]
  );

  const { data: monthlyCashFlow } = useApi(
    () => cashFlowAPI.getMonthlyCashFlow(new Date().getFullYear()),
    [refreshKey]
  );

  const { data: incomeByCategory } = useApi(
    () => cashFlowAPI.getIncomeByCategory(dateRange),
    [refreshKey, dateRange]
  );

  const { data: expensesByCategory } = useApi(
    () => cashFlowAPI.getExpensesByCategory(dateRange),
    [refreshKey, dateRange]
  );

  const { data: recurringTransactions } = useApi(
    () => cashFlowAPI.getRecurringTransactions(),
    [refreshKey]
  );

  const { mutate, loading: mutationLoading } = useApiMutation();

  // Table configurations
  const incomeColumns = [
    { key: 'source', label: 'Source' },
    { key: 'amount', label: 'Amount', type: 'currency' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'category', label: 'Category' },
    { key: 'is_recurring', label: 'Recurring' },
    { key: 'frequency', label: 'Frequency' },
  ];

  const expenseColumns = [
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount', type: 'currency' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'category', label: 'Category' },
    { key: 'is_recurring', label: 'Recurring' },
    { key: 'frequency', label: 'Frequency' },
  ];

  // Handlers
  const handleAdd = (type) => {
    setActiveTab(type);
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const deleteFunction = activeTab === 'income'
        ? () => cashFlowAPI.deleteIncome(id)
        : () => cashFlowAPI.deleteExpense(id);

      await mutate(deleteFunction, {
        onSuccess: () => {
          setRefreshKey(prev => prev + 1);
        }
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      let submitFunction;
      
      if (editingTransaction) {
        // Update
        submitFunction = activeTab === 'income'
          ? () => cashFlowAPI.updateIncome(editingTransaction.id, data)
          : () => cashFlowAPI.updateExpense(editingTransaction.id, data);
      } else {
        // Create
        submitFunction = activeTab === 'income'
          ? () => cashFlowAPI.createIncome(data)
          : () => cashFlowAPI.createExpense(data);
      }

      await mutate(submitFunction, {
        onSuccess: () => {
          setShowForm(false);
          setEditingTransaction(null);
          setRefreshKey(prev => prev + 1);
        }
      });
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const setPresetDateRange = (preset) => {
    let newRange;
    switch (preset) {
      case 'currentMonth':
        newRange = dateUtils.getCurrentMonth();
        break;
      case 'currentYear':
        newRange = dateUtils.getCurrentYear();
        break;
      case 'last3Months':
        newRange = dateUtils.getLastNMonths(3);
        break;
      case 'last6Months':
        newRange = dateUtils.getLastNMonths(6);
        break;
      default:
        return;
    }
    setDateRange(newRange);
  };

  // Format data for charts
  const incomeCategoryData = incomeByCategory?.map(item => ({
    category: item.category,
    value: item.total
  })) || [];

  const expenseCategoryData = expensesByCategory?.map(item => ({
    category: item.category,
    value: item.total
  })) || [];

  const tabs = [
    { id: 'income', label: 'Income', count: income?.length || 0 },
    { id: 'expenses', label: 'Expenses', count: expenses?.length || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cash Flow</h1>
          <p className="text-gray-600">Track your income and expenses</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Net Cash Flow</p>
          <p className={`text-2xl font-bold ${
            cashFlowSummary?.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {cashFlowSummary ? 
              `${cashFlowSummary.netCashFlow >= 0 ? '+' : ''}$${cashFlowSummary.netCashFlow.toLocaleString()}` 
              : 'Loading...'
            }
          </p>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPresetDateRange('currentMonth')}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                This Month
              </button>
              <button
                onClick={() => setPresetDateRange('last3Months')}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Last 3 Months
              </button>
              <button
                onClick={() => setPresetDateRange('currentYear')}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                This Year
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="startDate" className="text-sm">From:</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                className="w-auto"
              />
              <Label htmlFor="endDate" className="text-sm">To:</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                className="w-auto"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  ${cashFlowSummary?.totalIncome?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  ${cashFlowSummary?.totalExpenses?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Net Cash Flow</p>
                <p className={`text-2xl font-bold ${
                  cashFlowSummary?.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {cashFlowSummary?.netCashFlow >= 0 ? '+' : ''}${cashFlowSummary?.netCashFlow?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashFlowChart
          data={monthlyCashFlow || []}
          title="Monthly Cash Flow"
          height={300}
        />
        
        <div className="space-y-4">
          <CategoryChart
            data={incomeCategoryData}
            title="Income by Category"
            height={200}
            color="#10b981"
            dataKey="value"
            categoryKey="category"
          />
          <CategoryChart
            data={expenseCategoryData}
            title="Expenses by Category"
            height={200}
            color="#ef4444"
            dataKey="value"
            categoryKey="category"
          />
        </div>
      </div>

      {/* Recurring Transactions */}
      {recurringTransactions && (
        <Card>
          <CardHeader>
            <CardTitle>Recurring Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recurring Income</h4>
                <div className="space-y-2">
                  {recurringTransactions.income?.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{item.source}</p>
                        <Badge variant="success" size="sm">{item.frequency}</Badge>
                      </div>
                      <p className="font-medium text-green-600">
                        +${item.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <p className="text-sm text-gray-500">
                    Total: +${recurringTransactions.totalRecurringIncome?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recurring Expenses</h4>
                <div className="space-y-2">
                  {recurringTransactions.expenses?.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{item.description}</p>
                        <Badge variant="danger" size="sm">{item.frequency}</Badge>
                      </div>
                      <p className="font-medium text-red-600">
                        -${item.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <p className="text-sm text-gray-500">
                    Total: -${recurringTransactions.totalRecurringExpenses?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="w-full">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'income' && (
            <DataTable
              title="Income Transactions"
              data={income || []}
              columns={incomeColumns}
              loading={incomeLoading}
              error={incomeError}
              onAdd={() => handleAdd('income')}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyMessage="No income transactions found"
              emptyDescription="Start tracking your income sources"
            />
          )}

          {activeTab === 'expenses' && (
            <DataTable
              title="Expense Transactions"
              data={expenses || []}
              columns={expenseColumns}
              loading={expensesLoading}
              error={expensesError}
              onAdd={() => handleAdd('expenses')}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyMessage="No expense transactions found"
              emptyDescription="Start tracking your expenses"
            />
          )}
        </div>
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleFormSubmit}
        transaction={editingTransaction}
        type={activeTab === 'income' ? 'income' : 'expense'}
        isLoading={mutationLoading}
      />
    </div>
  );
};

export default CashFlow;