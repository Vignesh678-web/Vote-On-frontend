import { useState } from 'react';
import "../Components/Styles/Login.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserLogin() {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState({
    student: { admissionNumber: '', password: '' },
    admin: { adminId: '', password: '' },
    faculty: { facultyId: '', password: '', rememberMe: false }
  });

  const [registrationData, setRegistrationData] = useState({
    name: '',
    admissionNumber: '',
    email: '',
    password: ''
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

  const handleRegistrationChange = (field, value) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegistrationSubmit = () => {
    // Validate all fields
    if (!registrationData.name.trim()) {
      alert("Name is required");
      return;
    }
    if (!registrationData.admissionNumber.trim()) {
      alert("Admission number is required");
      return;
    }
    if (!registrationData.email.trim()) {
      alert("Email is required");
      return;
    }
    // if (!registrationData.attendancePercentage.trim()) {
    //   alert("Attendance percentage is required");
    //   return;
    // }

    // Validate attendance percentage
    // const attendance = parseFloat(registrationData.attendancePercentage);
    // if (isNaN(attendance) || attendance < 0 || attendance > 100) {
    //   alert("Attendance percentage must be between 0 and 100");
    //   return;
    // }

    console.log("Registration data:", registrationData);

    // Send registration request
    axios.post('http://localhost:5000/api/student/studentregister', registrationData)
      .then((response) => {
        console.log("Registration response:", response.data);

        if (response.data.success) {
          navigate("/OtpLogin", {
            state: { admissionNumber: registrationData.admissionNumber },
          });
          alert("Registration successful! You can now login.");

          setShowRegistration(false);
          // Reset registration form
          setRegistrationData({
            name: '',
            admissionNumber: '',
            email: '',
            attendancePercentage: ''
          });
        } else {
          alert(response.data?.message || "Registration failed");
        }
      })
      .catch((error) => {
        console.error("Registration error:", error);
        alert(
          error.response?.data?.message ||
          error.message ||
          "Registration failed"
        );
      });
  };

  const handleSubmit = (tab) => {
    const data = formData[tab];

    if (tab === "student") {
      if (!data.admissionNumber.trim() || !data.password.trim()) {
        alert("Admission number and password are required");
        return;
      }
    }

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

    axios.post(
      `http://localhost:5000/api/${activeTab === "student"
        ? "student/login"
        : activeTab === "admin"
          ? "admin/auth/login"
          : "teacher/auth/login"
      }`,
      data
    )
      .then((response) => {
        console.log("LOGIN RESPONSE:", response.data);

        if (!response.data || response.data.message !== "Login successful") {
  alert(response.data?.message || "Login failed");
  return;
}


        if (activeTab === "student") {
          navigate("/StudentDashboard", {
            state: { admissionNumber: data.admissionNumber, password: data.password },
          });
          return;
        }

        if (activeTab === "admin") {
          const email = response.data.admin?.email;
          if (!email) {
            alert("Admin email missing in response");
            return;
          }
          navigate("/OtpLogin", { state: { email } });
          return;
        }

        if (activeTab === "faculty") {
          navigate("/OtpLogin", {
            state: { facultyId: response.data.teacher?.facultyId },
          });
          return;
        }
      })
      .catch((error) => {
        console.error("Axios error:", error);
        alert(error.response?.data?.message || error.message || "Something went wrong");
      });

  };

  const renderRegistrationForm = () => {
    return (
      <div className="tab-content">
        <div className="form-header">
          <h2 className="form-title">Student Registration</h2>
        </div>
        <div className="form-content">
          {/* Name Field */}
          <div className="form-field">
            <input
              type="text"
              value={registrationData.name}
              onChange={(e) => handleRegistrationChange('name', e.target.value)}
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>

          {/* Admission Number Field */}
          <div className="form-field">
            <input
              type="text"
              value={registrationData.admissionNumber}
              onChange={(e) => handleRegistrationChange('admissionNumber', e.target.value)}
              className="form-input"
              placeholder="Enter your admission number"
            />
          </div>

          {/* Email Field */}
          <div className="form-field">
            <input
              type="email"
              value={registrationData.email}
              onChange={(e) => handleRegistrationChange('email', e.target.value)}
              className="form-input"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-field">

            {/* password field */}
            <input
              type="password"
              value={registrationData.password}
              onChange={(e) => handleRegistrationChange('password', e.target.value)}
              className="form-input"
              placeholder="Enter your password"
            />
          </div>

          <div className='form-field'>
            { /*className field */}
            <input
              type="text"
              value={registrationData.className}
              onChange={(e) => handleRegistrationChange('className', e.target.value)}
              className="form-input"
              placeholder="Enter your class"
            />
          </div>
          <div className='form-field'>
            {/* section field */}
            <input type=
            "text"
            value={registrationData.section}
            onChange={(e) => handleRegistrationChange('section', e.target.value)}
            className="form-input"
            placeholder="Enter your section"
          />
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegistrationSubmit}
            className="login-button"
          >
            Register
          </button>

          {/* Back to Login Link */}
          <div className="form-footer">
            <button
              type="button"
              className="forgot-password"
              onClick={() => setShowRegistration(false)}
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLoginForm = (tabType) => {
    const currentData = formData[tabType];
    const tabTitles = {
      student: 'Student Login',
      admin: 'Admin Login',
      faculty: 'Faculty Login'
    };
    const buttonLabels = {
      student: "Student login",
      admin: "Admin Login",
      faculty: "Faculty Login"
    };

    const placeholders = {
      student: { admissionNumber: 'Enter your admission no', password: 'Enter your password' },
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
          <input
            type='text'
            id={`${tabType}-id`}
            value={currentData[idField]}
            onChange={(e) => handleInputChange(tabType, idField, e.target.value)}
            className="form-input"
            placeholder={placeholders[tabType][idField]}
          />
        </div>
        <div className="form-content">
          {/* Password Field */}
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
            {/* New User Link - Only for Student */}
            {tabType === "student" && (
              <button
                type="button"
                className="forgot-password"
                onClick={() => setShowRegistration(true)}
                style={{ marginTop: '10px' }}
              >
                New user? Register here
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="login-container">
      <div className="form-section">
        <div className="form-container">
          <div className="logo-container">
            <div className="logo"></div>
          </div>

          {/* Show tabs only when not in registration mode */}
          {!showRegistration && (
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
          )}

          {/* Render registration form or login form */}
          {showRegistration ? renderRegistrationForm() : renderLoginForm(activeTab)}
        </div>
      </div>
    </div>
  );
}