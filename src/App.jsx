import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import LoginPage          from './pages/LoginPage'
import SignUpPage         from './pages/SignUpPage'
import HomePage           from './pages/HomePage'
import TopicSelectPage    from './pages/TopicSelectPage'
import LessonPage         from './pages/LessonPage'
import LessonCompletePage from './pages/LessonCompletePage'
import PhrasesPage            from './pages/PhrasesPage'
import SentenceBuilderPage    from './pages/SentenceBuilderPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Public routes */}
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Private routes */}
        <Route path="/home" element={
          <PrivateRoute><HomePage /></PrivateRoute>
        } />

        <Route path="/level/:levelId" element={
          <PrivateRoute><TopicSelectPage /></PrivateRoute>
        } />

        <Route path="/lesson/:levelId/:topic" element={
          <PrivateRoute><LessonPage /></PrivateRoute>
        } />

        <Route path="/lesson/:levelId/:topic/complete" element={
          <PrivateRoute><LessonCompletePage /></PrivateRoute>
        } />

        <Route path="/phrases/:levelId" element={
          <PrivateRoute><PhrasesPage /></PrivateRoute>
        } />
        <Route path="/sentence-builder/:levelId" element={
          <PrivateRoute><SentenceBuilderPage /></PrivateRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </AuthProvider>
  )
}