import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import './AdminDashboard.css';

const STATUS_COLORS = { pending: 'badge-yellow', 'in-progress': 'badge-blue', completed: 'badge-green' };

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [nav, setNav] = useState('overview');
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects]   = useState([]);
  const [messages, setMessages]   = useState([]);
  const [selEmp, setSelEmp]       = useState(null);
  const [msgInput, setMsgInput]   = useState('');
  const [showEmpForm,  setShowEmpForm]  = useState(false);
  const [showProjForm, setShowProjForm] = useState(false);
  const [empForm,  setEmpForm]  = useState({ name:'', email:'', password:'', phone:'', department:'' });
  const [projForm, setProjForm] = useState({ title:'', description:'', dueDate:'', employeeId:'' });
  const chatEnd = useRef(null);

  useEffect(() => { fetchEmployees(); fetchProjects(); }, []);
  useEffect(() => { if (selEmp) fetchMessages(selEmp.id); }, [selEmp]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchEmployees = async () => {
    try { const r = await API.get('/api/employees'); setEmployees(r.data); }
    catch { toast.error('Failed to load employees'); }
  };
  const fetchProjects = async () => {
    try { const r = await API.get('/api/projects'); setProjects(r.data); }
    catch { toast.error('Failed to load projects'); }
  };
  const fetchMessages = async (id) => {
    try { const r = await API.get(`/api/messages/${id}`); setMessages(r.data); }
    catch { toast.error('Failed to load messages'); }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/employees', empForm);
      toast.success('Employee added!');
      setEmpForm({ name:'', email:'', password:'', phone:'', department:'' });
      setShowEmpForm(false); fetchEmployees();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleToggle = async (id) => {
    try { const r = await API.patch(`/api/employees/${id}/toggle`); toast.success(r.data.message); fetchEmployees(); }
    catch { toast.error('Failed'); }
  };

  const handleDeleteEmp = async (id) => {
    if (!confirm('Remove this employee?')) return;
    try { await API.delete(`/api/employees/${id}`); toast.success('Employee removed!'); fetchEmployees(); }
    catch { toast.error('Failed'); }
  };

  const handleAssignProject = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/projects', projForm);
      toast.success('Project assigned!');
      setProjForm({ title:'', description:'', dueDate:'', employeeId:'' });
      setShowProjForm(false); fetchProjects();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleStatusChange = async (id, status) => {
    try { await API.patch(`/api/projects/${id}/status`, { status }); toast.success('Updated!'); fetchProjects(); }
    catch { toast.error('Failed'); }
  };

  const handleDeleteProj = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await API.delete(`/api/projects/${id}`); toast.success('Deleted!'); fetchProjects(); }
    catch { toast.error('Failed'); }
  };

  const handleSendMsg = async (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !selEmp) return;
    try {
      await API.post('/api/messages', { content: msgInput, senderType: 'admin', senderId: user.id, employeeId: selEmp.id });
      setMsgInput(''); fetchMessages(selEmp.id);
    } catch { toast.error('Failed to send'); }
  };

  const handleLogout = async () => {
    await API.post('/api/auth/logout');
    logout(); navigate('/');
  };

  const today = new Date().toISOString().split('T')[0];
  const overdueCount = projects.filter(p => p.dueDate < today && p.status !== 'completed').length;

  const navItems = [
    { key: 'overview',   label: 'Overview',   icon: '◈' },
    { key: 'employees',  label: 'Employees',  icon: '👥' },
    { key: 'projects',   label: 'Projects',   icon: '📋' },
    { key: 'messages',   label: 'Messages',   icon: '💬' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand"><span className="logo-box">PM</span><span className="sidebar-brand-text">ProManage</span></div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button key={item.key} className={`nav-item ${nav === item.key ? 'active' : ''}`}
              onClick={() => setNav(item.key)}>
              <span className="nav-icon">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div><p className="user-name">{user?.name}</p><p className="user-role">Admin</p></div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>{navItems.find(n => n.key === nav)?.label}</h1>
          <span className="header-date">{new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</span>
        </header>

        <div className="admin-content">

          {/* OVERVIEW */}
          {nav === 'overview' && (
            <div>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-icon" style={{background:'#ede9fe',color:'#7c3aed'}}>👥</div><div><p className="stat-num">{employees.length}</p><p className="stat-label">Total Employees</p></div></div>
                <div className="stat-card"><div className="stat-icon" style={{background:'#dcfce7',color:'#16a34a'}}>✓</div><div><p className="stat-num">{employees.filter(e=>e.isActive).length}</p><p className="stat-label">Active Employees</p></div></div>
                <div className="stat-card"><div className="stat-icon" style={{background:'#dbeafe',color:'#2563eb'}}>📋</div><div><p className="stat-num">{projects.length}</p><p className="stat-label">Total Projects</p></div></div>
                <div className="stat-card"><div className="stat-icon" style={{background:'#fee2e2',color:'#dc2626'}}>⚠</div><div><p className="stat-num">{overdueCount}</p><p className="stat-label">Overdue Projects</p></div></div>
              </div>
              <div className="card mt-24">
                <div className="card-header"><h3>Recent Projects</h3></div>
                <table className="data-table">
                  <thead><tr><th>Title</th><th>Employee</th><th>Due Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {projects.slice(0,6).map(p => (
                      <tr key={p.id} className={p.dueDate < today && p.status !== 'completed' ? 'overdue-row' : ''}>
                        <td>{p.title}</td>
                        <td>{p.employee?.name || '—'}</td>
                        <td>{p.dueDate}</td>
                        <td><span className={`badge ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                      </tr>
                    ))}
                    {projects.length === 0 && <tr><td colSpan={4} className="empty-cell">No projects yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* EMPLOYEES */}
          {nav === 'employees' && (
            <div>
              <div className="section-bar">
                <p>{employees.length} employees registered</p>
                <button className="btn-add" onClick={() => setShowEmpForm(!showEmpForm)}>
                  {showEmpForm ? '✕ Cancel' : '+ Add Employee'}
                </button>
              </div>
              {showEmpForm && (
                <div className="card mb-20">
                  <div className="card-header"><h3>Add New Employee</h3></div>
                  <form className="inline-form" onSubmit={handleAddEmployee}>
                    <div className="form-row-2">
                      <div className="fg"><label>Full Name</label><input placeholder="Employee name" value={empForm.name} onChange={e=>setEmpForm({...empForm,name:e.target.value})} required /></div>
                      <div className="fg"><label>Email</label><input type="email" placeholder="employee@example.com" value={empForm.email} onChange={e=>setEmpForm({...empForm,email:e.target.value})} required /></div>
                    </div>
                    <div className="form-row-3">
                      <div className="fg"><label>Password</label><input type="password" placeholder="Temporary password" value={empForm.password} onChange={e=>setEmpForm({...empForm,password:e.target.value})} required /></div>
                      <div className="fg"><label>Phone</label><input placeholder="Phone number" value={empForm.phone} onChange={e=>setEmpForm({...empForm,phone:e.target.value})} /></div>
                      <div className="fg"><label>Department</label><input placeholder="Department" value={empForm.department} onChange={e=>setEmpForm({...empForm,department:e.target.value})} /></div>
                    </div>
                    <button type="submit" className="btn-submit">Add Employee</button>
                  </form>
                </div>
              )}
              <div className="card">
                <table className="data-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id}>
                        <td><div className="emp-name"><div className="emp-avatar">{emp.name[0].toUpperCase()}</div>{emp.name}</div></td>
                        <td className="text-muted">{emp.email}</td>
                        <td>{emp.department || '—'}</td>
                        <td>{emp.phone || '—'}</td>
                        <td><span className={`badge ${emp.isActive ? 'badge-green' : 'badge-red'}`}>{emp.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>
                          <div className="action-btns">
                            <button className="act-btn toggle" onClick={() => handleToggle(emp.id)}>{emp.isActive ? 'Deactivate' : 'Activate'}</button>
                            <button className="act-btn delete" onClick={() => handleDeleteEmp(emp.id)}>Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {employees.length === 0 && <tr><td colSpan={6} className="empty-cell">No employees yet. Add one above!</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {nav === 'projects' && (
            <div>
              <div className="section-bar">
                <p>{projects.length} projects assigned</p>
                <button className="btn-add" onClick={() => setShowProjForm(!showProjForm)}>
                  {showProjForm ? '✕ Cancel' : '+ Assign Project'}
                </button>
              </div>
              {showProjForm && (
                <div className="card mb-20">
                  <div className="card-header"><h3>Assign New Project</h3></div>
                  <form className="inline-form" onSubmit={handleAssignProject}>
                    <div className="form-row-2">
                      <div className="fg"><label>Project Title</label><input placeholder="Project title" value={projForm.title} onChange={e=>setProjForm({...projForm,title:e.target.value})} required /></div>
                      <div className="fg"><label>Assign To</label>
                        <select value={projForm.employeeId} onChange={e=>setProjForm({...projForm,employeeId:e.target.value})} required>
                          <option value="">Select employee</option>
                          {employees.filter(e=>e.isActive).map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="form-row-2">
                      <div className="fg"><label>Due Date</label><input type="date" value={projForm.dueDate} onChange={e=>setProjForm({...projForm,dueDate:e.target.value})} required /></div>
                      <div className="fg"><label>Description</label><input placeholder="Brief description" value={projForm.description} onChange={e=>setProjForm({...projForm,description:e.target.value})} /></div>
                    </div>
                    <button type="submit" className="btn-submit">Assign Project</button>
                  </form>
                </div>
              )}
              <div className="card">
                <table className="data-table">
                  <thead><tr><th>Title</th><th>Assigned To</th><th>Description</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {projects.map(p => (
                      <tr key={p.id} className={p.dueDate < today && p.status !== 'completed' ? 'overdue-row' : ''}>
                        <td><strong>{p.title}</strong></td>
                        <td>{p.employee?.name || '—'}</td>
                        <td className="text-muted">{p.description || '—'}</td>
                        <td className={p.dueDate < today && p.status !== 'completed' ? 'text-red' : ''}>{p.dueDate}</td>
                        <td>
                          <select className={`status-select ${STATUS_COLORS[p.status]}`} value={p.status}
                            onChange={e => handleStatusChange(p.id, e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td><button className="act-btn delete" onClick={() => handleDeleteProj(p.id)}>Delete</button></td>
                      </tr>
                    ))}
                    {projects.length === 0 && <tr><td colSpan={6} className="empty-cell">No projects assigned yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {nav === 'messages' && (
            <div className="messages-layout">
              <div className="emp-list">
                <div className="emp-list-header"><h3>Employees</h3></div>
                {employees.map(emp => (
                  <button key={emp.id} className={`emp-list-item ${selEmp?.id === emp.id ? 'active' : ''}`}
                    onClick={() => setSelEmp(emp)}>
                    <div className="emp-avatar sm">{emp.name[0].toUpperCase()}</div>
                    <div><p className="emp-list-name">{emp.name}</p><p className="emp-list-dept">{emp.department || 'No dept'}</p></div>
                  </button>
                ))}
                {employees.length === 0 && <p className="empty-msg">No employees yet</p>}
              </div>
              <div className="chat-panel">
                {selEmp ? (
                  <>
                    <div className="chat-header">
                      <div className="emp-avatar">{selEmp.name[0].toUpperCase()}</div>
                      <div><p className="chat-name">{selEmp.name}</p><p className="chat-email">{selEmp.email}</p></div>
                    </div>
                    <div className="chat-messages">
                      {messages.length === 0 && <p className="no-messages">No messages yet. Start the conversation!</p>}
                      {messages.map(msg => (
                        <div key={msg.id} className={`msg-bubble ${msg.senderType === 'admin' ? 'msg-right' : 'msg-left'}`}>
                          <p>{msg.content}</p>
                          <span className="msg-time">{new Date(msg.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
                        </div>
                      ))}
                      <div ref={chatEnd} />
                    </div>
                    <form className="chat-input" onSubmit={handleSendMsg}>
                      <input placeholder="Type a message..." value={msgInput}
                        onChange={e => setMsgInput(e.target.value)} />
                      <button type="submit">Send</button>
                    </form>
                  </>
                ) : (
                  <div className="chat-empty"><p>👈 Select an employee to view messages</p></div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
