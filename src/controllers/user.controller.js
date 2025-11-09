const { User } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const items = await User.findAll({ attributes: ['id','full_name','email','role','status','createdAt'] });
    res.json(items);
  } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: ['id','full_name','email','role','status','createdAt'] });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) { next(e); }
};
