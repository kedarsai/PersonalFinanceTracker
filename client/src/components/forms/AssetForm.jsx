import { useState } from 'react';
import { Input, Label, FormGroup, ErrorMessage, Select, Textarea } from '../ui/Input';
import Button from '../ui/Button';
import { Modal, ModalBody, ModalFooter } from '../ui/Modal';

const AssetForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  asset = null, 
  type = 'investment',
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    type: asset?.type || (type === 'investments' ? 'stock' : ''),
    symbol: asset?.symbol || '',
    shares: asset?.shares || '',
    price_per_share: asset?.price_per_share || '',
    total_value: asset?.total_value || '',
    purchase_date: asset?.purchase_date || '',
    account_type: asset?.account_type || 'checking',
    balance: asset?.balance || '',
    interest_rate: asset?.interest_rate || '',
    category: asset?.category || 'vehicle',
    current_value: asset?.current_value || '',
    purchase_value: asset?.purchase_value || '',
    condition: asset?.condition || 'good',
    business_name: asset?.business_name || '',
    percentage: asset?.percentage || '',
    investment_date: asset?.investment_date || '',
    notes: asset?.notes || ''
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

    // Common validations
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Type-specific validations
    switch (type) {
      case 'investments':
        if (!formData.type) newErrors.type = 'Investment type is required';
        if (!formData.total_value || formData.total_value <= 0) {
          newErrors.total_value = 'Total value must be greater than 0';
        }
        break;

      case 'cash':
        if (!formData.account_type) newErrors.account_type = 'Account type is required';
        if (!formData.balance || formData.balance < 0) {
          newErrors.balance = 'Balance must be 0 or greater';
        }
        break;

      case 'physical':
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.current_value || formData.current_value <= 0) {
          newErrors.current_value = 'Current value must be greater than 0';
        }
        break;

      case 'ownership':
        if (!formData.business_name.trim()) {
          newErrors.business_name = 'Business name is required';
        }
        if (!formData.percentage || formData.percentage <= 0 || formData.percentage > 100) {
          newErrors.percentage = 'Percentage must be between 0 and 100';
        }
        if (!formData.current_value || formData.current_value <= 0) {
          newErrors.current_value = 'Current value must be greater than 0';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    console.log('Asset type:', type);
    
    if (!validateForm()) {
      console.log('Form validation failed with errors:', errors);
      return;
    }

    // Clean up form data based on type
    let cleanedData = {};
    
    // Add common fields
    cleanedData.name = formData.name;
    
    // Add type-specific fields
    switch (type) {
      case 'investments':
        cleanedData.type = formData.type;
        if (formData.symbol) cleanedData.symbol = formData.symbol;
        if (formData.shares) cleanedData.shares = parseFloat(formData.shares);
        if (formData.price_per_share) cleanedData.price_per_share = parseFloat(formData.price_per_share);
        if (formData.total_value) cleanedData.total_value = parseFloat(formData.total_value);
        if (formData.purchase_date) cleanedData.purchase_date = formData.purchase_date;
        break;
        
      case 'cash':
        cleanedData.account_type = formData.account_type;
        if (formData.balance) cleanedData.balance = parseFloat(formData.balance);
        if (formData.interest_rate) cleanedData.interest_rate = parseFloat(formData.interest_rate);
        break;
        
      case 'physical':
        cleanedData.category = formData.category;
        if (formData.current_value) cleanedData.current_value = parseFloat(formData.current_value);
        if (formData.purchase_value) cleanedData.purchase_value = parseFloat(formData.purchase_value);
        if (formData.condition) cleanedData.condition = formData.condition;
        if (formData.purchase_date) cleanedData.purchase_date = formData.purchase_date;
        if (formData.notes) cleanedData.notes = formData.notes;
        break;
        
      case 'ownership':
        cleanedData.business_name = formData.business_name;
        if (formData.percentage) cleanedData.percentage = parseFloat(formData.percentage);
        if (formData.current_value) cleanedData.current_value = parseFloat(formData.current_value);
        if (formData.investment_date) cleanedData.investment_date = formData.investment_date;
        if (formData.notes) cleanedData.notes = formData.notes;
        break;
    }

    console.log('Cleaned data being submitted:', cleanedData);
    onSubmit(cleanedData);
  };

  const getTitle = () => {
    const typeNames = {
      investments: 'Investment',
      cash: 'Cash Account',
      physical: 'Physical Asset',
      ownership: 'Ownership Stake'
    };
    return `${asset ? 'Edit' : 'Add'} ${typeNames[type]}`;
  };

  const renderInvestmentFields = () => (
    <>
      <FormGroup>
        <Label htmlFor="type">Investment Type</Label>
        <Select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          error={!!errors.type}
        >
          <option value="">Select type</option>
          <option value="stock">Stock</option>
          <option value="bond">Bond</option>
          <option value="etf">ETF</option>
          <option value="mutual_fund">Mutual Fund</option>
        </Select>
        <ErrorMessage>{errors.type}</ErrorMessage>
      </FormGroup>

      <div className="grid grid-cols-2 gap-4">
        <FormGroup>
          <Label htmlFor="symbol">Symbol (Optional)</Label>
          <Input
            id="symbol"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            placeholder="AAPL"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="shares">Shares (Optional)</Label>
          <Input
            id="shares"
            name="shares"
            type="number"
            step="0.01"
            value={formData.shares}
            onChange={handleChange}
            placeholder="10"
          />
        </FormGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormGroup>
          <Label htmlFor="price_per_share">Price per Share (Optional)</Label>
          <Input
            id="price_per_share"
            name="price_per_share"
            type="number"
            step="0.01"
            value={formData.price_per_share}
            onChange={handleChange}
            placeholder="150.00"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="total_value">Total Value</Label>
          <Input
            id="total_value"
            name="total_value"
            type="number"
            step="0.01"
            value={formData.total_value}
            onChange={handleChange}
            error={!!errors.total_value}
            placeholder="1500.00"
          />
          <ErrorMessage>{errors.total_value}</ErrorMessage>
        </FormGroup>
      </div>

      <FormGroup>
        <Label htmlFor="purchase_date">Purchase Date (Optional)</Label>
        <Input
          id="purchase_date"
          name="purchase_date"
          type="date"
          value={formData.purchase_date}
          onChange={handleChange}
        />
      </FormGroup>
    </>
  );

  const renderCashFields = () => (
    <>
      <FormGroup>
        <Label htmlFor="account_type">Account Type</Label>
        <Select
          id="account_type"
          name="account_type"
          value={formData.account_type}
          onChange={handleChange}
          error={!!errors.account_type}
        >
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="money_market">Money Market</option>
        </Select>
        <ErrorMessage>{errors.account_type}</ErrorMessage>
      </FormGroup>

      <div className="grid grid-cols-2 gap-4">
        <FormGroup>
          <Label htmlFor="balance">Balance</Label>
          <Input
            id="balance"
            name="balance"
            type="number"
            step="0.01"
            value={formData.balance}
            onChange={handleChange}
            error={!!errors.balance}
            placeholder="5000.00"
          />
          <ErrorMessage>{errors.balance}</ErrorMessage>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="interest_rate">Interest Rate (%) (Optional)</Label>
          <Input
            id="interest_rate"
            name="interest_rate"
            type="number"
            step="0.01"
            value={formData.interest_rate}
            onChange={handleChange}
            placeholder="2.50"
          />
        </FormGroup>
      </div>
    </>
  );

  const renderPhysicalFields = () => (
    <>
      <FormGroup>
        <Label htmlFor="category">Category</Label>
        <Select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          error={!!errors.category}
        >
          <option value="vehicle">Vehicle</option>
          <option value="jewelry">Jewelry</option>
          <option value="collectibles">Collectibles</option>
          <option value="electronics">Electronics</option>
        </Select>
        <ErrorMessage>{errors.category}</ErrorMessage>
      </FormGroup>

      <div className="grid grid-cols-2 gap-4">
        <FormGroup>
          <Label htmlFor="current_value">Current Value</Label>
          <Input
            id="current_value"
            name="current_value"
            type="number"
            step="0.01"
            value={formData.current_value}
            onChange={handleChange}
            error={!!errors.current_value}
            placeholder="18000.00"
          />
          <ErrorMessage>{errors.current_value}</ErrorMessage>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="purchase_value">Purchase Value (Optional)</Label>
          <Input
            id="purchase_value"
            name="purchase_value"
            type="number"
            step="0.01"
            value={formData.purchase_value}
            onChange={handleChange}
            placeholder="22000.00"
          />
        </FormGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormGroup>
          <Label htmlFor="purchase_date">Purchase Date (Optional)</Label>
          <Input
            id="purchase_date"
            name="purchase_date"
            type="date"
            value={formData.purchase_date}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="condition">Condition (Optional)</Label>
          <Select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </Select>
        </FormGroup>
      </div>

      <FormGroup>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional details about the asset"
        />
      </FormGroup>
    </>
  );

  const renderOwnershipFields = () => (
    <>
      <FormGroup>
        <Label htmlFor="business_name">Business Name</Label>
        <Input
          id="business_name"
          name="business_name"
          value={formData.business_name}
          onChange={handleChange}
          error={!!errors.business_name}
          placeholder="InnovateTech LLC"
        />
        <ErrorMessage>{errors.business_name}</ErrorMessage>
      </FormGroup>

      <div className="grid grid-cols-2 gap-4">
        <FormGroup>
          <Label htmlFor="percentage">Ownership Percentage</Label>
          <Input
            id="percentage"
            name="percentage"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.percentage}
            onChange={handleChange}
            error={!!errors.percentage}
            placeholder="5.0"
          />
          <ErrorMessage>{errors.percentage}</ErrorMessage>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="current_value">Current Value</Label>
          <Input
            id="current_value"
            name="current_value"
            type="number"
            step="0.01"
            value={formData.current_value}
            onChange={handleChange}
            error={!!errors.current_value}
            placeholder="25000.00"
          />
          <ErrorMessage>{errors.current_value}</ErrorMessage>
        </FormGroup>
      </div>

      <FormGroup>
        <Label htmlFor="investment_date">Investment Date (Optional)</Label>
        <Input
          id="investment_date"
          name="investment_date"
          type="date"
          value={formData.investment_date}
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
          placeholder="Additional details about the investment"
        />
      </FormGroup>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} maxWidth="max-w-2xl">
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
              placeholder="Enter asset name"
            />
            <ErrorMessage>{errors.name}</ErrorMessage>
          </FormGroup>

          {type === 'investments' && renderInvestmentFields()}
          {type === 'cash' && renderCashFields()}
          {type === 'physical' && renderPhysicalFields()}
          {type === 'ownership' && renderOwnershipFields()}

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (asset ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default AssetForm;