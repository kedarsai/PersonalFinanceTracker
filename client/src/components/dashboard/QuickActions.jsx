import { useState } from 'react';
import { Plus, Wallet, CreditCard, TrendingUp, DollarSign } from 'lucide-react';
import Button from '../ui/Button';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import AssetForm from '../forms/AssetForm';
import LiabilityForm from '../forms/LiabilityForm';
import TransactionForm from '../forms/TransactionForm';

const QuickActions = ({ onDataChange }) => {
  const [activeModal, setActiveModal] = useState(null);

  const quickActions = [
    {
      id: 'add-income',
      title: 'Add Income',
      description: 'Record income transaction',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'add-expense',
      title: 'Add Expense',
      description: 'Record expense transaction',
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      id: 'add-asset',
      title: 'Add Asset',
      description: 'Add investment or cash account',
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'add-liability',
      title: 'Add Liability',
      description: 'Add debt or loan',
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const handleActionClick = (actionId) => {
    setActiveModal(actionId);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleFormSubmit = async (data) => {
    try {
      // Here you would call the appropriate API based on the modal type
      console.log('Form submitted:', activeModal, data);
      
      // Call the onDataChange callback to refresh parent data
      if (onDataChange) {
        onDataChange();
      }
      
      setActiveModal(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                onClick={() => handleActionClick(action.id)}
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50"
              >
                <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center`}>
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <TransactionForm
        isOpen={activeModal === 'add-income'}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        type="income"
      />

      <TransactionForm
        isOpen={activeModal === 'add-expense'}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        type="expense"
      />

      <AssetForm
        isOpen={activeModal === 'add-asset'}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        type="investment"
      />

      <LiabilityForm
        isOpen={activeModal === 'add-liability'}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};

export default QuickActions;