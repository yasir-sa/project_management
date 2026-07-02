const { Project, Employee } = require('../models');

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{ model: Employee, as: 'employee', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEmployeeProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { employeeId: req.params.employeeId },
      order: [['dueDate', 'ASC']],
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, dueDate, employeeId } = req.body;
    const project = await Project.create({ title, description, dueDate, employeeId });
    res.status(201).json({ message: 'Project assigned!', data: project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    project.status = req.body.status;
    await project.save();
    res.json({ message: 'Status updated!', data: project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await Project.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Project deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllProjects, getEmployeeProjects, createProject, updateStatus, deleteProject };
