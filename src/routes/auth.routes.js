const { Router } = require('express');
const ctrl = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../validators/user.validator');
const { auth } = require('../middlewares/auth');

const router = Router();

router.post('/register', validateRegister, ctrl.register);
router.post('/login', validateLogin, ctrl.login);
router.get('/me', auth, ctrl.me);

module.exports = router;
