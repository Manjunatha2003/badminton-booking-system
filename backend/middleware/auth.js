const authenticateAdmin = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];

  if (!userId || userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  req.user = { id: userId, role: userRole };
  next();
};

module.exports = { authenticateAdmin };