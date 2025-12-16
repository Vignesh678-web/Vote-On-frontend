import { Route, Routes } from 'react-router-dom'
import './App.css'
import UserLogin from './Components/User/Pages/UserLogin'
import Otp from './Components/User/Pages/Otp'
import TeacherDashboard from './Components/Teacher/Pages/TeacherDashboard'
import StudentDashboard from './Components/Student/StudentDashboard'
import VotePage from './Components/Student/Pages/VotePage' 
import AdminDashboard from './Components/Admin/Pages/AdminDashboard'
import LandingPage from './Components/LandingPage/Pages/LandingPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/UserLogin" element={<UserLogin />} />
        <Route path="/OtpLogin" element={<Otp />} />
        <Route path="/teacherDashboard" element={<TeacherDashboard />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/VotePage" element={<VotePage />} /> 
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path='/LandingPage' element={<LandingPage />} />
        
        
      </Routes>
    </>
  )
}

export default App
