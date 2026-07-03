import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/api/auth/admin/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
          <h2 className="al-headline">Manage your team with clarity.</h2>
          <ul className="al-feats">
            <li><span className="al-check">✓</span>Add and manage employees</li>
            <li><span className="al-check">✓</span>Assign projects with deadlines</li>
            <li><span className="al-check">✓</span>Track overdue tasks instantly</li>
            <li><span className="al-check">✓</span>Message your team directly</li>
          </ul>
        </div>
        <p className="al-copy">ProManage · Admin Portal</p>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2>Admin Sign In</h2>
          <p>Enter your credentials to access the dashboard</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="admin@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="auth-submit" style={{ background: '#3B5BDB' }}
              type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <div className="auth-links">
            <span>New admin? <Link to="/admin/register">Create account</Link></span>
            <Link className="back" to="/">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
