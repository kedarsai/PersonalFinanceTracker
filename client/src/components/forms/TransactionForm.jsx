import { useState } from 'react';
import { Input, Label, FormGroup, ErrorMessage, Select, Textarea } from '../ui/Input';
import Button from '../ui/Button';
import { Modal, ModalBody, ModalFooter } from '../ui/Modal';

const TransactionForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  transaction = null, 
  type = 'income', // 'income' or 'expense'
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    source: transaction?.source || transaction?.description || '',
    description: transaction?.description || transaction?.source || '',
    amount: transaction?.amount || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    category: transaction?.category || (type === 'income' ? 'salary' : 'other'),
    is_recurring: transaction?.is_recurring || false,
    frequency: transaction?.frequency || '',
    notes: transaction?.notes || ''
  });

  const [errors, setErrors] = useState({});

  const incomeCategories = [
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'business', label: 'Business' },
    { value: 'dividends', label: 'Dividends' },
    { value: 'other', label: 'Other' }
  ];

  const expenseCategories = [
    { value: 'housing', label: 'Housing' },
    { value: 'food', label: 'Food' },
    { value: 'transport', label: 'Transportation' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'other', label: 'Other' }
  ];

  const frequencies = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' }
  ];

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const nameField = type === 'income' ? 'source' : 'description';
    if (!formData[nameField].trim()) {
      newErrors[nameField] = `${type === 'income' ? 'Source' : 'Description'} is required`;
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.is_recurring && !formData.frequency) {
      newErrors.frequency = 'Frequency is required for recurring transactions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Clean up form data
    const cleanedData = { ...formData };
    
    // Convert amount to number
    cleanedData.amount = parseFloat(cleanedData.amount);

    // Remove frequency if not recurring
    if (!cleanedData.is_recurring) {
      delete cleanedData.frequency;
    }

    // Remove empty fields
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === '' || cleanedData[key] === undefined) {
        delete cleanedData[key];
      }
    });

    onSubmit(cleanedData);
  };

  const categories = type === 'income' ? incomeCategories : expenseCategories;
  const nameField = type === 'income' ? 'source' : 'description';
  const namePlaceholder = type === 'income' ? 'e.g., Software Engineer Salary' : 'e.g., Groceries';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${transaction ? 'Edit' : 'Add'} ${type === 'income' ? 'Income' : 'Expense'}`} 
      maxWidth="max-w-2xl"
    >
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup>
            <Label htmlFor={nameField}>
              {type === 'income' ? 'Source' : 'Description'}
            </Label>
            <Input
              id={nameField}
              name={nameField}
              value={formData[nameField]}
              onChange={handleChange}
              error={!!errors[nameField]}
              placeholder={namePlaceholder}
            />
            <ErrorMessage>{errors[nameField]}</ErrorMessage>
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                error={!!errors.amount}
                placeholder="0.00"
              />
              <ErrorMessage>{errors.amount}</ErrorMessage>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                error={!!errors.date}
              />
              <ErrorMessage>{errors.date}</ErrorMessage>
            </FormGroup>
          </div>

          <FormGroup>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={!!errors.category}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Select>
            <ErrorMessage>{errors.category}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <div className="flex items-center">
              <input
                id="is_recurring"
                name="is_recurring"
                type="checkbox"
                checked={formData.is_recurring}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <Label htmlFor="is_recurring" className="ml-2 mb-0">
                This is a recurring transaction
              </Label>
            </div>
          </FormGroup>

          {formData.is_recurring && (
            <FormGroup>
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                error={!!errors.frequency}
              >
                <option value="">Select frequency</option>
                {frequencies.map(freq => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </Select>
              <ErrorMessage>{errors.frequency}</ErrorMessage>
            </FormGroup>
          )}

          <FormGroup>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional details about this transaction"
            />
          </FormGroup>
        </form>
      </ModalBody>
      
      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (transaction ? 'Update' : 'Create')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TransactionForm;