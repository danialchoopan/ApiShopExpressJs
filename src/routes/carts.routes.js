const { Router } = require('express');
const ctrl = require('../controllers/cart.controller');
const { auth } = require('../middlewares/auth');

const router = Router();

// cart of current user
router.get('/me', auth, ctrl.getMyCart);
router.post('/me/items', auth, ctrl.addItem);
router.put('/me/items/:productId', auth, ctrl.updateItem);
router.delete('/me/items/:productId', auth, ctrl.removeItem);
router.delete('/me', auth, ctrl.clear);

module.exports = router;
