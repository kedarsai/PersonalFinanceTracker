import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Assets from './pages/Assets'
import Liabilities from './pages/Liabilities'
import CashFlow from './pages/CashFlow'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="liabilities" element={<Liabilities />} />
          <Route path="cash-flow" element={<CashFlow />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
