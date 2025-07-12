import { forwardRef } from 'react';

const Input = forwardRef(({ 
  className = '', 
  type = 'text',
  error = false,
  ...props 
}, ref) => {
  const baseClasses = 'block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50';
  const normalClasses = 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500';
  
  const classes = `${baseClasses} ${error ? errorClasses : normalClasses} ${className}`;
  
  return (
    <input
      ref={ref}
      type={type}
      className={classes}
      {...props}
    />
  );
});

Input.displayName = 'Input';

const Label = forwardRef(({ className = '', children, htmlFor, ...props }, ref) => {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = 'Label';

const FormGroup = ({ children, className = '' }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {children}
    </div>
  );
};

const ErrorMessage = ({ children, className = '' }) => {
  if (!children) return null;
  
  return (
    <p className={`text-sm text-red-600 ${className}`}>
      {children}
    </p>
  );
};

const Select = forwardRef(({ 
  className = '', 
  error = false,
  children,
  ...props 
}, ref) => {
  const baseClasses = 'block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50';
  const normalClasses = 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500';
  
  const classes = `${baseClasses} ${error ? errorClasses : normalClasses} ${className}`;
  
  return (
    <select
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

const Textarea = forwardRef(({ 
  className = '', 
  error = false,
  rows = 3,
  ...props 
}, ref) => {
  const baseClasses = 'block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical';
  const normalClasses = 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500';
  
  const classes = `${baseClasses} ${error ? errorClasses : normalClasses} ${className}`;
  
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={classes}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Input, Label, FormGroup, ErrorMessage, Select, Textarea };