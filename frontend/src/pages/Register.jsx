import React, { useState } from 'react';
import { Mail, Lock, UserPlus, ArrowLeft, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (!role) {
      toast.error("Please select a role!");
      return;
    }
    
    setIsSubmitting(true);
    const result = await register({ name, email, password, role });
    setIsSubmitting(false);
    
    if (result.success) {
      console.log('Register: Success, redirecting to /login');
      navigate('/login');
    }
  };

  return (
    <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center py-5 position-relative">
      <Link 
        to="/"
        className="btn btn-link text-decoration-none text-secondary position-absolute" 
        style={{top: '20px', left: '20px', marginTop: '60px'}}
      >
        <ArrowLeft size={20} className="mr-1" /> Back to Home
      </Link>

      <div className="card border-0 shadow-lg p-5 w-100 mt-4" style={{maxWidth: '500px', borderRadius: '1rem'}}>
        <div className="text-center mb-4">
          <h2 className="font-weight-bold text-primary mb-1">Create Account</h2>
          <p className="text-muted">Join our platform today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name" className="font-weight-bold small text-secondary">Full Name</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text bg-light border-right-0">
                  <User size={18} className="text-muted" />
                </span>
              </div>
              <input
                type="text"
                className="form-control bg-light border-left-0 pl-0"
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-3">
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

          <div className="form-group mb-3">
            <label htmlFor="password" className="font-weight-bold small text-secondary mb-0">Password</label>
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

          <div className="form-group mb-3">
            <label htmlFor="confirmPassword" className="font-weight-bold small text-secondary mb-0">Confirm Password</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text bg-light border-right-0">
                  <Lock size={18} className="text-muted" />
                </span>
              </div>
              <input
                type="password"
                className="form-control bg-light border-left-0 pl-0"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="role" className="font-weight-bold small text-secondary mb-0">Select Role</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text bg-light border-right-0">
                  <UserPlus size={18} className="text-muted" />
                </span>
              </div>
              <select 
                className="form-control bg-light border-left-0 pl-0" 
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="user">User 🛍️</option>
                <option value="admin">Admin 👑</option>
                <option value="superadmin">Super Admin 🛡️</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center mb-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Register'} <UserPlus size={20} className="ml-2" />
          </button>
        </form>

        <div className="text-center border-top pt-4 mt-2">
          <p className="text-muted small mb-0">
            Already have an account? <Link to="/login" className="font-weight-bold text-primary text-decoration-none">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
