const { Router } = require('express');
const ctrl = require('../controllers/order.controller');
const { auth } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/isAdmin');

const router = Router();

router.get('/me', auth, ctrl.listMyOrders);
router.post('/from-cart', auth, ctrl.createFromCart);

// admin ops
router.get('/stats', auth, isAdmin, ctrl.getStats);
router.get('/', auth, isAdmin, ctrl.listAll);
router.get('/:id', auth, isAdmin, ctrl.getById);
router.patch('/:id/status', auth, isAdmin, ctrl.updateStatus);

module.exports = router;
