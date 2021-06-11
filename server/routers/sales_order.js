const express = require('express');
const router = express.Router();

const salesOrderController = require('../controllers/SalesOrderController');

router.post('/store', salesOrderController.store);
router.post('/delete', salesOrderController.destroy);
router.post('/edit', salesOrderController.edit);
router.post('/update', salesOrderController.update);
router.get('/', salesOrderController.index);

module.exports = router;