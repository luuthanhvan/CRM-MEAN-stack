const express = require('express');
const router = express.Router();

const salesOrderController = require('../controllers/SalesOrderController');

router.post('/', salesOrderController.salesOrderStore); // store a sale order
router.get('/', salesOrderController.salesOrderList); // get list of sales order
router.get('/:id', salesOrderController.salesOrderDetail); // get a sale order
router.put('/:id', salesOrderController.salesOrderUpdate); // update a sale order
router.delete('/:id', salesOrderController.salesOrderDelete); // delete a sale order
router.post('/delete', salesOrderController.salesOrderMultiDelete); // delete multi sales orders

module.exports = router;