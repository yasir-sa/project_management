const auth = (role) => (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Please login first' });
  if (role && req.session.user.role !== role) return res.status(403).json({ message: 'Access denied' });
  next();
};

module.exports = auth;
