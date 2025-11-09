const { sequelize, Order, OrderItem, Cart, CartItem, Product, Address } = require('../models');

exports.listMyOrders = async (req, res, next) => {
  try {
    const items = await Order.findAll({ where: { user_id: req.user.id }, order: [['id','DESC']] });
    res.json(items);
  } catch (e) { next(e); }
};

exports.createFromCart = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { shipping_address_id, billing_address_id } = req.body;
    const cart = await Cart.findOne({ where: { user_id: req.user.id, status: 'active' } });
    if (!cart) return res.status(400).json({ message: 'No active cart' });

    const items = await CartItem.findAll({ where: { cart_id: cart.id }, include: [Product], transaction: t });
    if (!items.length) return res.status(400).json({ message: 'Cart is empty' });

    const subtotal = items.reduce((s, it) => s + it.quantity * it.unit_price, 0);
    const shipping_cost = 0;
    const discount_total = 0;
    const total = subtotal + shipping_cost - discount_total;

    const order = await Order.create({
      user_id: req.user.id,
      order_number: `ORD-${Date.now()}`,
      subtotal, shipping_cost, discount_total, total,
      payment_status: 'unpaid',
      status: 'pending',
      shipping_address_id: shipping_address_id || null,
      billing_address_id: billing_address_id || null,
      placed_at: new Date(),
    }, { transaction: t });

    const orderItems = items.map(it => ({
      order_id: order.id,
      product_id: it.product_id,
      title_snapshot: it.Product?.title,
      sku_snapshot: it.Product?.sku,
      unit_price: it.unit_price,
      quantity: it.quantity,
      line_total: it.quantity * it.unit_price
    }));
    await OrderItem.bulkCreate(orderItems, { transaction: t });

    // close cart
    cart.status = 'converted';
    await cart.save({ transaction: t });
    await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });

    await t.commit();
    res.status(201).json(order);
  } catch (e) {
    await t.rollback();
    next(e);
  }
};

// Admin
exports.listAll = async (req, res, next) => {
  try {
    const items = await Order.findAll({ order: [['id','DESC']] });
    res.json(items);
  } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: [OrderItem] });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (e) { next(e); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status, payment_status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (status) order.status = status;
    if (payment_status) order.payment_status = payment_status;
    await order.save();
    res.json(order);
  } catch (e) { next(e); }
};
