import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing">
      <div className="landing-content">
        <div className="landing-brand">
          <div className="brand-logo">PM</div>
          <h1>ProManage</h1>
          <p>A professional project management platform for modern teams</p>
        </div>
        <div className="landing-cards">
          <div className="portal-card">
            <div className="portal-icon admin-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                <path d="M18 3l2 2-2 2M20 5h-4"/>
              </svg>
            </div>
            <div className="portal-text">
              <h2>Admin Portal</h2>
              <p>Register employees, assign projects with deadlines, and track your team's progress.</p>
            </div>
            <div className="portal-actions">
              <button className="btn-primary" onClick={() => navigate('/admin/login')}>Login as Admin</button>
              <button className="btn-ghost" onClick={() => navigate('/admin/register')}>Create Admin Account</button>
            </div>
          </div>

          <div className="portal-divider">
            <span>OR</span>
          </div>

          <div className="portal-card">
            <div className="portal-icon emp-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-4 0v2"/>
                <line x1="12" y1="12" x2="12" y2="16"/>
                <line x1="10" y1="14" x2="14" y2="14"/>
              </svg>
            </div>
            <div className="portal-text">
              <h2>Employee Portal</h2>
              <p>View your assigned projects, update statuses, and message your admin directly.</p>
            </div>
            <div className="portal-actions">
              <button className="btn-teal" onClick={() => navigate('/employee/login')}>Login as Employee</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
