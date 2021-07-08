const Contacts = require('../models/Contacts');
const User = require('../models/User');
const  { mutipleMongooseToObject } = require('../helpers/mongoose');
const apiResponse = require('../helpers/apiResponse');

/* 
ContactsController contains function handlers to handle request from Contacts page.
It will recieve the data from client, send to its model and vice versa. 
This model will interact with database to store or update data.
*/
class ContactsController {
    // [POST] /contacts - function to store a contact information
    contactsStore(req, res){
        setTimeout(() => {
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
        }, 
        1000)
    }
    
    // [GET] /contacts - function to get a list of contacts information
    contactsList(req, res){
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

    // [GET] /contacts/:id - function to get a contact information by contact ID
    contactsDetail(req, res){
        let contactId = req.params.id;
        try{
            Contacts
                .findOne({ _id: contactId })
                .then((contact) => {
                    return apiResponse.successResponseWithData(res, 'Success', { contact: contact });
                });
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [PUT] /contacts/:id - function to update a contact information by contact ID
    contactsUpdate(req, res){
        let contactId = req.params.id;
        let contactInfo = req.body;
        try{
            Contacts
                .updateOne({ _id: contactId }, contactInfo)
                .then(() => {
                    return apiResponse.successResponse(res, 'Update contact successfully');
                });
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [DELETE] /contacts/:id - function to delete a contact information by contact ID
    contactsDelete(req, res){
        let contactId = req.params.id;
        try{
            Contacts
                .remove({ _id: contactId })
                .then(() => {
                    return apiResponse.successResponse(res, 'Delete contact successfully');
                });

        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }
}

module.exports = new ContactsController();