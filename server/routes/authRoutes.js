const express = require('express');
const router = express.Router();
const { adminRegister, adminLogin, employeeLogin, logout, getMe } = require('../controllers/authController');

router.post('/admin/register', adminRegister);
router.post('/admin/login', adminLogin);
router.post('/employee/login', employeeLogin);
router.post('/logout', logout);
router.get('/me', getMe);

module.exports = router;
