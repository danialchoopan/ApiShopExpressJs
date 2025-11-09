const jwt = require('jsonwebtoken');
const { User } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

exports.auth = async (req, res, next) => {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(payload.sub);
    if (!user || user.status !== 'active') return res.status(401).json({ message: 'Unauthorized' });

    req.user = { id: user.id, role: user.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
