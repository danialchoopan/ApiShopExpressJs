const { Category, User } = require('../models');
const { makeSlug } = require('../utils/slugify');

exports.list = async (req, res, next) => {
  try {
    const items = await Category.findAll({
      where: { parent_id: null },
      include: [{ model: Category, as: 'children' }],
      order: [['id', 'ASC']]
    });
    res.json(items);
  } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await Category.findByPk(req.params.id, {
        include: [{ model: Category, as: 'children' }]
    });
    if (!item) return res.status(404).json({ message: 'Category not found' });
    res.json(item);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, parent_id } = req.body;
    const slug = makeSlug(name);
    const item = await Category.create({ name, slug, parent_id: parent_id || null, created_by_user_id: req.user.id });
    res.status(201).json(item);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const { name, parent_id } = req.body;
    const item = await Category.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Category not found' });
    if (name) item.name = name, item.slug = makeSlug(name);
    if (typeof parent_id !== 'undefined') item.parent_id = parent_id;
    await item.save();
    res.json(item);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Category.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Category not found' });
    await item.destroy();
    res.status(204).end();
  } catch (e) { next(e); }
};
