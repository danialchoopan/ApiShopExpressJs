const { Router } = require('express');
const ctrl = require('../controllers/category.controller');
const { auth } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/isAdmin');

const router = Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);

router.post('/', auth, isAdmin, ctrl.create);
router.put('/:id', auth, isAdmin, ctrl.update);
router.delete('/:id', auth, isAdmin, ctrl.remove);

module.exports = router;
