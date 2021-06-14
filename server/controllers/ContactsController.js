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
                        return apiResponse.successResponseWithData(res, 'Success', {contacts:[]});
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

    // [POST] /contacts/edit
    edit(req, res){
        try{
            Contacts
                .findOne({ _id: req.body.id })
                .then((contact) => {
                    return apiResponse.successResponseWithData(res, 'Success', { contact: contact });
                });
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [PUT] /contacts/update
    update(req, res){
        try{
            Contacts
                .updateOne({ _id: req.body.contactId }, req.body.contactInfo)
                .then(() => {
                    return apiResponse.successResponse(res, 'Update contact successfully');
                });
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [DELETE] /contacts/delete
    destroy(req, res){
        try{
            Contacts
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