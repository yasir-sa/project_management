import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function EmployeeLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/api/auth/employee/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome, ${res.data.user.name}!`);
      navigate('/employee/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left emp-variant">
        <div className="al-top">
          <div className="al-logo">PM</div>
          <span className="al-app-name">ProManage</span>
        </div>
        <div className="al-mid">
          <h2 className="al-headline">Stay on top of your projects.</h2>
          <ul className="al-feats">
            <li><span className="al-check">✓</span>View your assigned projects</li>
            <li><span className="al-check">✓</span>Update project status anytime</li>
            <li><span className="al-check">✓</span>Track your deadlines clearly</li>
            <li><span className="al-check">✓</span>Message your admin directly</li>
          </ul>
        </div>
        <p className="al-copy">ProManage · Employee Portal</p>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2>Employee Sign In</h2>
          <p>Enter your credentials to access your workspace</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="employee@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="auth-submit" style={{ background: '#0C7A6F' }}
              type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <div className="auth-links">
            <Link className="back" to="/">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeLogin;
