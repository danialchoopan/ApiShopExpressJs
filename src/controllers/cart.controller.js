const { Cart, CartItem, Product } = require('../models');

async function ensureActiveCart(userId) {
  let cart = await Cart.findOne({ where: { user_id: userId, status: 'active' } });
  if (!cart) cart = await Cart.create({ user_id: userId, status: 'active' });
  return cart;
}

exports.getMyCart = async (req, res, next) => {
  try {
    const cart = await ensureActiveCart(req.user.id);
    const items = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [{ model: Product, attributes: ['id','title','price','stock','slug'] }]
    });
    const total = items.reduce((s, it) => s + it.quantity * it.unit_price, 0);
    res.json({ cart_id: cart.id, total, items });
  } catch (e) { next(e); }
};

exports.addItem = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const product = await Product.findByPk(product_id);
    if (!product || product.status !== 'active') return res.status(404).json({ message: 'Product not available' });

    const cart = await ensureActiveCart(req.user.id);
    const [item, created] = await CartItem.findOrCreate({
      where: { cart_id: cart.id, product_id },
      defaults: { quantity, unit_price: product.price }
    });
    if (!created) {
      item.quantity += Number(quantity);
      await item.save();
    }
    res.status(201).json(item);
  } catch (e) { next(e); }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be >= 1' });

    const cart = await ensureActiveCart(req.user.id);
    const item = await CartItem.findOne({ where: { cart_id: cart.id, product_id: productId } });
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = Number(quantity);
    await item.save();
    res.json(item);
  } catch (e) { next(e); }
};

exports.removeItem = async (req, res, next) => {
  try {
    const cart = await ensureActiveCart(req.user.id);
    const item = await CartItem.findOne({ where: { cart_id: cart.id, product_id: req.params.productId } });
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });
    await item.destroy();
    res.status(204).end();
  } catch (e) { next(e); }
};

exports.clear = async (req, res, next) => {
  try {
    const cart = await ensureActiveCart(req.user.id);
    await CartItem.destroy({ where: { cart_id: cart.id } });
    res.status(204).end();
  } catch (e) { next(e); }
};
