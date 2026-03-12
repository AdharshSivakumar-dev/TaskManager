import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppTheme from './theme/AppTheme'
import Login from './pages/Login'
import Register from './pages/Register'
import ProjectDashboard from './pages/ProjectDashboard'
import TaskBoard from './pages/TaskBoard'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import Dashboard from './pages/Dashboard'
import MyTasks from './pages/MyTasks'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/projects" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
      <AppTheme>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><ProjectDashboard /></ProtectedRoute>} />
            <Route path="/projects/:projectId/tasks" element={<ProtectedRoute><TaskBoard /></ProtectedRoute>} />
            <Route path="/my-tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AppTheme>
    </AuthProvider>
  )
}

export default App
