import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import UserLogin from './Components/User/Pages/UserLogin'
import Otp from './Components/User/Pages/Otp'
import ReturningOfficerDashboard from './Components/Teacher/Pages/ReturningOfficerDashboard'
import TeacherDashboard from './Components/Teacher/Pages/TeacherDashboard'
import StudentDashboard from './Components/Student/StudentDashboard'
import VotePage from './Components/Student/Pages/VotePage' 
import AdminDashboard from './Components/Admin/Pages/AdminDashboard'
import LandingPage from './Components/LandingPage/Pages/LandingPage'
import CandidateDetails from './Components/Teacher/Components/CandidateDetails'
import ProtectedRoute from './Components/Common/ProtectedRoute'

import { getRoleFromToken } from './utils/auth'

const LoginRedirect = ({ defaultTab = 'student', allowAccess = false }) => {
  const storedRole = localStorage.getItem('role');
  
  // Resolve token based on stored role or fallback
  const token = (storedRole === 'student' ? localStorage.getItem('usertoken') : null) || 
                (storedRole === 'admin'   ? localStorage.getItem('admintoken') : null) || 
                (storedRole === 'teacher' || storedRole === 'returning_officer' ? localStorage.getItem('teachertoken') : null) ||
                localStorage.getItem('usertoken') || 
                localStorage.getItem('admintoken') || 
                localStorage.getItem('teachertoken') ||
                localStorage.getItem('token');
  
  // Extract actual role from token payload
  const tokenRole = getRoleFromToken(token);
  const effectiveRole = tokenRole || storedRole;

  // Sync role if mismatch detected
  if (tokenRole && storedRole !== tokenRole) {
    localStorage.setItem('role', tokenRole);
  }
  
  // If allowAccess is true (role-specific routes), show login form even if authenticated
  if (!allowAccess && token && effectiveRole) {
    if (effectiveRole === 'student') return <Navigate to="/studentDashboard" replace />;
    if (effectiveRole === 'admin') return <Navigate to="/adminDashboard" replace />;
    if (effectiveRole === 'returning_officer') return <Navigate to="/returningDashboard" replace />;
    if (effectiveRole === 'teacher') return <Navigate to="/teacherDashboard" replace />;
  }
  return <UserLogin initialTab={defaultTab} />;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginRedirect />} />
        <Route path="/UserLogin" element={<LoginRedirect />} />
        <Route path="/student/login" element={<LoginRedirect defaultTab="student" allowAccess={true} />} />
        <Route path="/admin/login" element={<LoginRedirect defaultTab="admin" allowAccess={true} />} />
        <Route path="/returning/login" element={<LoginRedirect defaultTab="returning" allowAccess={true} />} />
        <Route path="/teacher/login" element={<LoginRedirect defaultTab="teacher" allowAccess={true} />} />
        <Route path="/OtpLogin" element={<Otp />} />
        
        {/* Protected Routes */}
        <Route path="/returningDashboard" element={
          <ProtectedRoute allowedRoles={['returning_officer']}>
            <ReturningOfficerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/teacherDashboard" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/studentDashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/VotePage" element={
          <ProtectedRoute allowedRoles={['student']}>
            <VotePage />
          </ProtectedRoute>
        } /> 
        
        <Route path="/adminDashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'teacher']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/candidates/:studentId" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <CandidateDetails />
          </ProtectedRoute>
        } />

        <Route path='/LandingPage' element={<LandingPage />} />
      </Routes>
    </>
  )
}

export default App
