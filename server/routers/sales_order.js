const express = require('express');
const router = express.Router();

const salesOrderController = require('../controllers/SalesOrderController');

router.post('/', salesOrderController.storeSalesOrder); // store a sale order
router.post('/list', salesOrderController.getListOfSalesOrders); // get list of sales order
router.get('/:id', salesOrderController.getSalesOrder); // get a sale order
router.put('/:id', salesOrderController.updateSalesOrder); // update a sale order
router.delete('/:id', salesOrderController.deleteSalesOrder); // delete a sale order
router.post('/delete', salesOrderController.deleteMultiSalesOrders); // delete multi sales orders
router.get('/search/:contactName', salesOrderController.findSalesOrder); // find sales order by contact name

module.exports = router;