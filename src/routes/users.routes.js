const { Router } = require('express');
const ctrl = require('../controllers/user.controller');
const { auth } = require('../middlewares/auth');
const { isSuperAdmin } = require('../middlewares/isAdmin');

const router = Router();

router.get('/', auth, isSuperAdmin, ctrl.list);
router.get('/:id', auth, isSuperAdmin, ctrl.getById);
router.put('/:id', auth, isSuperAdmin, ctrl.update);
router.delete('/:id', auth, isSuperAdmin, ctrl.remove);

module.exports = router;
