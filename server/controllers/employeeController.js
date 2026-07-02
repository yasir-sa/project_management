const bcrypt = require('bcryptjs');
const { Employee } = require('../models');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({ attributes: { exclude: ['password'] } });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { name, email, password, phone, department } = req.body;
    const exists = await Employee.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const employee = await Employee.create({ name, email, password: hashed, phone, department });
    const { password: _, ...data } = employee.toJSON();
    res.status(201).json({ message: 'Employee created!', data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Not found' });
    employee.isActive = !employee.isActive;
    await employee.save();
    res.json({ message: `Employee ${employee.isActive ? 'activated' : 'deactivated'}!`, isActive: employee.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    await Employee.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Employee removed!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllEmployees, createEmployee, toggleStatus, deleteEmployee };
