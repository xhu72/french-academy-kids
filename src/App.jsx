import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import LoginPage  from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

// Placeholder 
function HomePage() {
  return <div className="p-8 text-2xl">🏠 Home</div>
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}