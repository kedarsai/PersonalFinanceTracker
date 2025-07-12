# Personal Finance Net Worth Tracker - Complete App Vision & Architecture

## 1. App Overview
A modern desktop web application (Node.js + React + Tailwind) that tracks personal financial net worth through manual data entry. Users can manage assets, liabilities, and cash flow with beautiful dashboards and insights.

## 2. Technology Stack
- **Frontend**: React 18 + Tailwind CSS + Headless UI + Lucide React
- **Backend**: Node.js + Express + SQLite
- **Charts**: Recharts
- **Dev Tools**: Vite (for fast development), ESLint, Prettier
- **Database**: SQLite with better-sqlite3 driver

## 3. Project Structure
```
personal-finance-app/
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Reusable UI components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── charts/              # Chart components
│   │   │   │   ├── NetWorthChart.jsx
│   │   │   │   ├── AssetPieChart.jsx
│   │   │   │   └── CashFlowChart.jsx
│   │   │   ├── dashboard/           # Dashboard specific
│   │   │   │   ├── StatsCard.jsx
│   │   │   │   ├── QuickActions.jsx
│   │   │   │   └── RecentActivity.jsx
│   │   │   ├── forms/               # Form components
│   │   │   │   ├── AssetForm.jsx
│   │   │   │   ├── LiabilityForm.jsx
│   │   │   │   └── TransactionForm.jsx
│   │   │   └── layout/              # Layout components
│   │   │       ├── Header.jsx
│   │   │       ├── Navigation.jsx
│   │   │       └── Layout.jsx
│   │   ├── pages/                   # Main pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Assets.jsx
│   │   │   ├── Liabilities.jsx
│   │   │   ├── CashFlow.jsx
│   │   │   └── Reports.jsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useApi.js
│   │   │   ├── useLocalStorage.js
│   │   │   └── useFinancialData.js
│   │   ├── services/                # API services
│   │   │   └── api.js
│   │   ├── utils/                   # Utility functions
│   │   │   ├── formatting.js
│   │   │   ├── calculations.js
│   │   │   └── validation.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                          # Node.js backend
│   ├── src/
│   │   ├── controllers/             # Route handlers
│   │   │   ├── assetController.js
│   │   │   ├── liabilityController.js
│   │   │   ├── cashFlowController.js
│   │   │   └── dashboardController.js
│   │   ├── models/                  # Database models
│   │   │   ├── Asset.js
│   │   │   ├── Liability.js
│   │   │   ├── Transaction.js
│   │   │   └── database.js
│   │   ├── routes/                  # Express routes
│   │   │   ├── assets.js
│   │   │   ├── liabilities.js
│   │   │   ├── cashFlow.js
│   │   │   └── dashboard.js
│   │   ├── middleware/              # Express middleware
│   │   │   ├── validation.js
│   │   │   └── errorHandler.js
│   │   ├── utils/                   # Server utilities
│   │   │   └── calculations.js
│   │   └── app.js
│   ├── database/
│   │   ├── migrations/
│   │   └── seeds/
│   └── package.json
├── package.json                     # Root package.json
└── README.md
```

## 4. Database Schema (SQLite)
```sql
-- Assets Tables
CREATE TABLE investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'stock', 'bond', 'etf', 'mutual_fund'
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
    account_type TEXT NOT NULL, -- 'checking', 'savings', 'money_market'
    balance REAL NOT NULL,
    interest_rate REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE physical_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'vehicle', 'jewelry', 'collectibles', 'electronics'
    current_value REAL NOT NULL,
    purchase_value REAL,
    purchase_date DATE,
    condition TEXT, -- 'excellent', 'good', 'fair', 'poor'
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ownership_stakes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    percentage REAL NOT NULL,
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
    category TEXT NOT NULL, -- user-defined categories
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
    category TEXT NOT NULL, -- 'salary', 'freelance', 'business', 'dividends', 'other'
    is_recurring BOOLEAN DEFAULT FALSE,
    frequency TEXT, -- 'monthly', 'quarterly', 'annually'
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL, -- 'housing', 'food', 'transport', 'entertainment', 'utilities', 'other'
    is_recurring BOOLEAN DEFAULT FALSE,
    frequency TEXT, -- 'monthly', 'quarterly', 'annually'
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
```

