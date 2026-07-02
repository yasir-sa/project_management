const { tokens } = require('../controllers/authController');

const auth = (role) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || !tokens.has(token)) return res.status(401).json({ message: 'Please login first' });
  const user = tokens.get(token);
  if (role && user.role !== role) return res.status(403).json({ message: 'Access denied' });
  req.user = user;
  next();
};

module.exports = auth;
