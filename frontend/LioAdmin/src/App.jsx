import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ForgotUsername from './pages/ForgotUsername.jsx'
import VerificationCode from './pages/VerificationCode.jsx'
import Layout from './layout/NavLayout.jsx'
import Products from './pages/Products.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />} >
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-username" element={<ForgotUsername />} />
        <Route path="/verification-code" element={<VerificationCode />} />
      </Routes>
    </Router>
  )
}

export default App