## 5. API Endpoints
```javascript
// Assets
GET    /api/assets/investments     // Get all investments
POST   /api/assets/investments     // Create investment
PUT    /api/assets/investments/:id // Update investment
DELETE /api/assets/investments/:id // Delete investment

GET    /api/assets/cash            // Get all cash accounts
POST   /api/assets/cash            // Create cash account
PUT    /api/assets/cash/:id        // Update cash account
DELETE /api/assets/cash/:id        // Delete cash account

GET    /api/assets/physical        // Get all physical assets
POST   /api/assets/physical        // Create physical asset
PUT    /api/assets/physical/:id    // Update physical asset
DELETE /api/assets/physical/:id    // Delete physical asset

GET    /api/assets/ownership       // Get all ownership stakes
POST   /api/assets/ownership       // Create ownership stake
PUT    /api/assets/ownership/:id   // Update ownership stake
DELETE /api/assets/ownership/:id   // Delete ownership stake

// Liabilities
GET    /api/liabilities            // Get all liabilities
POST   /api/liabilities            // Create liability
PUT    /api/liabilities/:id        // Update liability
DELETE /api/liabilities/:id        // Delete liability

// Cash Flow
GET    /api/cashflow/income        // Get income records
POST   /api/cashflow/income        // Create income record
PUT    /api/cashflow/income/:id    // Update income record
DELETE /api/cashflow/income/:id    // Delete income record

GET    /api/cashflow/expenses      // Get expense records
POST   /api/cashflow/expenses      // Create expense record
PUT    /api/cashflow/expenses/:id  // Update expense record
DELETE /api/cashflow/expenses/:id  // Delete expense record

// Dashboard & Reports
GET    /api/dashboard/summary      // Get dashboard summary data
GET    /api/dashboard/networth     // Get net worth history
GET    /api/dashboard/cashflow     // Get cash flow summary
GET    /api/reports/assets         // Get detailed asset report
GET    /api/reports/liabilities    // Get detailed liability report
```

