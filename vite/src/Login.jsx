import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

function App() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('danger'); 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const savedUserId = localStorage.getItem('rememberedUserId');
    if (savedUserId) {
      setUserId(savedUserId);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!userId.trim() || !password.trim()) {
      setMessage('Please enter both User ID and Password');
      setMessageType('warning');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    if (rememberMe) {
      localStorage.setItem('rememberedUserId', userId);
    } else {
      localStorage.removeItem('rememberedUserId');
    }

    axios
      .post('http://localhost:5000/login', {
        user_id: userId,
        password: password,
      })
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          
          setMessage('Login successful! Redirecting...');
          setMessageType('success');
          
          setTimeout(() => {
            navigate('/UserInfo', { state: { user: res.data.user } });
          }, 1000);
        } else {
          setMessage(res.data.message || 'Invalid credentials');
          setMessageType('danger');
        }
      })
      .catch((err) => {
        setLoading(false);
        setMessage(err.response?.data?.message || 'Server error. Please try again later.');
        setMessageType('danger');
        console.log(err);
      });
  };

  const handleForgotPassword = () => {
    
    alert('Forgot password functionality will be implemented here');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="card shadow-lg p-4 border-0" style={{ width: '24rem' }}>
        <h2 className="text-center mb-4 wlc">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="userId" className="form-label">User ID</label>
            <input
              type="text"
              className="form-control"
              id="userId"
              placeholder="Enter your user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="form-group mb-3 d-flex justify-content-between">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
            </div>
            <button 
              type="button" 
              className="btn btn-link p-0" 
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 mt-2" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : 'Login'}
          </button>
          {message && (
            <div className={`alert alert-${messageType} mt-3 mb-0`} role="alert">
              {message}
            </div>
          )}
        </form>
        <div className="mt-3 text-center">
          <p className="mb-0">Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  );
}

export default App;