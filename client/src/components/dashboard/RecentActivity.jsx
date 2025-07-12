import { formatDistanceToNow } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const RecentActivity = ({ transactions = [], loading = false, error = null }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'income' ? ArrowUpCircle : ArrowDownCircle;
  };

  const getTransactionColor = (type) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const getCategoryBadgeVariant = (category) => {
    const variants = {
      salary: 'primary',
      freelance: 'secondary',
      business: 'success',
      dividends: 'primary',
      housing: 'warning',
      food: 'secondary',
      transport: 'primary',
      entertainment: 'success',
      utilities: 'warning',
    };
    return variants[category] || 'default';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <LoadingSpinner size="lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-red-500">
            Error loading recent activity
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <Clock className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-sm">No recent transactions</p>
            <p className="text-xs text-gray-400 mt-1">Add income or expenses to see them here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const Icon = getTransactionIcon(transaction.type);
            const description = transaction.type === 'income' ? transaction.source : transaction.description;
            
            return (
              <div key={transaction.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Icon className={`h-6 w-6 ${getTransactionColor(transaction.type)}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={getCategoryBadgeVariant(transaction.category)} 
                        size="sm"
                      >
                        {transaction.category}
                      </Badge>
                      {transaction.is_recurring && (
                        <Badge variant="outline" size="sm">
                          Recurring
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {transactions.length >= 5 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all transactions →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;