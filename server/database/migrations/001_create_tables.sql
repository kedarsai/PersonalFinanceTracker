-- Personal Finance Tracker Database Schema

-- Assets Tables
CREATE TABLE investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('stock', 'bond', 'etf', 'mutual_fund')),
    symbol TEXT,
    shares REAL,
    price_per_share REAL,
    total_value REAL NOT NULL,
    purchase_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cash_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings', 'money_market')),
    balance REAL NOT NULL,
    interest_rate REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE physical_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('vehicle', 'jewelry', 'collectibles', 'electronics')),
    current_value REAL NOT NULL,
    purchase_value REAL,
    purchase_date DATE,
    condition TEXT CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ownership_stakes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    percentage REAL NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    current_value REAL NOT NULL,
    investment_date DATE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Liabilities Table
CREATE TABLE liabilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    principal_amount REAL NOT NULL,
    current_balance REAL NOT NULL,
    interest_rate REAL DEFAULT 0,
    monthly_payment REAL DEFAULT 0,
    due_date DATE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cash Flow Tables
CREATE TABLE income (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL,
    amount REAL NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('salary', 'freelance', 'business', 'dividends', 'other')),
    is_recurring BOOLEAN DEFAULT FALSE,
    frequency TEXT CHECK (frequency IN ('monthly', 'quarterly', 'annually')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('housing', 'food', 'transport', 'entertainment', 'utilities', 'other')),
    is_recurring BOOLEAN DEFAULT FALSE,
    frequency TEXT CHECK (frequency IN ('monthly', 'quarterly', 'annually')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Net Worth History (for tracking over time)
CREATE TABLE net_worth_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    total_assets REAL NOT NULL,
    total_liabilities REAL NOT NULL,
    net_worth REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_investments_type ON investments(type);
CREATE INDEX idx_cash_accounts_type ON cash_accounts(account_type);
CREATE INDEX idx_physical_assets_category ON physical_assets(category);
CREATE INDEX idx_income_date ON income(date);
CREATE INDEX idx_income_category ON income(category);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_net_worth_history_date ON net_worth_history(date);