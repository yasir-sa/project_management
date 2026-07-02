import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing">
      <div className="landing-glow g1" />
      <div className="landing-glow g2" />
      <div className="landing-content">
        <div className="landing-brand">
          <div className="brand-logo">PM</div>
          <h1>Project Management</h1>
          <p>The smart way to manage your team and projects</p>
        </div>
        <div className="landing-cards">
          <div className="portal-card">
            <div className="portal-icon" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><path d="M18 3l2 2-2 2M20 5h-4"/></svg>
            </div>
            <h2>Admin Portal</h2>
            <p>Register employees, assign projects and track team progress.</p>
            <button className="btn-primary" onClick={() => navigate('/admin/login')}>Login as Admin</button>
            <button className="btn-ghost" onClick={() => navigate('/admin/register')}>Create Account</button>
          </div>
          <div className="portal-divider"><span>OR</span></div>
          <div className="portal-card">
            <div className="portal-icon" style={{ background: 'linear-gradient(135deg,#0891b2,#0e7490)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
            </div>
            <h2>Employee Portal</h2>
            <p>View your assigned projects, deadlines and message your admin.</p>
            <button className="btn-cyan" onClick={() => navigate('/employee/login')}>Login as Employee</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
