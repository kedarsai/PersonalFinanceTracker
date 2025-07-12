import { useState } from 'react';
import { useApi, useApiMutation } from '../hooks/useApi';
import { liabilityAPI } from '../services/api';
import DataTable from '../components/ui/DataTable';
import LiabilityForm from '../components/forms/LiabilityForm';
import CategoryChart from '../components/charts/CategoryChart';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Liabilities = () => {
  const [editingLiability, setEditingLiability] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // API hooks
  const { data: liabilities, loading: liabilitiesLoading, error: liabilitiesError } = useApi(
    () => liabilityAPI.getLiabilities(),
    [refreshKey]
  );

  const { data: liabilitySummary } = useApi(
    () => liabilityAPI.getLiabilitySummary(),
    [refreshKey]
  );

  const { data: upcomingPayments } = useApi(
    () => liabilityAPI.getUpcomingPayments(30),
    [refreshKey]
  );

  const { mutate, loading: mutationLoading } = useApiMutation();

  // Table configuration
  const liabilityColumns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'principal_amount', label: 'Principal', type: 'currency' },
    { key: 'current_balance', label: 'Current Balance', type: 'currency' },
    { key: 'interest_rate', label: 'Interest Rate', type: 'percentage' },
    { key: 'monthly_payment', label: 'Monthly Payment', type: 'currency' },
    { key: 'due_date', label: 'Due Date', type: 'date' },
  ];

  // Handlers
  const handleAdd = () => {
    setEditingLiability(null);
    setShowForm(true);
  };

  const handleEdit = (liability) => {
    setEditingLiability(liability);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await mutate(() => liabilityAPI.deleteLiability(id), {
        onSuccess: () => {
          setRefreshKey(prev => prev + 1);
        }
      });
    } catch (error) {
      console.error('Error deleting liability:', error);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      const submitFunction = editingLiability
        ? () => liabilityAPI.updateLiability(editingLiability.id, data)
        : () => liabilityAPI.createLiability(data);

      await mutate(submitFunction, {
        onSuccess: () => {
          setShowForm(false);
          setEditingLiability(null);
          setRefreshKey(prev => prev + 1);
        }
      });
    } catch (error) {
      console.error('Error saving liability:', error);
    }
  };

  // Format data for category chart
  const categoryChartData = liabilitySummary?.liabilitiesByCategory?.map(item => ({
    category: item.category,
    value: item.total
  })) || [];

  // Format payoff projections
  const formatPayoffDate = (monthsToPayoff) => {
    if (!monthsToPayoff || !isFinite(monthsToPayoff)) return 'N/A';
    const years = Math.floor(monthsToPayoff / 12);
    const months = monthsToPayoff % 12;
    if (years > 0) {
      return `${years}y ${months}m`;
    }
    return `${months}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Liabilities</h1>
          <p className="text-gray-600">Manage your debts, loans, and liabilities</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Liabilities</p>
          <p className="text-2xl font-bold text-red-600">
            {liabilitySummary ? `$${liabilitySummary.totalLiabilities.toLocaleString()}` : 'Loading...'}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Debt</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${liabilitySummary?.totalLiabilities?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Monthly Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${liabilitySummary?.totalMonthlyPayments?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Number of Debts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {liabilities?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Upcoming Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart
          data={categoryChartData}
          title="Liabilities by Category"
          height={300}
          color="#ef4444"
          dataKey="value"
          categoryKey="category"
        />

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingPayments && upcomingPayments.length > 0 ? (
              <div className="space-y-3">
                {upcomingPayments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{payment.name}</p>
                      <p className="text-sm text-gray-600">
                        Due: {new Date(payment.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${payment.monthly_payment?.toLocaleString() || 'N/A'}
                      </p>
                      <Badge variant="warning" size="sm">
                        {payment.category}
                      </Badge>
                    </div>
                  </div>
                ))}
                {upcomingPayments.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{upcomingPayments.length - 5} more payments
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No upcoming payments in the next 30 days</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payoff Projections */}
      {liabilitySummary?.payoffProjections && liabilitySummary.payoffProjections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payoff Projections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liabilitySummary.payoffProjections.map((projection) => (
                <div key={projection.id} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{projection.name}</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time to payoff:</span>
                      <span className="font-medium">
                        {formatPayoffDate(projection.monthsToPayoff)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total interest:</span>
                      <span className="font-medium">
                        ${projection.totalInterest?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    {projection.payoffDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payoff date:</span>
                        <span className="font-medium">
                          {new Date(projection.payoffDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liabilities Table */}
      <DataTable
        title="All Liabilities"
        data={liabilities || []}
        columns={liabilityColumns}
        loading={liabilitiesLoading}
        error={liabilitiesError}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No liabilities found"
        emptyDescription="Add your debts and loans to track payments and payoff progress"
      />

      {/* Liability Form Modal */}
      <LiabilityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingLiability(null);
        }}
        onSubmit={handleFormSubmit}
        liability={editingLiability}
        isLoading={mutationLoading}
      />
    </div>
  );
};

export default Liabilities;