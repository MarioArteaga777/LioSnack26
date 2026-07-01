import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ForgotUsername from './pages/ForgotUsername.jsx'
import VerificationCode from './pages/VerificationCode.jsx'
import Layout from './layout/NavLayout.jsx'
import Products from './pages/Products.jsx'
import Orders from './pages/Orders.jsx'
import Codes from './pages/Codes.jsx'
import Customers from './pages/Customers.jsx'
import AccountsPayable from './pages/AccountsPayable.jsx'
import AccountsReceivable from './pages/AccountsReceivable.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />} >
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/codes" element={<Codes />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/sales/payable" element={<AccountsPayable />} />
          <Route path="/sales/receivable" element={<AccountsReceivable />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-username" element={<ForgotUsername />} />
        <Route path="/verification-code" element={<VerificationCode />} />
      </Routes>
    </Router>
  )
}

export default App
