import { useState } from 'react';
import "../Components/Styles/Login.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function UserLogin() {

  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    student: { admissionNumber: '', },
    admin: { adminId: '', password: '' },
    faculty: { facultyId: '', password: '', rememberMe: false }
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

    // Student requires ONLY admissionNumber
    if (tab === "student") {
      if (!data.admissionNumber.trim()) {
        alert("Admission number is required");
        return; // stop login
      }
    }

    // Admin / Faculty require both ID + password

    if (tab === "admin") {
      if (!data.adminId.trim() || !data.password.trim()) {
        alert("Admin ID and password are required");
        return;
      }
    }

    if (tab === "faculty") {
      if (!data.facultyId.trim() || !data.password.trim()) {
        alert("Faculty ID and password are required");
        return;
      }
    }
    console.log(tab, "tab");

    console.log(formData, "formData");


    axios.post(`http://localhost:5000/api/${tab === "student" ? "auth/send-otp" : tab === "admin" ? "admin/auth/login" : "teacher/auth/login"}`, data)
        .then((response) => {
    console.log("LOGIN RESPONSE:", response.data);

    // 🔐 HARD GUARD — NOTHING below runs unless success === true
    if (!response.data || response.data.success !== true) {
      alert(response.data?.message || "Login failed");
      return;
    }

    if (tab === "student") {
      Navigate("/OtpLogin", {
        state: { admissionNumber: data.admissionNumber },
      });
      return;
    }

    if (tab === "admin") {
      // ✅ SAFE ACCESS
      const email = response.data.admin?.email;

      if (!email) {
        alert("Admin email missing in response");
        return;
      }

      Navigate("/OtpLogin", {
        state: { email },
      });
      return;
    }

    if (tab === "faculty") {
      Navigate("/OtpLogin", {
        state: { facultyId: response.data.teacher?.facultyId },
      });
      return;   
    }
  })
  .catch((error) => {
    console.error("Axios error:", error);

    alert(
      error.response?.data?.message ||
        error.message ||
        "Something went wrong"
    );
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
      student: { admissionNumber: 'Enter your admission no', },
      admin: { adminId: 'Enter admin ID', password: 'Enter admin password' },
      faculty: { facultyId: 'Enter faculty ID', password: 'Enter faculty password' }
    };
    const idField =
      tabType === "student" ? "admissionNumber"
        : tabType === "admin" ? "adminId"
          : "facultyId";

    return (
      <div className="tab-content">
        <div className="form-header">
          <h2 className="form-title">{tabTitles[tabType]}</h2>
          <input type='text'
            id={`${tabType}-id`}
            value={currentData[idField]}
            onChange={(e) => handleInputChange(tabType, idField, e.target.value)}
            className="form-input"
            placeholder={placeholders[tabType][idField]}
          />
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