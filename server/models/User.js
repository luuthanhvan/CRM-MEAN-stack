const mg = require('mongoose');

const Schema = mg.Schema;

const User = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    createdTime: { type: Date, default: new Date() },
});

module.exports = mg.model('User', User);