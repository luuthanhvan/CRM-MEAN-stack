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
    salesOrderStore(req, res){
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
    }

    // [GET] /sales_order - function to get a list of sales order information
    salesOrderList(req, res){
        try{
            SalesOrder
                .find({})
                .then((salesOrder) => {
                    if(salesOrder.length > 0)
                        return apiResponse.successResponseWithData(res, 'Success', {salesOrder: mutipleMongooseToObject(salesOrder)});
                    else
                        return apiResponses.successResponseWithData(res, 'Success', []);
                });

        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [GET] /sales_order/:id - function to get a sale order information by sale order ID
    salesOrderDetail(req, res){
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
    salesOrderUpdate(req, res){
        let saleOrderId = req.params.id;
        let saleOrderInfo = req.body;
        try{
            SalesOrder
                .updateOne({ _id: saleOrderId }, saleOrderInfo)
                .then(() => {
                    return apiResponse.successResponse(res, 'Update sale order successfully');
                });
        } catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [DELETE] /sales_order/:id - function to delete a sale order information by sale order ID
    salesOrderDelete(req, res){
        let saleOrderId = req.params.id;
        try{
            SalesOrder
                .remove({ _id: saleOrderId })
                .then(() => {
                    return apiResponse.successResponse(res, 'Delete sale order successfully');
                });

        } catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }
}

module.exports = new SalesOrderController();