import React, { useContext, useState, useEffect } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";
import { showToast } from '../../utils/toast';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [authMode, setAuthMode] = useState("Login");
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (authMode === "Sign Up" && !data.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!data.password.trim()) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    const endpoint = authMode === "Login" ? "/api/user/login" : "/api/user/register";

    try {
      const response = await axios.post(`${url}${endpoint}`, data);
      const resData = response.data;

      if (resData.success) {
        localStorage.setItem("token", resData.token);
        setToken(resData.token);
        showToast.success(`Welcome ${authMode === "Login" ? "back" : "to EatSprint"}!`);
        setShowLogin(false);
      } else {
        showToast.error(resData.message || "Something went wrong. Try again.");
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = (newMode) => {
    setAuthMode(newMode);
    setData({ name: "", email: "", password: "" });
    setErrors({});
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setShowLogin(false), 300);
  };

  return (
    <div className={`login-popup ${isVisible ? 'visible' : ''}`}>
      <form onSubmit={handleAuth} className={`login-popup-container ${isVisible ? 'slide-in' : ''}`}>
        <div className="login-popup-title">
          <h2>
            {authMode === "Login" ? "Welcome Back!" : "Join EatSprint"}
          </h2>
          <img
            onClick={handleClose}
            src={assets.cross_icon}
            alt="Close"
            className="close-btn"
          />
        </div>

        <div className="auth-mode-tabs">
          <button
            type="button"
            className={`tab-btn ${authMode === "Login" ? "active" : ""}`}
            onClick={() => handleModeSwitch("Login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`tab-btn ${authMode === "Sign Up" ? "active" : ""}`}
            onClick={() => handleModeSwitch("Sign Up")}
          >
            Sign Up
          </button>
        </div>

        <div className="login-popup-inputs">
          {authMode === "Sign Up" && (
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={data.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                required
              />
              <span className="input-icon">&#128100;</span>
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          )}
          
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={data.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              required
            />
            <span className="input-icon">&#9993;</span>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={data.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              required
            />
            <span className="input-icon">&#128274;</span>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
        </div>

        <button type="submit" className="auth-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="loading-spinner">Processing...</span>
          ) : (
            authMode === "Sign Up" ? "Create Account" : "Sign In"
          )}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the <span>Terms of Use</span> & <span>Privacy Policy</span>.</p>
        </div>

        <div className="auth-switch">
          {authMode === "Login" ? (
            <p>New to EatSprint? <span onClick={() => handleModeSwitch("Sign Up")}>Create an account</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => handleModeSwitch("Login")}>Sign in here</span></p>
          )}
        </div>

        
        
      </form>
    </div>
  );
};

export default LoginPopup;
