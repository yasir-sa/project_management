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
  const [tab, setTab]           = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
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
  const overdueProjects  = projects.filter(p => p.dueDate < today && p.status !== 'completed');
  const pendingProjects  = projects.filter(p => p.status === 'pending');
  const doneProjects     = projects.filter(p => p.status === 'completed');

  return (
    <div className="emp-layout">
      {/* Header */}
      <header className="emp-header">
        <div className="emp-header-brand">
          <div className="brand-dot">PM</div>
          <span>ProManage</span>
        </div>
        <div className="emp-header-right">
          <div className="emp-info">
            <div className="hdr-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <p className="hdr-name">{user?.name}</p>
              <p className="hdr-role">Employee</p>
            </div>
          </div>
          <button className="emp-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="emp-body">
        {/* Overdue Alert */}
        {overdueProjects.length > 0 && (
          <div className="overdue-alert">
            ⚠️ You have <strong>{overdueProjects.length}</strong> overdue {overdueProjects.length === 1 ? 'project' : 'projects'}. Please update the status or contact your admin.
          </div>
        )}

        {/* Stats */}
        <div className="emp-stats">
          <div className="emp-stat"><p className="es-num">{projects.length}</p><p className="es-label">Total Projects</p></div>
          <div className="emp-stat"><p className="es-num">{pendingProjects.length}</p><p className="es-label">Pending</p></div>
          <div className="emp-stat"><p className="es-num">{projects.filter(p=>p.status==='in-progress').length}</p><p className="es-label">In Progress</p></div>
          <div className="emp-stat"><p className="es-num">{doneProjects.length}</p><p className="es-label">Completed</p></div>
          <div className="emp-stat danger"><p className="es-num">{overdueProjects.length}</p><p className="es-label">Overdue</p></div>
        </div>

        {/* Tabs */}
        <div className="emp-tabs">
          <button className={`emp-tab ${tab === 'projects' ? 'active' : ''}`} onClick={() => setTab('projects')}>📋 My Projects</button>
          <button className={`emp-tab ${tab === 'messages' ? 'active' : ''}`} onClick={() => setTab('messages')}>💬 Messages</button>
        </div>

        {/* Projects Tab */}
        {tab === 'projects' && (
          <div className="proj-grid">
            {projects.length === 0 && (
              <div className="empty-state"><p>🎉</p><h3>No projects assigned yet</h3><p>Your admin will assign projects to you soon.</p></div>
            )}
            {projects.map(p => {
              const isOverdue = p.dueDate < today && p.status !== 'completed';
              return (
                <div key={p.id} className={`proj-card ${isOverdue ? 'proj-overdue' : ''}`}>
                  {isOverdue && <div className="overdue-tag">OVERDUE</div>}
                  <div className="proj-card-header">
                    <h3>{p.title}</h3>
                    <span className={`badge ${STATUS_CLASS[p.status]}`}>{STATUS_LABELS[p.status]}</span>
                  </div>
                  {p.description && <p className="proj-desc">{p.description}</p>}
                  <div className="proj-meta">
                    <span className={isOverdue ? 'due-red' : 'due-normal'}>📅 Due: {p.dueDate}</span>
                  </div>
                  <div className="proj-actions">
                    <label>Update Status:</label>
                    <select value={p.status} onChange={e => handleStatusUpdate(p.id, e.target.value)}
                      className={`status-sel ${STATUS_CLASS[p.status]}`}>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Messages Tab */}
        {tab === 'messages' && (
          <div className="emp-chat">
            <div className="emp-chat-box">
              {messages.length === 0 && <p className="no-msg">No messages yet. Send a message to your admin!</p>}
              {messages.map(msg => (
                <div key={msg.id} className={`msg-bubble ${msg.senderType === 'employee' ? 'msg-right' : 'msg-left'}`}>
                  <p className="msg-sender">{msg.senderType === 'employee' ? 'You' : 'Admin'}</p>
                  <p>{msg.content}</p>
                  <span className="msg-time">{new Date(msg.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
                </div>
              ))}
              <div ref={chatEnd} />
            </div>
            <form className="emp-chat-input" onSubmit={handleSendMsg}>
              <input placeholder="Ask your admin something..." value={msgInput}
                onChange={e => setMsgInput(e.target.value)} />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
