const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(error);
    }
    next();
  };
};

// Asset validation schemas
const investmentSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid('stock', 'bond', 'etf', 'mutual_fund').required(),
  symbol: Joi.string().optional(),
  shares: Joi.number().positive().optional(),
  price_per_share: Joi.number().positive().optional(),
  total_value: Joi.number().required(),
  purchase_date: Joi.date().optional()
});

const cashAccountSchema = Joi.object({
  name: Joi.string().required(),
  account_type: Joi.string().valid('checking', 'savings', 'money_market').required(),
  balance: Joi.number().required(),
  interest_rate: Joi.number().min(0).optional()
});

const physicalAssetSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().valid('vehicle', 'jewelry', 'collectibles', 'electronics').required(),
  current_value: Joi.number().positive().required(),
  purchase_value: Joi.number().positive().optional(),
  purchase_date: Joi.date().optional(),
  condition: Joi.string().valid('excellent', 'good', 'fair', 'poor').optional(),
  notes: Joi.string().optional()
});

const ownershipStakeSchema = Joi.object({
  name: Joi.string().required(),
  business_name: Joi.string().required(),
  percentage: Joi.number().min(0).max(100).required(),
  current_value: Joi.number().positive().required(),
  investment_date: Joi.date().optional(),
  notes: Joi.string().optional()
});

// Liability validation schema
const liabilitySchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  principal_amount: Joi.number().positive().required(),
  current_balance: Joi.number().required(),
  interest_rate: Joi.number().min(0).optional(),
  monthly_payment: Joi.number().min(0).optional(),
  due_date: Joi.date().optional(),
  notes: Joi.string().optional()
});

// Cash flow validation schemas
const incomeSchema = Joi.object({
  source: Joi.string().required(),
  amount: Joi.number().positive().required(),
  date: Joi.date().required(),
  category: Joi.string().valid('salary', 'freelance', 'business', 'dividends', 'other').required(),
  is_recurring: Joi.boolean().optional(),
  frequency: Joi.string().valid('monthly', 'quarterly', 'annually').optional(),
  notes: Joi.string().optional()
});

const expenseSchema = Joi.object({
  description: Joi.string().required(),
  amount: Joi.number().positive().required(),
  date: Joi.date().required(),
  category: Joi.string().valid('housing', 'food', 'transport', 'entertainment', 'utilities', 'other').required(),
  is_recurring: Joi.boolean().optional(),
  frequency: Joi.string().valid('monthly', 'quarterly', 'annually').optional(),
  notes: Joi.string().optional()
});

module.exports = {
  validate,
  investmentSchema,
  cashAccountSchema,
  physicalAssetSchema,
  ownershipStakeSchema,
  liabilitySchema,
  incomeSchema,
  expenseSchema
};