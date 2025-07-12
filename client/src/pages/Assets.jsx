import { useState } from 'react';
// Note: Using simple state-based tabs instead of Headless UI Tabs
import { useApi, useApiMutation } from '../hooks/useApi';
import { assetAPI } from '../services/api';
import DataTable from '../components/ui/DataTable';
import AssetForm from '../components/forms/AssetForm';
import AssetPieChart from '../components/charts/AssetPieChart';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';

const Assets = () => {
  const [activeTab, setActiveTab] = useState('investments');
  const [editingAsset, setEditingAsset] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // API hooks
  const { data: investments, loading: investmentsLoading, error: investmentsError } = useApi(
    () => assetAPI.getInvestments(),
    [refreshKey]
  );

  const { data: cashAccounts, loading: cashLoading, error: cashError } = useApi(
    () => assetAPI.getCashAccounts(),
    [refreshKey]
  );

  const { data: physicalAssets, loading: physicalLoading, error: physicalError } = useApi(
    () => assetAPI.getPhysicalAssets(),
    [refreshKey]
  );

  const { data: ownershipStakes, loading: ownershipLoading, error: ownershipError } = useApi(
    () => assetAPI.getOwnershipStakes(),
    [refreshKey]
  );

  const { data: assetSummary } = useApi(
    () => assetAPI.getAssetSummary(),
    [refreshKey]
  );

  const { mutate, loading: mutationLoading } = useApiMutation();

  // Table configurations
  const investmentColumns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'symbol', label: 'Symbol' },
    { key: 'shares', label: 'Shares', type: 'number' },
    { key: 'price_per_share', label: 'Price/Share', type: 'currency' },
    { key: 'total_value', label: 'Total Value', type: 'currency' },
    { key: 'purchase_date', label: 'Purchase Date', type: 'date' },
  ];

  const cashColumns = [
    { key: 'name', label: 'Account Name' },
    { key: 'account_type', label: 'Type' },
    { key: 'balance', label: 'Balance', type: 'currency' },
    { key: 'interest_rate', label: 'Interest Rate', type: 'percentage' },
  ];

  const physicalColumns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'current_value', label: 'Current Value', type: 'currency' },
    { key: 'purchase_value', label: 'Purchase Value', type: 'currency' },
    { key: 'condition', label: 'Condition' },
    { key: 'purchase_date', label: 'Purchase Date', type: 'date' },
  ];

  const ownershipColumns = [
    { key: 'name', label: 'Name' },
    { key: 'business_name', label: 'Business' },
    { key: 'percentage', label: 'Ownership %', type: 'percentage' },
    { key: 'current_value', label: 'Current Value', type: 'currency' },
    { key: 'investment_date', label: 'Investment Date', type: 'date' },
  ];

  // Handlers
  const handleAdd = (type) => {
    setActiveTab(type);
    setEditingAsset(null);
    setShowForm(true);
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      let deleteFunction;
      switch (activeTab) {
        case 'investments':
          deleteFunction = () => assetAPI.deleteInvestment(id);
          break;
        case 'cash':
          deleteFunction = () => assetAPI.deleteCashAccount(id);
          break;
        case 'physical':
          deleteFunction = () => assetAPI.deletePhysicalAsset(id);
          break;
        case 'ownership':
          deleteFunction = () => assetAPI.deleteOwnershipStake(id);
          break;
      }

      await mutate(deleteFunction, {
        onSuccess: () => {
          setRefreshKey(prev => prev + 1);
        }
      });
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      let submitFunction;
      
      if (editingAsset) {
        // Update
        switch (activeTab) {
          case 'investments':
            submitFunction = () => assetAPI.updateInvestment(editingAsset.id, data);
            break;
          case 'cash':
            submitFunction = () => assetAPI.updateCashAccount(editingAsset.id, data);
            break;
          case 'physical':
            submitFunction = () => assetAPI.updatePhysicalAsset(editingAsset.id, data);
            break;
          case 'ownership':
            submitFunction = () => assetAPI.updateOwnershipStake(editingAsset.id, data);
            break;
        }
      } else {
        // Create
        switch (activeTab) {
          case 'investments':
            submitFunction = () => assetAPI.createInvestment(data);
            break;
          case 'cash':
            submitFunction = () => assetAPI.createCashAccount(data);
            break;
          case 'physical':
            submitFunction = () => assetAPI.createPhysicalAsset(data);
            break;
          case 'ownership':
            submitFunction = () => assetAPI.createOwnershipStake(data);
            break;
        }
      }

      await mutate(submitFunction, {
        onSuccess: () => {
          setShowForm(false);
          setEditingAsset(null);
          setRefreshKey(prev => prev + 1);
        }
      });
    } catch (error) {
      console.error('Error saving asset:', error);
    }
  };

  // Format data for pie chart
  const assetPieData = assetSummary ? [
    { name: 'Investments', value: assetSummary.investments || 0 },
    { name: 'Cash', value: assetSummary.cash || 0 },
    { name: 'Physical Assets', value: assetSummary.physical || 0 },
    { name: 'Ownership Stakes', value: assetSummary.ownership || 0 }
  ].filter(item => item.value > 0) : [];

  const tabs = [
    { id: 'investments', label: 'Investments', count: investments?.length || 0 },
    { id: 'cash', label: 'Cash Accounts', count: cashAccounts?.length || 0 },
    { id: 'physical', label: 'Physical Assets', count: physicalAssets?.length || 0 },
    { id: 'ownership', label: 'Ownership Stakes', count: ownershipStakes?.length || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="text-gray-600">Manage your investments, cash accounts, and assets</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Asset Value</p>
          <p className="text-2xl font-bold text-green-600">
            {assetSummary ? `$${assetSummary.total.toLocaleString()}` : 'Loading...'}
          </p>
        </div>
      </div>

      {/* Asset Allocation Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AssetPieChart data={assetPieData} title="Asset Allocation" height={300} />
        </div>
        <div className="space-y-4">
          {assetSummary && (
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Investments</span>
                  <span className="font-medium">${assetSummary.investments?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cash</span>
                  <span className="font-medium">${assetSummary.cash?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Physical Assets</span>
                  <span className="font-medium">${assetSummary.physical?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ownership Stakes</span>
                  <span className="font-medium">${assetSummary.ownership?.toLocaleString() || 0}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-green-600">${assetSummary.total?.toLocaleString() || 0}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
          {activeTab === 'investments' && (
            <DataTable
              title="Investments"
              data={investments || []}
              columns={investmentColumns}
              loading={investmentsLoading}
              error={investmentsError}
              onAdd={() => handleAdd('investments')}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyMessage="No investments found"
              emptyDescription="Start building your investment portfolio"
            />
          )}

          {activeTab === 'cash' && (
            <DataTable
              title="Cash Accounts"
              data={cashAccounts || []}
              columns={cashColumns}
              loading={cashLoading}
              error={cashError}
              onAdd={() => handleAdd('cash')}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyMessage="No cash accounts found"
              emptyDescription="Add your bank accounts to track cash flow"
            />
          )}

          {activeTab === 'physical' && (
            <DataTable
              title="Physical Assets"
              data={physicalAssets || []}
              columns={physicalColumns}
              loading={physicalLoading}
              error={physicalError}
              onAdd={() => handleAdd('physical')}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyMessage="No physical assets found"
              emptyDescription="Track vehicles, jewelry, and other valuable items"
            />
          )}

          {activeTab === 'ownership' && (
            <DataTable
              title="Ownership Stakes"
              data={ownershipStakes || []}
              columns={ownershipColumns}
              loading={ownershipLoading}
              error={ownershipError}
              onAdd={() => handleAdd('ownership')}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyMessage="No ownership stakes found"
              emptyDescription="Add business partnerships and equity positions"
            />
          )}
        </div>
      </div>

      {/* Asset Form Modal */}
      <AssetForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingAsset(null);
        }}
        onSubmit={handleFormSubmit}
        asset={editingAsset}
        type={activeTab}
        isLoading={mutationLoading}
      />
    </div>
  );
};

export default Assets;