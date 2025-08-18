import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from './auth.jsx';

const OTPLoginSystem = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentStep, setCurrentStep] = useState('login'); // 'login', 'otp', 'success'
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    otp: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-show popup after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Basic validation for OTP (only numbers)
    if (name === 'otp' && value && !/^\d*$/.test(value)) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Handle login form submission
  const handleLoginSubmit = async () => {
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.phone || !formData.email) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          email: formData.email
        })
      });

      if (response.ok) {
        setCurrentStep('otp');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
    const {  setIsAuthenticated } = useAuth();
const handleOTPSubmit = async () => {
  setLoading(true);
  setError('');

  // Basic validation
  if (!formData.otp || formData.otp.length !== 6) {
    setError('Please enter a valid 6-digit OTP');
    setLoading(false);
    return;
  }

  try {
    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: formData.phone,
        otp: formData.otp
      })
    });

    const data = await response.json(); // ✅ Parse JSON

    if (response.ok && data.token) {
      localStorage.setItem('token', data.token); // ✅ Use parsed data
      setIsAuthenticated(true);
      setCurrentStep('success');
      console.log(data.token);
      navigate('/User');
    } else {
      setError(data.message || 'Invalid OTP'); // Optional: handle server error message
    }
  } catch (err) {
    setError('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};


  // Close popup
  const closePopup = () => {
    setShowPopup(false);
    setCurrentStep('login');
    setFormData({ phone: '', email: '', otp: '' });
    setError('');
  };

  return (
    <div className="app-container">
      {/* Homepage Content */}
      <div className={`homepage ${showPopup ? 'blurred' : ''}`}>
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              ✈️ Explore the World
            </h1>
            <p className="hero-subtitle">
              Your next adventure awaits. Discover amazing destinations and create unforgettable memories.
            </p>
            <div className="hero-features">
              <div className="feature">
                <span className="feature-icon">🌍</span>
                <span>200+ Destinations</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎒</span>
                <span>Adventure Packages</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🏨</span>
                <span>Best Hotels</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-element airplane">✈️</div>
            <div className="floating-element balloon">🎈</div>
            <div className="floating-element compass">🧭</div>
          </div>
        </div>
      </div>

      {/* Login Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()}>
            {/* Travel Characters */}
            <div className="travel-character airplane-char">✈️</div>
            <div className="travel-character suitcase-char">🧳</div>
            <div className="travel-character map-char">🗺️</div>

            {/* Close Button */}
            <button className="close-btn" onClick={closePopup}>✕</button>

            {/* Login Form */}
            {currentStep === 'login' && (
              <div className="login-form">
                <div className="form-header">
                  <h2>Welcome Traveler! 🌟</h2>
                  <p>Enter your details to start your journey</p>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="traveler@example.com"
                    required
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button 
                  type="button" 
                  className="submit-btn" 
                  disabled={loading}
                  onClick={handleLoginSubmit}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP 🚀
                    </>
                  )}
                </button>
              </div>
            )}

            {/* OTP Verification Form */}
            {currentStep === 'otp' && (
              <div className="otp-form">
                <div className="form-header">
                  <h2>Verify Your Identity 🔐</h2>
                  <p>Enter the OTP sent to your phone</p>
                </div>

                <div className="form-group">
                  <label htmlFor="otp">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    required
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button 
                  type="button" 
                  className="submit-btn" 
                  disabled={loading}
                  onClick={handleOTPSubmit}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP ✅
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setCurrentStep('login')}
                >
                  ← Back to Login
                </button>
              </div>
            )}

            {/* Success Page */}
            {currentStep === 'success' && (
              <div className="success-page">
                <div className="success-animation">
                  <div className="checkmark">✓</div>
                </div>
                <h2>Welcome Aboard! 🎉</h2>
                <p>Your account has been verified successfully.</p>
                <p>Get ready for your next adventure!</p>
                <button 
                  className="continue-btn"
                  onClick={() => {
                    closePopup();
                    navigate('/User');
                  }}
                >
                  Continue to Dashboard 🌟
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .app-container {
          min-height: 100vh;
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .homepage {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: filter 0.3s ease;
        }

        .homepage.blurred {
          filter: blur(8px);
        }

        .hero-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          width: 100%;
          padding: 0 2rem;
        }

        .hero-content {
          flex: 1;
          color: white;
          max-width: 600px;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .hero-features {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.1);
          padding: 0.8rem 1.2rem;
          border-radius: 25px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .feature-icon {
          font-size: 1.5rem;
        }

        .hero-image {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 400px;
        }

        .floating-element {
          position: absolute;
          font-size: 3rem;
          animation: float 3s ease-in-out infinite;
        }

        .airplane {
          top: 10%;
          right: 20%;
          animation-delay: 0s;
        }

        .balloon {
          top: 60%;
          right: 10%;
          animation-delay: 1s;
        }

        .compass {
          top: 40%;
          right: 40%;
          animation-delay: 2s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .popup-container {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          border-radius: 20px;
          padding: 2rem;
          max-width: 450px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          position: relative;
          animation: bounceIn 0.5s ease;
        }

        .travel-character {
          position: absolute;
          font-size: 2rem;
          z-index: 1;
          animation: pulse 2s infinite;
        }

        .airplane-char {
          top: -10px;
          right: -10px;
          animation-delay: 0s;
        }

        .suitcase-char {
          bottom: -10px;
          left: -10px;
          animation-delay: 1s;
        }

        .map-char {
          top: 50%;
          left: -15px;
          animation-delay: 2s;
        }

        .close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          font-size: 1.5rem;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(255,255,255,0.2);
          transform: scale(1.1);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
          color: white;
        }

        .form-header h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        .form-header p {
          opacity: 0.8;
          font-size: 0.9rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: white;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          box-sizing: border-box;
        }

        .form-group input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .form-group input:focus {
          outline: none;
          border-color: #3498db;
          background: rgba(255,255,255,0.15);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(46, 204, 113, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .back-btn {
          width: 100%;
          padding: 0.8rem;
          background: transparent;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 10px;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .continue-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .continue-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
        }

        .error-message {
          color: #e74c3c;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          text-align: center;
          padding: 0.5rem;
          background: rgba(231, 76, 60, 0.1);
          border-radius: 5px;
          border: 1px solid rgba(231, 76, 60, 0.3);
        }

        .success-page {
          text-align: center;
          color: white;
          padding: 2rem 0;
        }

        .success-animation {
          margin-bottom: 2rem;
        }

        .checkmark {
          font-size: 4rem;
          color: #27ae60;
          display: inline-block;
          animation: checkmarkScale 0.5s ease-in-out;
        }

        .success-page h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .success-page p {
          opacity: 0.9;
          margin-bottom: 0.5rem;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes checkmarkScale {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column;
            text-align: center;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-features {
            justify-content: center;
          }
          
          .popup-container {
            margin: 1rem;
            width: calc(100% - 2rem);
          }
          
          .travel-character {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default OTPLoginSystem;