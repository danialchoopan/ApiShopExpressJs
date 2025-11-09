const { Router } = require('express');
const ctrl = require('../controllers/user.controller');
const { auth } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/isAdmin');

const router = Router();

// فقط ادمین: لیست کاربران
router.get('/', auth, isAdmin, ctrl.list);
router.get('/:id', auth, isAdmin, ctrl.getById);

module.exports = router;
