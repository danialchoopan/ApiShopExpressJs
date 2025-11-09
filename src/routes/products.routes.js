const { Router } = require('express');
const ctrl = require('../controllers/product.controller');
const { auth } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/isAdmin');
const { validateProductCreate, validateProductUpdate } = require('../validators/product.validator');

const router = Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);

router.post('/', auth, isAdmin, validateProductCreate, ctrl.create);
router.put('/:id', auth, isAdmin, validateProductUpdate, ctrl.update);
router.delete('/:id', auth, isAdmin, ctrl.remove);

module.exports = router;
