const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action'
      });
    }

    next();
  };
};

const isAdmin = checkRole('admin');

const isUser = checkRole(['admin', 'user']);

module.exports = {
  checkRole,
  isAdmin,
  isUser
};
