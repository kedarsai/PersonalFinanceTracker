import { forwardRef } from 'react';

const LoadingSpinner = forwardRef(({ 
  className = '', 
  size = 'md',
  ...props 
}, ref) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };
  
  const classes = `animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${sizes[size]} ${className}`;
  
  return (
    <div
      ref={ref}
      className={classes}
      {...props}
    />
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

const LoadingOverlay = ({ isLoading, children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  );
};

const LoadingButton = forwardRef(({ 
  isLoading, 
  children, 
  disabled,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center">
          <LoadingSpinner size="sm" className="mr-2" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
});

LoadingButton.displayName = 'LoadingButton';

export { LoadingSpinner, LoadingOverlay, LoadingButton };