const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Admin, Employee } = require('../models');

const tokens = new Map();

const generateToken = () => crypto.randomBytes(32).toString('hex');

const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await Admin.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    await Admin.create({ name, email, password: hashed });
    res.status(201).json({ message: 'Admin registered successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });
    const token = generateToken();
    tokens.set(token, { id: admin.id, name: admin.name, email: admin.email, role: 'admin' });
    res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ where: { email } });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    if (!employee.isActive) return res.status(403).json({ message: 'Account deactivated. Contact admin.' });
    const match = await bcrypt.compare(password, employee.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });
    const token = generateToken();
    tokens.set(token, { id: employee.id, name: employee.name, email: employee.email, role: 'employee' });
    res.json({ token, user: { id: employee.id, name: employee.name, email: employee.email, role: 'employee' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logout = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) tokens.delete(token);
  res.json({ message: 'Logged out' });
};

const getMe = (req, res) => {
  res.json({ user: req.user });
};

module.exports = { adminRegister, adminLogin, employeeLogin, logout, getMe, tokens };
