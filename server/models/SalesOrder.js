const mg = require('mongoose');

const Schema = mg.Schema;

const SalesOrder = new Schema(
    {
        subject: { type: String, required: true },
        contactName : { type: String, required: true },
        status: { type: String, required: true },
        total: { type: String, required: true },
        assignedTo: { type: String, required: true },
        description: { type: String, required: false },
        createdTime: { type: String, default: Date.now },
        updatedTime: { type: String, default: Date.now },
    },
);

module.exports = mg.model('SalesOrder', SalesOrder);