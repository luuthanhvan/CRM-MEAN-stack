const mg = require('mongoose');

const Schema = mg.Schema;

const Contacts = new Schema(
    {
        contactName : { type: String, required: true },
        salutation: { type: String, required: true },
        mobilePhone: { type: String, required: true },
        email: { type: String, required: true },
        organization: { type: String, required: false },
        dob: { type: String, required: false },
        leadSrc: { type: String, required: true },
        assignedTo: { type: String, ref: 'Users', required: true },
        creator: { type: String, ref: 'Users', required: true },
        address: { type: String, required: false },
        description: { type: String, required: false },
        createdTime: { type: String, default: Date.now },
        updatedTime: { type: String, default: Date.now },
    },
);

module.exports = mg.model('Contacts', Contacts);