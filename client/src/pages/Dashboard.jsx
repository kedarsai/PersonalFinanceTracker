import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Wallet, CreditCard } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { dashboardAPI, dateUtils } from '../services/api';
import StatsCard from '../components/dashboard/StatsCard';
import QuickActions from '../components/dashboard/QuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';
import NetWorthChart from '../components/charts/NetWorthChart';
import CashFlowChart from '../components/charts/CashFlowChart';
import AssetPieChart from '../components/charts/AssetPieChart';

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  // API calls
  const { 
    data: quickStats, 
    loading: statsLoading, 
    error: statsError, 
    refetch: refetchStats 
  } = useApi(() => dashboardAPI.getQuickStats(), [refreshKey]);

  const { 
    data: dashboardSummary, 
    loading: summaryLoading, 
    refetch: refetchSummary 
  } = useApi(() => dashboardAPI.getDashboardSummary(), [refreshKey]);

  const { 
    data: netWorthData, 
    loading: netWorthLoading 
  } = useApi(() => dashboardAPI.getNetWorthHistory({ limit: 12 }), [refreshKey]);

  const { 
    data: cashFlowData, 
    loading: cashFlowLoading 
  } = useApi(() => dashboardAPI.getCashFlowOverview(), [refreshKey]);

  // Handle data changes from quick actions
  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Format data for charts
  const netWorthChartData = netWorthData?.history || [];
  const cashFlowChartData = cashFlowData?.monthlyCashFlow || [];
  const assetPieData = dashboardSummary?.assetBreakdown ? [
    { name: 'Investments', value: dashboardSummary.assetBreakdown.investments?.reduce((sum, item) => sum + item.value, 0) || 0 },
    { name: 'Cash', value: dashboardSummary.assetBreakdown.cashAccounts?.reduce((sum, item) => sum + item.value, 0) || 0 },
    { name: 'Physical Assets', value: dashboardSummary.assetBreakdown.physicalAssets?.reduce((sum, item) => sum + item.value, 0) || 0 }
  ].filter(item => item.value > 0) : [];

  const recentTransactions = dashboardSummary?.recentTransactions || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your financial overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Net Worth"
          value={quickStats?.netWorth}
          icon={TrendingUp}
          loading={statsLoading}
          error={statsError}
        />
        <StatsCard
          title="Total Assets"
          value={quickStats?.totalAssets}
          icon={Wallet}
          loading={statsLoading}
          error={statsError}
        />
        <StatsCard
          title="Total Liabilities"
          value={quickStats?.totalLiabilities}
          icon={CreditCard}
          loading={statsLoading}
          error={statsError}
        />
        <StatsCard
          title="Monthly Cash Flow"
          value={quickStats?.monthlyNetCashFlow}
          icon={DollarSign}
          loading={statsLoading}
          error={statsError}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NetWorthChart 
          data={netWorthChartData} 
          title="Net Worth Trend"
          height={350}
        />
        <AssetPieChart 
          data={assetPieData} 
          title="Asset Allocation"
          height={350}
        />
      </div>

      {/* Cash Flow Chart */}
      <div className="grid grid-cols-1 gap-6">
        <CashFlowChart 
          data={cashFlowChartData} 
          title="Monthly Cash Flow"
          height={300}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity 
            transactions={recentTransactions}
            loading={summaryLoading}
          />
        </div>
        <QuickActions onDataChange={handleDataChange} />
      </div>

      {/* Development Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Development Mode</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                This dashboard will connect to live data once the backend server is restarted. 
                Currently showing sample data from the database.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;