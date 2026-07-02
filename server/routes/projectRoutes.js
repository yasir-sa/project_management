const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllProjects, getEmployeeProjects, createProject, updateStatus, deleteProject } = require('../controllers/projectController');

router.get('/',                       auth('admin'), getAllProjects);
router.get('/employee/:employeeId',   auth(),        getEmployeeProjects);
router.post('/',                      auth('admin'), createProject);
router.patch('/:id/status',           auth(),        updateStatus);
router.delete('/:id',                 auth('admin'), deleteProject);

module.exports = router;
