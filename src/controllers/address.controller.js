const { Address } = require('../models');

exports.listMyAddresses = async (req, res, next) => {
  try {
    const items = await Address.findAll({ where: { user_id: req.user.id }, order: [['id', 'DESC']] });
    res.json(items);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { label, full_name, phone, line1, line2, city, province, postal_code, country, is_default_shipping, is_default_billing } = req.body;

    if (is_default_shipping) {
      await Address.update({ is_default_shipping: false }, { where: { user_id: req.user.id } });
    }
    if (is_default_billing) {
      await Address.update({ is_default_billing: false }, { where: { user_id: req.user.id } });
    }

    const item = await Address.create({
      user_id: req.user.id,
      label, full_name, phone, line1, line2, city, province, postal_code, country,
      is_default_shipping: !!is_default_shipping,
      is_default_billing: !!is_default_billing
    });
    res.status(201).json(item);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Address.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Address not found' });

    const fields = ['label', 'full_name', 'phone', 'line1', 'line2', 'city', 'province', 'postal_code', 'country', 'is_default_shipping', 'is_default_billing'];

    if (req.body.is_default_shipping) {
      await Address.update({ is_default_shipping: false }, { where: { user_id: req.user.id } });
    }
    if (req.body.is_default_billing) {
      await Address.update({ is_default_billing: false }, { where: { user_id: req.user.id } });
    }

    for (const f of fields) if (typeof req.body[f] !== 'undefined') item[f] = req.body[f];
    await item.save();
    res.json(item);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Address.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Address not found' });
    await item.destroy();
    res.status(204).end();
  } catch (e) { next(e); }
};
