const Contacts = require('../models/Contacts');
const  { mutipleMongooseToObject } = require('../helpers/mongoose');
const apiResponse = require('../helpers/apiResponse');

class ContactsController {
    // [GET] /contacts
    index(req, res){
        try{
            Contacts
                .find({})
                .then((contacts) => {
                    if(contacts.length > 0)
                        return apiResponse.successResponseWithData(res, 'Success', {contacts: mutipleMongooseToObject(contacts)});
                    else
                        return apiResponses.successResponseWithData(res, 'Success', []);
                });

        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [POST] /contacts/store
    store(req, res){
        try{
            const contacts = new Contacts(req.body);
            contacts
                .save()
                .then(() => {
                    return apiResponse.successResponse(res, 'Add contact successfully');
                });

        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [GET] /contacts/edit

    // [PUT] /contacts/update

    // [DELETE] /contacts/delete
    destroy(req, res){
        try{
            contacts
                .remove({ _id: req.body.id })
                .then(() => {
                    return apiResponse.successResponse(res, 'Delete contact successfully');
                });

        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }
}

module.exports = new ContactsController();