const { Product, Category, ProductImage, ProductAttribute, User } = require('../models');
const { makeSlug } = require('../utils/slugify');
const { toPagination } = require('../utils/pagination');

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category_id, status, q } = req.query;
    const where = {};
    if (category_id) where.category_id = category_id;
    if (status) where.status = status;
    if (q) {
      const { Op } = require('sequelize');
      where.title = { [Op.like]: `%${q}%` };
    }

    const { offset, perPage } = toPagination(page, limit);
    const items = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, attributes: ['id', 'name', 'slug'] },
        { model: ProductImage, attributes: ['id', 'url', 'alt', 'sort_order'] }
      ],
      order: [['id', 'DESC']],
      limit: perPage,
      offset,
      distinct: true, // important when including hasMany
    });
    res.json({ total: items.count, page: Number(page), limit: perPage, data: items.rows });
  } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['id', 'name', 'slug'] },
        { model: ProductImage, attributes: ['id', 'url', 'alt', 'sort_order'] },
        { model: ProductAttribute, as: 'attributes', attributes: ['id', 'name', 'value'] },
        { model: User, as: 'createdBy', attributes: ['id', 'full_name'] },
        { model: User, as: 'updatedBy', attributes: ['id', 'full_name'] },
      ]
    });
    if (!item) return res.status(404).json({ message: 'Product not found' });
    res.json(item);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { title, description, price, stock, sku, status, category_id, images = [], attributes = [] } = req.body;
    const product = await Product.create({
      title, slug: makeSlug(title), description, price, stock, sku, status, category_id,
      created_by_user_id: req.user.id
    });
    if (images.length) {
      const imgs = images.map((x, i) => ({ product_id: product.id, url: x.url, alt: x.alt || null, sort_order: x.sort_order ?? i }));
      await ProductImage.bulkCreate(imgs);
    }
    if (attributes.length) {
      const attrs = attributes.map(x => ({ product_id: product.id, name: x.name, value: x.value }));
      await ProductAttribute.bulkCreate(attrs);
    }
    res.status(201).json(product);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const fields = ['title', 'description', 'price', 'stock', 'sku', 'status', 'category_id'];
    for (const f of fields) if (typeof req.body[f] !== 'undefined') product[f] = req.body[f];
    if (typeof req.body.title !== 'undefined') product.slug = makeSlug(req.body.title);
    product.updated_by_user_id = req.user.id;
    await product.save();

    if (req.body.images) {
      await ProductImage.destroy({ where: { product_id: product.id } });
      const imgs = req.body.images.map((x, i) => ({ product_id: product.id, url: x.url, alt: x.alt || null, sort_order: x.sort_order ?? i }));
      await ProductImage.bulkCreate(imgs);
    }
    if (req.body.attributes) {
      await ProductAttribute.destroy({ where: { product_id: product.id } });
      const attrs = req.body.attributes.map(x => ({ product_id: product.id, name: x.name, value: x.value }));
      await ProductAttribute.bulkCreate(attrs);
    }

    res.json(product);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.status(204).end();
  } catch (e) { next(e); }
};
