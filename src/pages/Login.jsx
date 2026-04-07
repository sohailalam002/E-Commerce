import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Validation
    if (!email || !password) {
      toast.error("Please fill in all fields!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      const userRole = result.user.role;
      
      if (userRole === 'superadmin') {
        navigate('/superadmin-dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center py-5 position-relative">
      <Link 
        to="/"
        className="btn btn-link text-decoration-none text-secondary position-absolute" 
        style={{top: '20px', left: '20px', marginTop: '60px'}}
      >
        <ArrowLeft size={20} className="mr-1"/> Back to Home
      </Link>

      <div className="card border-0 shadow-lg p-5 w-100 mt-4" style={{maxWidth: '450px', borderRadius: '1rem'}}>
        <div className="text-center mb-4">
          <h2 className="font-weight-bold text-primary mb-1">Welcome Back</h2>
          <p className="text-muted">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="email" className="font-weight-bold small text-secondary">Email Address</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text bg-light border-right-0">
                  <Mail size={18} className="text-muted" />
                </span>
              </div>
              <input
                type="email"
                className="form-control bg-light border-left-0 pl-0"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label htmlFor="password" className="font-weight-bold small text-secondary mb-0">Password</label>
              <Link to="#" className="small text-decoration-none text-primary">Forgot password?</Link>
            </div>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text bg-light border-right-0">
                  <Lock size={18} className="text-muted" />
                </span>
              </div>
              <input
                type="password"
                className="form-control bg-light border-left-0 pl-0"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center mb-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'} <LogIn size={20} className="ml-2" />
          </button>
        </form>

        <div className="text-center border-top pt-4 mt-3">
          <p className="text-muted small mb-0">
            Don't have an account? <Link to="/register" className="font-weight-bold text-primary text-decoration-none">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
