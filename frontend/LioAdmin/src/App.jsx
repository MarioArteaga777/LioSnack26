import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext.jsx";

import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ForgotUsername from "./pages/ForgotUsername.jsx";
import VerificationCode from "./pages/VerificationCode.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import Layout from "./layout/NavLayout.jsx";

import Products from "./pages/Products.jsx";
import Orders from "./pages/Orders.jsx";
import Codes from "./pages/Codes.jsx";
import Customers from "./pages/Customers.jsx";
import Users from "./pages/Users.jsx";
import Production from "./pages/production.jsx";

import AccountsPayable from "./pages/AccountsPayable.jsx";
import AccountsReceivable from "./pages/AccountsReceivable.jsx";
import Profile from "./pages/Profile.jsx";

import PrivateRoute from "./hooks/PrivateRoute.jsx";

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
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-username" element={<ForgotUsername />} />
          <Route path="/verification-code" element={<VerificationCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Products />} />

              <Route path="/orders" element={<Orders />} />
              <Route path="/codes" element={<Codes />} />
              <Route path="/production" element={<Production />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/users" element={<Users />} />

              <Route path="/sales/payable" element={<AccountsPayable />} />
              <Route path="/sales/receivable" element={<AccountsReceivable />} />

              <Route path="/perfil" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;