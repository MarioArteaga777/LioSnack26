import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ForgotUsername from './pages/ForgotUsername.jsx'
import VerificationCode from './pages/VerificationCode.jsx'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/forgot-username" element={<ForgotUsername/>} />
        <Route path="/verification-code" element={<VerificationCode/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
