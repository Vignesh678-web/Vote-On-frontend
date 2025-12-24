import React, { useState, useRef, useEffect } from 'react';
import "../Components/Styles/Otp.css"
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Otp = () => {

  const Navigate = useNavigate();
  

  const location = useLocation();
  const email = location.state?.email;
  const facultyId = location.state?.facultyId;

console.log("OTP PAGE STATE:", location.state);
console.log("EMAIL:", email);
  const admissionNumber = location.state?.admissionNumber;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus on first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  console.log(email, 'lllllllllllll');


  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    // Move to next input on arrow right
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Move to previous input on arrow left
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    // Submit on Enter if all fields are filled
    if (e.key === 'Enter' && otp.every(digit => digit !== '')) {
      handleOtpSubmit();
    }

  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const pasteDigits = pasteData.replace(/\D/g, '').slice(0, 6);

    if (pasteDigits.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasteDigits[i] || '';
      }
      setOtp(newOtp);

      // Focus on the last filled input or first empty one
      const lastFilledIndex = Math.min(pasteDigits.length - 1, 5);
      inputRefs.current[lastFilledIndex].focus();
    }
  };

 const handleVerify = async () => {
  const otpString = otp.join('');

  if (otpString.length !== 6) {
    setError('Please enter all 6 digits');
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/admin/auth/verify-ottp",
      {
        email,
        otp: otpString
      }
    );

    if (response.status === 200 && response.data.success) {
      Navigate("/Admindashboard");
    }

  } catch (err) {
    setError(err.response?.data?.message || err.message);
  }
};

const handleStudentVerify = async () => {
  const otpString = otp.join('');

  if (otpString.length !== 6) {
    setError('Please enter all 6 digits');
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/verify-otp",
      { admissionNumber, otp: otpString }
    );

    if (response.status === 200) {
      Navigate("/Studentdashboard");
    }

  } catch (err) {
    setError(err.response?.data?.message || err.message);
  }
};

 const handleFacultyVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/teacher/auth/verify-otp",
        { facultyId, otp: otpString }
      );    
      if (response.status === 200 && response.data.success) {
        Navigate("/teacherDashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } 
  };


  const handleOtpSubmit = () => {
    if (admissionNumber) {
      handleStudentVerify();
    } else if (facultyId) {
      handleFacultyVerify();
    }
    else {
      handleVerify();
    } 
  };



  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setIsVerified(false);
    inputRefs.current[0].focus();
    // Here you would typically trigger the resend OTP API
    alert('OTP resent successfully!');
  };

  const handleReset = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setIsVerified(false);
    inputRefs.current[0].focus();
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="otp-header">
          <div className="otp-icon">
            <div className='logocontainer'>
              <div className='logo'>
                {isVerified ? '' : ''}
              </div>
            </div>
            <h1 className="otp-title">
              {isVerified ? 'Verified!' : 'Enter OTP'}
            </h1>
            <p className="otp-subtitle">
              {isVerified
                ? 'Your phone number has been verified successfully'
                : 'We sent a 6-digit code to your phone number'
              }
            </p>
          </div>
        </div>

        {!isVerified ? (
          <>
            <div className="otp-inputs-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`otp-input ${error ? 'otp-input-error' : ''} ${digit ? 'otp-input-filled' : ''}`}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {error && (
              <div className="otp-error">
                ⚠ {error}
              </div>
            )}

            <button
              onClick={handleOtpSubmit}
              disabled={isVerifying || otp.some(digit => digit === '')}
              className={`otp-button otp-button-primary ${isVerifying || otp.some(digit => digit === '') ? 'otp-button-disabled' : ''
                }`}
            >

              {isVerifying ? (
                <span className="otp-loader">
                  <span className="otp-spinner"></span>
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>

            <div className="otp-resend-container">
              <p className="otp-resend-text">Didn't receive the code?</p>
              <button
                onClick={handleResend}
                className="otp-button otp-button-secondary"
                disabled={isVerifying}
              >
                Resend OTP
              </button>
            </div>
          </>
        ) : (
          <div className="otp-success-container">
            <button
              onClick={handleReset}
              className="otp-button otp-button-secondary"
            >
              Enter New OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Otp;