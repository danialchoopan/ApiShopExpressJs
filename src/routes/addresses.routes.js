const { Router } = require('express');
const ctrl = require('../controllers/address.controller');
const { auth } = require('../middlewares/auth');

const router = Router();

router.get('/', auth, ctrl.listMyAddresses);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
