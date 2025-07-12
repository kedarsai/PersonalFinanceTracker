-- Sample data for Personal Finance Tracker

-- Sample Investments
INSERT INTO investments (name, type, symbol, shares, price_per_share, total_value, purchase_date) VALUES
('Apple Inc.', 'stock', 'AAPL', 10, 150.00, 1500.00, '2024-01-15'),
('Vanguard S&P 500 ETF', 'etf', 'VOO', 5, 400.00, 2000.00, '2024-02-01'),
('US Treasury Bond', 'bond', 'TBond', 1, 1000.00, 1000.00, '2024-01-01');

-- Sample Cash Accounts
INSERT INTO cash_accounts (name, account_type, balance, interest_rate) VALUES
('Main Checking', 'checking', 5000.00, 0.01),
('High Yield Savings', 'savings', 15000.00, 4.5),
('Emergency Fund', 'money_market', 10000.00, 3.8);

-- Sample Physical Assets
INSERT INTO physical_assets (name, category, current_value, purchase_value, purchase_date, condition, notes) VALUES
('2020 Honda Civic', 'vehicle', 18000.00, 22000.00, '2020-03-15', 'good', 'Regular maintenance up to date'),
('Gold Wedding Ring', 'jewelry', 2500.00, 2000.00, '2019-06-10', 'excellent', 'Appraised in 2024'),
('MacBook Pro', 'electronics', 1200.00, 2500.00, '2021-09-01', 'good', 'Still under warranty');

-- Sample Ownership Stakes
INSERT INTO ownership_stakes (name, business_name, percentage, current_value, investment_date, notes) VALUES
('Tech Startup Equity', 'InnovateTech LLC', 5.0, 25000.00, '2023-01-01', 'Series A investment'),
('Local Coffee Shop', 'Bean There Cafe', 15.0, 8000.00, '2022-06-15', 'Silent partner investment');

-- Sample Liabilities
INSERT INTO liabilities (name, category, principal_amount, current_balance, interest_rate, monthly_payment, due_date, notes) VALUES
('Home Mortgage', 'mortgage', 300000.00, 275000.00, 3.25, 1800.00, '2054-04-01', '30-year fixed rate'),
('Car Loan', 'auto', 25000.00, 18000.00, 4.2, 450.00, '2027-03-15', '60-month term'),
('Credit Card', 'credit', 0.00, 2500.00, 18.9, 150.00, '2025-01-15', 'Chase Sapphire');

-- Sample Income
INSERT INTO income (source, amount, date, category, is_recurring, frequency, notes) VALUES
('Software Engineer Salary', 8000.00, '2024-07-01', 'salary', TRUE, 'monthly', 'Base salary'),
('Freelance Project', 2500.00, '2024-06-15', 'freelance', FALSE, NULL, 'Web development project'),
('Dividend Payment', 75.00, '2024-06-30', 'dividends', TRUE, 'quarterly', 'VOO dividend'),
('Side Business', 1200.00, '2024-06-01', 'business', TRUE, 'monthly', 'Consulting work');

-- Sample Expenses
INSERT INTO expenses (description, amount, date, category, is_recurring, frequency, notes) VALUES
('Rent Payment', 2200.00, '2024-07-01', 'housing', TRUE, 'monthly', 'Downtown apartment'),
('Groceries', 400.00, '2024-07-05', 'food', TRUE, 'monthly', 'Weekly grocery shopping'),
('Gas and Electric', 150.00, '2024-07-01', 'utilities', TRUE, 'monthly', 'Average monthly bill'),
('Car Insurance', 120.00, '2024-07-01', 'transport', TRUE, 'monthly', 'Full coverage'),
('Netflix Subscription', 15.99, '2024-07-01', 'entertainment', TRUE, 'monthly', 'Streaming service'),
('Dinner Out', 85.00, '2024-07-06', 'food', FALSE, NULL, 'Date night');

-- Sample Net Worth History
INSERT INTO net_worth_history (date, total_assets, total_liabilities, net_worth) VALUES
('2024-01-01', 50000.00, 300000.00, -250000.00),
('2024-02-01', 52000.00, 298000.00, -246000.00),
('2024-03-01', 54500.00, 296000.00, -241500.00),
('2024-04-01', 56000.00, 294000.00, -238000.00),
('2024-05-01', 58200.00, 292000.00, -233800.00),
('2024-06-01', 61000.00, 290000.00, -229000.00),
('2024-07-01', 63500.00, 288000.00, -224500.00);