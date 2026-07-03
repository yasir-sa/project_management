import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import API from '../api';
import './Auth.css';

function AdminRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/api/auth/admin/register', form);
      toast.success('Account created! Please login.');
      navigate('/admin/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left admin-variant">
        <div className="al-top">
          <div className="al-logo">PM</div>
          <span className="al-app-name">ProManage</span>
        </div>
        <div className="al-mid">
          <h2 className="al-headline">Start managing projects today.</h2>
          <ul className="al-feats">
            <li><span className="al-check">✓</span>Create your admin account</li>
            <li><span className="al-check">✓</span>Register your team members</li>
            <li><span className="al-check">✓</span>Assign and track projects</li>
            <li><span className="al-check">✓</span>Get notified on overdue tasks</li>
          </ul>
        </div>
        <p className="al-copy">ProManage · Admin Portal</p>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2>Create Account</h2>
          <p>Set up your admin account to get started</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your full name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="admin@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Create a strong password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="auth-submit" style={{ background: '#3B5BDB' }}
              type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <div className="auth-links">
            <span>Already have an account? <Link to="/admin/login">Sign in</Link></span>
            <Link className="back" to="/">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
