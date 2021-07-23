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
    storeContact(req, res){
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
        }, 1000);
    }

    // [POST] /contacts/list - function to get a list of contacts information
    getListOfContacts(req, res){
        try{
            const isAdmin = req.isAdmin,
                assignedTo = req.assignedTo;
            if(!isAdmin){
                Contacts
                    .find({assignedTo : assignedTo})
                    .then((contacts) => {
                        if(contacts.length > 0)
                            return apiResponse.successResponseWithData(res, 'Success', {contacts: mutipleMongooseToObject(contacts)});
                        else
                            return apiResponse.successResponseWithData(res, 'Success', {contacts:[]});
                    });
            }
            else {
                Contacts
                    .find({})
                    .then((contacts) => {
                        if(contacts.length > 0)
                            return apiResponse.successResponseWithData(res, 'Success', {contacts: mutipleMongooseToObject(contacts)});
                        else
                            return apiResponse.successResponseWithData(res, 'Success', {contacts:[]});
                    });
            }
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [GET] /contacts/:id - function to get a contact information by contact ID
    getContact(req, res){
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
    updateContact(req, res){
        let contactId = req.params.id;
        let contactInfo = req.body;
        setTimeout(() => {
            try{
                Contacts
                    .updateOne({ _id: contactId }, contactInfo)
                    .then(() => {
                        return apiResponse.successResponse(res, 'Update contact successfully');
                    });
            }catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }

    // [DELETE] /contacts/:id - function to delete a contact information by contact ID
    deleteContact(req, res){
        let contactId = req.params.id;
        setTimeout(() => {
            try{
                Contacts
                    .remove({ _id: contactId })
                    .then(() => {
                        return apiResponse.successResponse(res, 'Delete contact successfully');
                    });
    
            }catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }

    // [POST] /delete - function to delete multi contacts information by list of contact ID
    multiDeleteContact(req, res){
        let contactIds = req.body;
        setTimeout(() => {
            try{
                Contacts
                    .remove({ _id: { $in : contactIds }})
                    .then(() => {
                        return apiResponse.successResponse(res, 'Delete list of contacts successfully');
                    })
            }catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }

    // [GET] /search/:contactName - function to find contacts by contact name
    findContact(req, res){
        let contactName = req.params.contactName;
        try {
            Contacts
                .find({ contactName : contactName })
                .then((contacts) => {
                    return apiResponse.successResponseWithData(res, 'Success', { contacts: contacts });
                })
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }
}

module.exports = new ContactsController();