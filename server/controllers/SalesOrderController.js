const SalesOrder = require('../models/SalesOrder');
const  { mutipleMongooseToObject } = require('../helpers/mongoose');
const apiResponse = require('../helpers/apiResponse');

/* 
SalesOrderController contains function handlers to handle request from Sales order page.
It will recieve the data from client, send to its model and vice versa. 
This model will interact with database to store or update data.
*/
class SalesOrderController {
    // [POST] /sales_order - function to store a sale order information
    storeSalesOrder(req, res){
        setTimeout(() => {
            try{
                const saleOrder = new SalesOrder(req.body);
                saleOrder
                    .save()
                    .then(() => {
                        return apiResponse.successResponse(res, 'Add sale order successfully');
                    });
    
            }catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }

    // [POST] /sales_order/list - function to get a list of sales order information
    getListOfSalesOrders(req, res){
        const isAdmin = req.body.isAdmin,
            assignedTo = req.body.assignedTo;
        try{
            if(!isAdmin){
                SalesOrder
                    .find({assignedTo : assignedTo})
                    .then((salesOrder) => {
                        if(salesOrder.length > 0)
                            return apiResponse.successResponseWithData(res, 'Success', {salesOrder: mutipleMongooseToObject(salesOrder)});
                        else
                            return apiResponses.successResponseWithData(res, 'Success', []);
                    });
            }
            else{
                SalesOrder
                    .find({})
                    .then((salesOrder) => {
                        if(salesOrder.length > 0)
                            return apiResponse.successResponseWithData(res, 'Success', {salesOrder: mutipleMongooseToObject(salesOrder)});
                        else
                            return apiResponses.successResponseWithData(res, 'Success', []);
                    });
            }
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [GET] /sales_order/:id - function to get a sale order information by sale order ID
    getSalesOrder(req, res){
        let saleOrderId = req.params.id;
        try{
            SalesOrder
                .findOne({ _id: saleOrderId })
                .then((saleOrder) => {
                    return apiResponse.successResponseWithData(res, 'Success', { saleOrder: saleOrder });
                });
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [PUT] /sales_order/:id - function to update a sale order information by sale order ID
    updateSalesOrder(req, res){
        let saleOrderId = req.params.id;
        let saleOrderInfo = req.body;
        setTimeout(() => {
            try{
                SalesOrder
                    .updateOne({ _id: saleOrderId }, saleOrderInfo)
                    .then(() => {
                        return apiResponse.successResponse(res, 'Update sale order successfully');
                    });
            } catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }

    // [DELETE] /sales_order/:id - function to delete a sale order information by sale order ID
    deleteSalesOrder(req, res){
        let saleOrderId = req.params.id;
        setTimeout(() => {
            try{
                SalesOrder
                    .remove({ _id: saleOrderId })
                    .then(() => {
                        return apiResponse.successResponse(res, 'Delete sale order successfully');
                    });
    
            } catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }

    // [POST] /delete - function to delete multi sales orders information by list of sales orders ID
    deleteMultiSalesOrders(req, res){
        let salesOrderIds = req.body;
        setTimeout(() => {
            try{
                SalesOrder
                    .remove({ _id: { $in : salesOrderIds } })
                    .then(() => {
                        return apiResponse.successResponse(res, 'Delete sales orders successfully');
                    });
    
            } catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }

    // [GET] /search/:salesOrder - function to find sales orders by subject
    findSalesOrder(req, res){
        let contactName = req.params.contactName;
        try {
            SalesOrder
                .find({ contactName : contactName })
                .then((salesOrder) => {
                    return apiResponse.successResponseWithData(res, 'Success', { salesOrder: salesOrder });
                })
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }
}

module.exports = new SalesOrderController();