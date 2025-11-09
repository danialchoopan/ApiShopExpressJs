exports.validateRegister = (req, res, next) => {
  const { full_name, email, password } = req.body || {};
  if (!full_name || !email || !password) return res.status(400).json({ message: 'full_name, email, password required' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Invalid email' });
  if (String(password).length < 6) return res.status(400).json({ message: 'Password min 6 chars' });
  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email, password required' });
  next();
};
