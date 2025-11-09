exports.validateProductCreate = (req, res, next) => {
  const { title, price, category_id } = req.body || {};
  if (!title || typeof price === 'undefined' || !category_id)
    return res.status(400).json({ message: 'title, price, category_id required' });
  next();
};

exports.validateProductUpdate = (req, res, next) => {
  const { price, stock } = req.body || {};
  if (typeof price !== 'undefined' && isNaN(Number(price))) return res.status(400).json({ message: 'price must be number' });
  if (typeof stock !== 'undefined' && isNaN(Number(stock))) return res.status(400).json({ message: 'stock must be number' });
  next();
};
