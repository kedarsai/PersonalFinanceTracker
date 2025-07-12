import { forwardRef } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const StatsCard = forwardRef(({ 
  title, 
  value, 
  previousValue, 
  icon: Icon, 
  loading = false,
  error = null,
  format = 'currency',
  className = '' 
}, ref) => {
  const formatValue = (val) => {
    if (val === null || val === undefined || isNaN(val)) return 'N/A';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(val);
      default:
        return val.toString();
    }
  };

  const getTrendInfo = () => {
    if (previousValue === null || previousValue === undefined || value === null || value === undefined) {
      return null;
    }

    const change = value - previousValue;
    const percentChange = previousValue !== 0 ? (change / Math.abs(previousValue)) * 100 : 0;

    return {
      change,
      percentChange,
      isPositive: change > 0,
      isNeutral: change === 0
    };
  };

  const trend = getTrendInfo();

  if (loading) {
    return (
      <Card ref={ref} className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-24">
            <LoadingSpinner size="md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card ref={ref} className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-24 text-red-500 text-sm">
            Error loading data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={ref} className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(value)}
            </p>
            {trend && (
              <div className="flex items-center mt-2">
                {trend.isNeutral ? (
                  <Minus className="h-4 w-4 text-gray-400 mr-1" />
                ) : trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  trend.isNeutral ? 'text-gray-500' :
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? '+' : ''}{trend.percentChange.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  from last period
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="flex-shrink-0 ml-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;