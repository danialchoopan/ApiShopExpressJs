exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'sales_manager') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

exports.isSuperAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Only super admin can perform this action' });
  }
  next();
};
