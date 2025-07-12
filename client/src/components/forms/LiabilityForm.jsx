import { useState } from 'react';
import { Input, Label, FormGroup, ErrorMessage, Textarea } from '../ui/Input';
import Button from '../ui/Button';
import { Modal, ModalBody, ModalFooter } from '../ui/Modal';

const LiabilityForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  liability = null, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    name: liability?.name || '',
    category: liability?.category || '',
    principal_amount: liability?.principal_amount || '',
    current_balance: liability?.current_balance || '',
    interest_rate: liability?.interest_rate || '',
    monthly_payment: liability?.monthly_payment || '',
    due_date: liability?.due_date || '',
    notes: liability?.notes || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.principal_amount || formData.principal_amount <= 0) {
      newErrors.principal_amount = 'Principal amount must be greater than 0';
    }

    if (!formData.current_balance || formData.current_balance < 0) {
      newErrors.current_balance = 'Current balance must be 0 or greater';
    }

    if (formData.interest_rate && formData.interest_rate < 0) {
      newErrors.interest_rate = 'Interest rate cannot be negative';
    }

    if (formData.monthly_payment && formData.monthly_payment < 0) {
      newErrors.monthly_payment = 'Monthly payment cannot be negative';
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
    
    // Convert numeric fields
    const numericFields = ['principal_amount', 'current_balance', 'interest_rate', 'monthly_payment'];
    numericFields.forEach(field => {
      if (cleanedData[field] !== '' && cleanedData[field] !== undefined) {
        cleanedData[field] = parseFloat(cleanedData[field]);
      }
    });

    // Remove empty fields
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === '' || cleanedData[key] === undefined) {
        delete cleanedData[key];
      }
    });

    onSubmit(cleanedData);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${liability ? 'Edit' : 'Add'} Liability`} 
      maxWidth="max-w-2xl"
    >
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              placeholder="e.g., Home Mortgage, Car Loan"
            />
            <ErrorMessage>{errors.name}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={!!errors.category}
              placeholder="e.g., mortgage, auto, credit, student"
            />
            <ErrorMessage>{errors.category}</ErrorMessage>
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup>
              <Label htmlFor="principal_amount">Principal Amount</Label>
              <Input
                id="principal_amount"
                name="principal_amount"
                type="number"
                step="0.01"
                value={formData.principal_amount}
                onChange={handleChange}
                error={!!errors.principal_amount}
                placeholder="300000.00"
              />
              <ErrorMessage>{errors.principal_amount}</ErrorMessage>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="current_balance">Current Balance</Label>
              <Input
                id="current_balance"
                name="current_balance"
                type="number"
                step="0.01"
                value={formData.current_balance}
                onChange={handleChange}
                error={!!errors.current_balance}
                placeholder="275000.00"
              />
              <ErrorMessage>{errors.current_balance}</ErrorMessage>
            </FormGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup>
              <Label htmlFor="interest_rate">Interest Rate (%) (Optional)</Label>
              <Input
                id="interest_rate"
                name="interest_rate"
                type="number"
                step="0.01"
                value={formData.interest_rate}
                onChange={handleChange}
                error={!!errors.interest_rate}
                placeholder="3.25"
              />
              <ErrorMessage>{errors.interest_rate}</ErrorMessage>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="monthly_payment">Monthly Payment (Optional)</Label>
              <Input
                id="monthly_payment"
                name="monthly_payment"
                type="number"
                step="0.01"
                value={formData.monthly_payment}
                onChange={handleChange}
                error={!!errors.monthly_payment}
                placeholder="1800.00"
              />
              <ErrorMessage>{errors.monthly_payment}</ErrorMessage>
            </FormGroup>
          </div>

          <FormGroup>
            <Label htmlFor="due_date">Due Date (Optional)</Label>
            <Input
              id="due_date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional details about the liability"
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
          {isLoading ? 'Saving...' : (liability ? 'Update' : 'Create')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default LiabilityForm;