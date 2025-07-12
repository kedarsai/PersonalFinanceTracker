import { DollarSign, TrendingUp, Wallet, CreditCard } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">
                Personal Finance Tracker
              </h1>
            </div>
            <nav className="flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Assets
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Liabilities
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Cash Flow
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Financial Dashboard</h2>
          <p className="text-gray-600">Track your net worth, manage assets and liabilities, and monitor cash flow.</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Net Worth</dt>
                    <dd className="text-lg font-medium text-gray-900">$-224,500</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Wallet className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Assets</dt>
                    <dd className="text-lg font-medium text-gray-900">$63,500</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Liabilities</dt>
                    <dd className="text-lg font-medium text-gray-900">$288,000</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Monthly Cash Flow</dt>
                    <dd className="text-lg font-medium text-gray-900">+$8,734</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Getting Started
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Wallet className="h-6 w-6 text-primary-600" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Add Assets</h4>
                    <p className="text-sm text-gray-500">Track investments, cash, and physical assets</p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-primary-600" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Add Liabilities</h4>
                    <p className="text-sm text-gray-500">Record debts and payment schedules</p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Track Cash Flow</h4>
                    <p className="text-sm text-gray-500">Monitor income and expenses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Development Status */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Development Mode</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>This application is currently under development. Sample data is being displayed. Full functionality will be available soon!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
