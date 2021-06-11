const SalesOrder = require('../models/SalesOrder');
const  { mutipleMongooseToObject } = require('../helpers/mongoose');
const apiResponse = require('../helpers/apiResponse');

class SalesOrderController {
    // [GET] /sales_order
    index(req, res){
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

    // [POST] /sales_order/store
    store(req, res){
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

    // [POST] /sales_order/edit
    edit(req, res){
        try{
            SalesOrder
                .findOne({ _id: req.body.id })
                .then((saleOrder) => {
                    return apiResponse.successResponseWithData(res, 'Success', { saleOrder: saleOrder });
                });
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [PUT] /sales_order/update
    update(req, res){
        try{
            SalesOrder
                .updateOne({ _id: req.body.saleOrderId }, res.body.saleOrderInfo)
                .then(() => {
                    return apiResponse.successResponse(res, 'Update sale order successfully');
                });
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [DELETE] /sales_order/delete
    destroy(req, res){
        try{
            SalesOrder
                .remove({ _id: req.body.id })
                .then(() => {
                    return apiResponse.successResponse(res, 'Delete sale order successfully');
                });

        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }
}

module.exports = new SalesOrderController();