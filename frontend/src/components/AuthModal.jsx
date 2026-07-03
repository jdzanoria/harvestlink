import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, saveUser, findUser, userExists } from '../utils/auth';

export default function AuthModal({ initialMode, onClose, theme, themeValues, styles }) {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(initialMode);
  const [form, setForm] = useState({ email: '', password: '', role: 'farmer' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('please fil up');
      setSuccess('');
      return;
    }

    if (!isEmailValid(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (authMode === 'login') {
      const normalizedEmail = form.email.toLowerCase();

      // Admin shortcut
      if (normalizedEmail === 'admin@harvestlink.com' && form.password === 'admin') {
        onClose();
        navigate('/admin-dashboard');
        return;
      }

      // Use shared helper to find a saved user
      const matched = findUser(form.email, form.password);
      if (matched) {
        onClose();
        if (matched.role === 'buyer') navigate('/buyer-dashboard');
        else navigate('/farmer-dashboard');
        return;
      }

      setError('Login failed. Check your email and password.');
      setSuccess('');
      return;
    }

    // Register flow: save the new user in localStorage and prompt to sign in.
    const normalizedEmail = form.email.toLowerCase();
    if (userExists(normalizedEmail)) {
      setError('An account with this email already exists. Please sign in.');
      setSuccess('');
      setAuthMode('login');
      setForm((prev) => ({ ...prev, password: '' }));
      return;
    }

    const newUser = { email: normalizedEmail, password: form.password, role: form.role || 'farmer' };
    try {
      saveUser(newUser);
      setAuthMode('login');
      setForm((prev) => ({ ...prev, password: '' }));
      setError('');
      setSuccess('Account created — please sign in.');
      return;
    } catch (err) {
      setError('Registration failed. Please try again.');
      setSuccess('');
      return;
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose} 
      style={{ 
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', 
        backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 9999 
      }}
    >
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          width: '90%', maxWidth: '400px', padding: '30px', 
          backgroundColor: themeValues.cardBg, borderRadius: '24px', 
          border: `1px solid ${themeValues.cardBorder}`,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 style={{ color: themeValues.pageColor, marginTop: 0 }}>
          {authMode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }} autoComplete="off">
          {authMode === 'register' && (
            <select 
              value={form.role} 
              onChange={(e) => handleChange('role', e.target.value)} 
              style={{ ...styles.inputField, backgroundColor: theme === 'dark' ? '#041026' : '#f8fafc', color: themeValues.pageColor }}
            >
              <option value="farmer">I am a Farmer</option>
              <option value="buyer">I am a Buyer</option>
            </select>
          )}

          <input 
            ref={emailInputRef}
            type="email" 
            placeholder="Email" 
            value={form.email} 
            onChange={(e) => handleChange('email', e.target.value)} 
            onKeyDown={(e) => e.stopPropagation()} 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              ...styles.inputField, 
              backgroundColor: theme === 'dark' ? '#041026' : '#f8fafc', 
              color: themeValues.pageColor,
              position: 'relative',
              zIndex: 10000,
              pointerEvents: 'auto'
            }} 
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={form.password} 
            onChange={(e) => handleChange('password', e.target.value)} 
            onKeyDown={(e) => e.stopPropagation()} 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              ...styles.inputField, 
              backgroundColor: theme === 'dark' ? '#041026' : '#f8fafc', 
              color: themeValues.pageColor,
              position: 'relative',
              zIndex: 10000,
              pointerEvents: 'auto'
            }} 
          />

          {error && (
            <p style={{ color: '#f87171', margin: 0, fontSize: '0.95rem' }}>{error}</p>
          )}
          
          <button 
            type="submit" 
            style={{ ...styles.submitButton, backgroundColor: '#16a34a', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
          >
            {authMode === 'login' ? 'Sign In' : 'Register Now'}
          </button>
        </form>
      </div>
    </div>
  );
}