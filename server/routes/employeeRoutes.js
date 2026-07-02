const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllEmployees, createEmployee, toggleStatus, deleteEmployee } = require('../controllers/employeeController');

router.get('/',              auth('admin'), getAllEmployees);
router.post('/',             auth('admin'), createEmployee);
router.patch('/:id/toggle',  auth('admin'), toggleStatus);
router.delete('/:id',        auth('admin'), deleteEmployee);

module.exports = router;
