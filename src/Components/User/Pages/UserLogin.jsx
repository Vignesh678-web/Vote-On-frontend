import { useState } from 'react';
import "../Components/Styles/Login.css"
import { useNavigate  } from 'react-router-dom';
import axios from 'axios';


export default function UserLogin() {

  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    student: { admission_no: '', },
    admin: { email: '', password: '', username: '' },
    faculty: { faculty_id: '', password: '', rememberMe: false }
  });

  const handleInputChange = (tab, field, value) => {
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value
      }
    }));
  };
  const Navigate = useNavigate();
 const handleSubmit = (tab) => {
  const data = formData[tab];

  // Student requires ONLY admission_no
  if (tab === "student") {
    if (!data.admission_no.trim()) {
      alert("Admission number is required");
      return; // stop login
    }
  }

  // Admin / Faculty require both ID + password

  if (tab === "admin") {
    if (!data.email.trim() || !data.password.trim()) {
      alert("Admin ID, password and email are required");
      return;
    }
  }

  if (tab === "faculty") {
    if (!data.faculty_id.trim() || !data.password.trim()) {
      alert("Faculty ID and password are required");
      return;
    }
  }
console.log(tab,"tab");

  console.log(formData,"formData");
  

  axios.post(`http://localhost:5000/api/${tab === "student" ? "auth/student-login" : tab === "admin" ? "admin/auth/create" : "teacher/auth/teacher-login"}`, data)
    .then(response => {
      console.log("Login successful:", response.data.admin.email);
      // Navigate to respective dashboard
      // if (tab === "student") {
      //   Navigate("/student-dashboard");
      // } else if (tab === "admin") {
      //   Navigate("/Admindashboard");
      // }
      // else if (tab === "faculty") {
      //   Navigate("/Teacherdashboard");
      // }
      Navigate("/OtpLogin" , { state: {email :response.data.admin.email  } } );
    })
    .catch(error => {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    });
    // For demo, just navigate to OTP pa
  // For demo, just navigate to OTP page
};


  const renderLoginForm = (tabType) => {
    const currentData = formData[tabType];
    const tabTitles = {
      student: 'Student Login',
      admin: 'Admin Login',
      faculty: 'Faculty  Login'
    };
    const buttonLabels = {
      student: "Send OTP",
      admin: "Admin Login",
      faculty: "Faculty Login"
    };

    const placeholders = {
      student: { admission_no: 'Enter your admission no', password: 'Enter your password' },
      admin: { email: 'Enter EMAIL ID', password: 'Enter admin password', username: 'Enter Admin ID' },
      faculty: { faculty_id: 'Enter faculty  ID', password: 'Enter faculty  password' }
    };
    const idField =
      tabType === "student" ? "admission_no"
      : tabType === "admin" ? "username"
      : "faculty_id";

    return (
      <div className="tab-content">
        <div className="form-header">
          <h2 className="form-title">{tabTitles[tabType]}</h2>

        </div>

        <div className="form-content">
       


          {/* Password Field */}
       {tabType !== "student" && (
            <div className="form-field">
              <input
                type="password"
                id={`${tabType}-password`}
                value={currentData.password}
                onChange={(e) => handleInputChange(tabType, 'password', e.target.value)}
                className="form-input"
                placeholder={placeholders[tabType].password}
              />
            </div>
          )}
          {/* Email Field for Admin */} 
          {tabType === "admin" && (
            <div className="form-field">
              <input
                type="email"
                id={`${tabType}-email`}   
                value={currentData.email} 
                onChange={(e) => handleInputChange(tabType, 'email', e.target.value)}
                className="form-input"
                placeholder={placeholders[tabType].email}
              />
            </div>
          )}
       
           

          {/* Remember Me Checkbox */}
          <div className="checkbox-container">
            <input
              type="checkbox"
              id={`${tabType}-remember`}
              checked={currentData.rememberMe}
              onChange={(e) => handleInputChange(tabType, 'rememberMe', e.target.checked)}
              className="checkbox-input"
            />
            <label htmlFor={`${tabType}-remember`} className="checkbox-label">
              Remember me
              
            </label>
          </div>

          {/* Login Button */}
          <button
            onClick={() => handleSubmit(tabType)}
            className="login-button"
          >
            {buttonLabels[tabType]}

          </button>

          {/* Footer Links */}
         <div className="form-footer">
      
  <button type="button" className="forgot-password">
    Forgot your password?
  </button>
</div>
        </div>
      </div>
    );
  };

  return (
    <div className="login-container">
      {/* Left Section - Welcome */}

      {/* Right Section - Login Form */}
      <div className="form-section">
        <div className="form-container">
          <div className="logo-container">
            <div className="logo"></div>
          </div>
          {/* Tabs */}
          <div className="tabs-container">
            <button
              className={`tab-button ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => setActiveTab('student')}
            >
              Student
            </button>
            <button
              className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin
            </button>
            <button
              className={`tab-button ${activeTab === 'faculty' ? 'active' : ''}`}
              onClick={() => setActiveTab('faculty')}
            >
              Faculty
            </button>
          </div>

          {/* Render the active tab's form */}
          {renderLoginForm(activeTab)}
        </div>
      </div>
    </div>
  );
}