## 6. UI/UX Design System
```javascript
// Tailwind Config Extensions
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

## 7. Key Features & Components

### Dashboard Features
- **Net Worth Summary Card**: Current total with trend indicator
- **Asset Allocation Chart**: Pie chart showing investment vs cash vs physical assets
- **Monthly Cash Flow Chart**: Bar chart showing income vs expenses
- **Recent Activity List**: Latest transactions and changes
- **Quick Action Buttons**: Add income, expense, or asset quickly

### Asset Management
- **Investment Portfolio**: Track stocks, bonds, ETFs with current values
- **Cash Accounts**: Savings, checking accounts with balances
- **Physical Assets**: Vehicles, jewelry, collectibles with depreciation
- **Ownership Stakes**: Business partnerships and equity positions

### Liability Management
- **Custom Categories**: User-defined debt categories
- **Payment Tracking**: Monthly payments and due dates
- **Interest Calculation**: Track interest accrual over time
- **Payoff Projections**: Estimated payoff dates

### Cash Flow Management
- **Income Tracking**: Multiple income sources with categorization
- **Expense Tracking**: Detailed expense categorization
- **Recurring Transactions**: Automatic entry for regular income/expenses
- **Monthly Summaries**: Income vs expense analysis

## 8. Development Steps (Sequential)

### Phase 1: Project Setup
1. **Initialize Project Structure**
   - Create root package.json with workspaces
   - Set up client/ and server/ directories
   - Install dependencies for both frontend and backend

2. **Backend Foundation**
   - Set up Express server with basic routing
   - Configure SQLite database connection
   - Create database migration scripts
   - Set up basic error handling middleware

3. **Frontend Foundation**
   - Set up React + Vite project
   - Configure Tailwind CSS
   - Create basic routing with React Router
   - Set up basic layout components

### Phase 2: Database & API Layer
4. **Database Implementation**
   - Create all database tables with migrations
   - Set up database models and query functions
   - Create seed data for testing

5. **API Development**
   - Implement all CRUD endpoints for assets
   - Implement all CRUD endpoints for liabilities
   - Implement all CRUD endpoints for cash flow
   - Create dashboard summary endpoints

6. **API Testing**
   - Set up API testing (Jest/Supertest)
   - Test all endpoints with sample data
   - Implement proper error handling

### Phase 3: Core UI Components
7. **UI Component Library**
   - Create reusable UI components (Button, Card, Input, Modal)
   - Implement consistent styling and theming
   - Add proper accessibility features

8. **Chart Components**
   - Create NetWorthChart component with Recharts
   - Create AssetPieChart component
   - Create CashFlowChart component
   - Add responsive design and interactions

9. **Form Components**
   - Create AssetForm with validation
   - Create LiabilityForm with validation
   - Create TransactionForm with validation
   - Add proper error handling and feedback

### Phase 4: Main Application Features
10. **Dashboard Page**
    - Build main dashboard layout
    - Implement StatsCard components
    - Add QuickActions component
    - Create RecentActivity component
    - Connect all components to API

11. **Asset Management Pages**
    - Create Assets page with tabs for different asset types
    - Implement add/edit/delete functionality
    - Add asset value tracking and history
    - Create asset detail views

12. **Liability Management Page**
    - Create Liabilities page with custom categories
    - Implement add/edit/delete functionality
    - Add payment tracking and calculations
    - Create liability detail views

13. **Cash Flow Management Page**
    - Create CashFlow page with income/expense sections
    - Implement transaction add/edit/delete
    - Add categorization and filtering
    - Create monthly/yearly summaries

### Phase 5: Advanced Features
14. **Reports & Analytics**
    - Create Reports page with detailed breakdowns
    - Add net worth history tracking
    - Implement trend analysis
    - Create exportable reports

15. **Data Management**
    - Add data export functionality (CSV, JSON)
    - Add data import functionality
    - Implement data backup/restore
    - Add data validation and cleanup

16. **UI/UX Enhancements**
    - Add dark/light mode toggle
    - Implement loading states and skeletons
    - Add smooth animations and transitions
    - Optimize for different screen sizes

### Phase 6: Testing & Deployment
17. **Testing**
    - Add comprehensive unit tests
    - Add integration tests for API
    - Add end-to-end tests for critical flows
    - Performance testing and optimization

18. **Production Readiness**
    - Add environment configuration
    - Implement logging and monitoring
    - Add error tracking and reporting
    - Create user documentation

19. **Deployment Setup**
    - Create build scripts for production
    - Set up database initialization
    - Create installation instructions
    - Add application packaging

### Phase 7: Future Enhancements (Post-MVP)
20. **Goal Management System**
    - Add financial goal creation and tracking
    - Implement progress visualization
    - Add goal-based recommendations
    - Create achievement system

21. **Advanced Analytics**
    - Add predictive modeling
    - Implement investment performance analysis
    - Add risk assessment tools
    - Create personalized insights

22. **Data Integration**
    - Research and implement bank API connections
    - Add investment platform integrations
    - Implement automatic data sync
    - Add real-time market data

## 9. File Templates & Code Structure

### Package.json (Root)
```json
{
  "name": "personal-finance-tracker",
  "private": true,
  "workspaces": ["client", "server"],
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "npm run dev --workspace=server",
    "dev:client": "npm run dev --workspace=client",
    "build": "npm run build --workspace=client",
    "start": "npm run start --workspace=server"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

### Server Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "better-sqlite3": "^8.7.0",
    "joi": "^17.9.2",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2",
    "supertest": "^6.3.3"
  }
}
```

### Client Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.2",
    "recharts": "^2.7.2",
    "lucide-react": "^0.263.1",
    "@headlessui/react": "^1.7.15",
    "axios": "^1.4.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0"
  }
}
```

This comprehensive architecture provides a solid foundation for building a modern, scalable personal finance application. Each phase builds upon the previous one, ensuring steady progress and maintainable code structure.