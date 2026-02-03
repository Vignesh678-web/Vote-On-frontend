import { useState } from 'react';
import "../Components/Styles/Login.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, GraduationCap, ShieldCheck, Users, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PeopleAnimation = () => {
  const items = [
    { icon: GraduationCap, color: '#0b5842' },
    { icon: ShieldCheck, color: '#1d4ed8' },
    { icon: Users, color: '#7c3aed' },
    { icon: User, color: '#059669' },
  ];

  return (
    <div className="people-animation-container">
      {Array.from({ length: 20 }).map((_, i) => {
        const Item = items[i % items.length];
        return (
          <motion.div
            key={i}
            className="floating-item"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: ["-10%", "110%"],
              opacity: [0, 0.2, 0.2, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 20,
            }}
            style={{
              position: 'absolute',
              color: Item.color,
              pointerEvents: 'none',
              filter: 'blur(1px)',
            }}
          >
            <Item.icon size={Math.random() * 30 + 20} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default function UserLogin() {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showPassword, setShowPassword] = useState({
    student: false,
    admin: false,
    faculty: false,
    registration: false
  });

  const togglePasswordVisibility = (type) => {
    setShowPassword(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const [formData, setFormData] = useState({
    student: { admissionNumber: '', password: '' },
    admin: { adminId: '', password: '' },
    faculty: { facultyId: '', password: '' }
  });

  const [registrationData, setRegistrationData] = useState({
    name: '',
    admissionNumber: '',
    email: '',
    password: '',
    className: '',
    section: ''
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

  const handleSubmit = async (tab) => {
    const data = formData[tab];

    // Basic validation
    if (tab === "student" && (!data.admissionNumber || !data.password)) {
      alert("Admission number and password are required");
      return;
    }

    if (tab === "admin" && (!data.adminId || !data.password)) {
      alert("Admin ID and password are required");
      return;
    }

    if (tab === "faculty" && (!data.facultyId || !data.password)) {
      alert("Faculty Officer ID and password are required");
      return;
    }

    // Correct endpoint mapping
    const urlMap = {
      student: "http://localhost:5000/api/student/login",
      admin: "http://localhost:5000/api/admin/auth/login",
      faculty: "http://localhost:5000/api/teacher/auth/login",
    };

    try {
      const response = await axios.post(urlMap[tab], data);
      const res = response.data;

      console.log("LOGIN RESPONSE:", res);

      if (!res || res.success === false) {
        alert(res?.message || "Login failed");
        return;
      }

      // 🔐 SAVE TOKEN (UNIVERSAL)
      if (!res.token) {
        alert("No token received from server");
        return;
      }

      localStorage.setItem("token", res.token);
      const roleMap = {
        student: "student",
        admin: "admin",
        faculty: "teacher"
      };

      localStorage.setItem("role", roleMap[tab]);


      // OPTIONAL: save user info safely
      if (tab === "student" && res.student) {
        localStorage.setItem("student", JSON.stringify(res.student));
        localStorage.setItem("userId", res.student._id);
      }

      if (tab === "admin" && res.admin) {
        localStorage.setItem("admin", JSON.stringify(res.admin));
      }

      if (tab === "faculty" && res.teacher) {
        localStorage.setItem("teacher", JSON.stringify(res.teacher));
      }

      // ---- REDIRECTS ----
      if (tab === "student") {
        navigate("/studentDashboard");
        return;
      }

      if (tab === "admin") {
        navigate("/adminDashboard");
        return;
      }

      if (tab === "faculty") {
        navigate("/teacherDashboard");
        return;
      }

    } catch (error) {
      console.error("Login error:", error);
      alert(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    }

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

          <div className="form-field password-field">
            <input
              type={showPassword.registration ? "text" : "password"}
              value={registrationData.password}
              onChange={(e) => handleRegistrationChange('password', e.target.value)}
              className="form-input"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility('registration')}
            >
              {showPassword.registration ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
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
      faculty: 'Faculty Officer Login'
    };
    const buttonLabels = {
      student: "Student login",
      admin: "Admin Login",
      faculty: "Faculty Officer Login"
    };

    const placeholders = {
      student: { admissionNumber: 'Enter your admission no', password: 'Enter your password' },
      admin: { adminId: 'Enter admin ID', password: 'Enter admin password' },
      faculty: { facultyId: 'Enter officer ID', password: 'Enter password' }
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
          <div className="form-field password-field">
            <input
              type={showPassword[tabType] ? "text" : "password"}
              id={`${tabType}-password`}
              value={currentData.password}
              onChange={(e) => handleInputChange(tabType, 'password', e.target.value)}
              className="form-input"
              placeholder={placeholders[tabType].password}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility(tabType)}
            >
              {showPassword[tabType] ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={() => handleSubmit(tabType)}
            className="login-button"
            style={{ marginTop: '1rem' }}
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
        <PeopleAnimation />
        <motion.div 
          className="form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="logo-container">
            <motion.div 
              className="logo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: 1,
                rotate: [0, -1, 1, 0]
              }}
              transition={{ 
                initial: { duration: 0.5 },
                scale: { 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                },
                rotate: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            ></motion.div>
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
                Faculty Officer
              </button>
            </div>
          )}

          {/* Render registration form or login form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={showRegistration ? 'registration' : activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {showRegistration ? renderRegistrationForm() : renderLoginForm(activeTab)}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}