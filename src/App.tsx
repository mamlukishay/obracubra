import { Routes, Route } from 'react-router-dom'
import TimerPage from './pages/TimerPage'
import { LoginForm } from './components/auth/LoginForm'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<TimerPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    </Routes>
  )
}

export default App
