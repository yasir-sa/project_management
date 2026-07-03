import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import './EmployeeDashboard.css';

const STATUS_LABELS = { pending: 'Pending', 'in-progress': 'In Progress', completed: 'Completed' };
const STATUS_CLASS  = { pending: 'badge-yellow', 'in-progress': 'badge-blue', completed: 'badge-green' };

function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [nav, setNav]            = useState('projects');
  const [projects, setProjects]  = useState([]);
  const [messages, setMessages]  = useState([]);
  const [msgInput, setMsgInput]  = useState('');
  const chatEnd = useRef(null);

  useEffect(() => { fetchProjects(); fetchMessages(); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchProjects = async () => {
    try { const r = await API.get(`/api/projects/employee/${user.id}`); setProjects(r.data); }
    catch { toast.error('Failed to load projects'); }
  };

  const fetchMessages = async () => {
    try { const r = await API.get(`/api/messages/${user.id}`); setMessages(r.data); }
    catch { toast.error('Failed to load messages'); }
  };

  const handleStatusUpdate = async (id, status) => {
    try { await API.patch(`/api/projects/${id}/status`, { status }); toast.success('Status updated!'); fetchProjects(); }
    catch { toast.error('Failed to update'); }
  };

  const handleSendMsg = async (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    try {
      await API.post('/api/messages', { content: msgInput, senderType: 'employee', senderId: user.id, employeeId: user.id });
      setMsgInput(''); fetchMessages();
    } catch { toast.error('Failed to send'); }
  };

  const handleLogout = async () => {
    await API.post('/api/auth/logout');
    logout(); navigate('/');
  };

  const today = new Date().toISOString().split('T')[0];
  const overdueProjects = projects.filter(p => p.dueDate < today && p.status !== 'completed');
  const unreadCount     = messages.filter(m => m.senderType === 'admin' && !m.isRead).length;

  const navItems = [
    { key: 'projects',  label: 'My Projects', icon: '📋' },
    { key: 'messages',  label: 'Messages',    icon: '💬' },
    { key: 'profile',   label: 'Profile',     icon: '👤' },
  ];

  return (
    <div className="employee-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span>PM</span>
          <span className="sidebar-brand-text">ProManage</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button key={item.key} className={`nav-item ${nav === item.key ? 'active' : ''}`}
              onClick={() => setNav(item.key)}>
              <span className="nav-icon">{item.icon}</span> {item.label}
              {item.key === 'messages' && unreadCount > 0 && (
                <span className="unread-badge">{unreadCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <p className="user-name">{user?.name}</p>
              <p className="user-role">Employee</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className="employee-main">
        <header className="employee-header">
          <h1>{navItems.find(n => n.key === nav)?.label}</h1>
          <div className="header-right">
            {overdueProjects.length > 0 && (
              <span className="badge badge-red">⚠ {overdueProjects.length} Overdue</span>
            )}
          </div>
        </header>

        <div className="employee-content">

          {/* PROJECTS */}
          {nav === 'projects' && (
            <div>
              <div className="welcome-banner">
                <div className="welcome-text">
                  <h2>Welcome back, {user?.name?.split(' ')[0]}!</h2>
                  <p>Here's your project overview for today.</p>
                </div>
                <div className="welcome-stats">
                  <div className="ws-item">
                    <p className="ws-num">{projects.length}</p>
                    <p className="ws-label">Total</p>
                  </div>
                  <div className="ws-item">
                    <p className="ws-num">{projects.filter(p => p.status === 'in-progress').length}</p>
                    <p className="ws-label">In Progress</p>
                  </div>
                  <div className="ws-item">
                    <p className="ws-num">{projects.filter(p => p.status === 'completed').length}</p>
                    <p className="ws-label">Done</p>
                  </div>
                </div>
              </div>

              <div className="projects-section">
                <div className="section-header">
                  <h3>Assigned Projects</h3>
                  <p>{projects.length} total · {overdueProjects.length} overdue</p>
                </div>
                <div className="projects-grid">
                  {projects.length === 0 && (
                    <div className="no-projects">
                      <p>No projects assigned yet. Your admin will assign projects soon.</p>
                    </div>
                  )}
                  {projects.map(p => {
                    const isOverdue = p.dueDate < today && p.status !== 'completed';
                    return (
                      <div key={p.id} className={`project-card ${isOverdue ? 'overdue' : ''}`}>
                        <div className="pc-top">
                          <h4 className="pc-title">{p.title}</h4>
                          <span className={`badge ${STATUS_CLASS[p.status]}`}>{STATUS_LABELS[p.status]}</span>
                        </div>
                        {p.description && <p className="pc-desc">{p.description}</p>}
                        <div className="pc-meta">
                          <span className={`pc-due ${isOverdue ? 'overdue' : ''}`}>
                            📅 {isOverdue ? 'Overdue · ' : 'Due · '}{p.dueDate}
                          </span>
                          <select
                            className={`status-select ${STATUS_CLASS[p.status]}`}
                            value={p.status}
                            onChange={e => handleStatusUpdate(p.id, e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {nav === 'messages' && (
            <div className="msg-wrapper">
              <div className="msg-header">
                <h3>Messages with Admin</h3>
                <p>Ask questions or share updates about your projects</p>
              </div>
              <div className="chat-messages">
                {messages.length === 0 && (
                  <p className="no-messages">No messages yet. Send a message to your admin!</p>
                )}
                {messages.map(msg => (
                  <div key={msg.id} className={`msg-bubble ${msg.senderType === 'employee' ? 'msg-right' : 'msg-left'}`}>
                    <p>{msg.content}</p>
                    <span className="msg-time">
                      {msg.senderType === 'admin' ? 'Admin · ' : 'You · '}
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                <div ref={chatEnd} />
              </div>
              <form className="chat-input" onSubmit={handleSendMsg}>
                <input placeholder="Ask your admin something..." value={msgInput}
                  onChange={e => setMsgInput(e.target.value)} />
                <button type="submit">Send</button>
              </form>
            </div>
          )}

          {/* PROFILE */}
          {nav === 'profile' && (
            <div className="profile-card">
              <div className="profile-avatar-lg">{user?.name?.[0]?.toUpperCase()}</div>
              <div className="profile-info">
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
              </div>
              <div className="profile-fields">
                <div className="pf-item">
                  <label>Department</label>
                  <p>{user?.department || '—'}</p>
                </div>
                <div className="pf-item">
                  <label>Phone</label>
                  <p>{user?.phone || '—'}</p>
                </div>
                <div className="pf-item">
                  <label>Projects</label>
                  <p>{projects.length}</p>
                </div>
                <div className="pf-item">
                  <label>Completed</label>
                  <p>{projects.filter(p => p.status === 'completed').length}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default EmployeeDashboard;
