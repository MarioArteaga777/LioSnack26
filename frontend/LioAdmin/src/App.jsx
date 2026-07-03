import { BrowserRouter as Router, Routes, Route } from 'react-router'
import { Toaster } from 'sonner'
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
import Users from './pages/Users.jsx'
import AccountsPayable from './pages/AccountsPayable.jsx'
import AccountsReceivable from './pages/AccountsReceivable.jsx'
import PrivateRoute from './hooks/PrivateRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        theme="dark"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "#1B022C",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />} >
            <Route element={<Layout />} >
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/codes" element={<Codes />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/users" element={<Users />} />
              <Route path="/sales/payable" element={<AccountsPayable />} />
              <Route path="/sales/receivable" element={<AccountsReceivable />} />
            </Route>
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-username" element={<ForgotUsername />} />
          <Route path="/verification-code" element={<VerificationCode />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
