const mg = require('mongoose');

const Schema = mg.Schema;

const User = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true },
    createdTime: { type: Date, default: Date.now().toLocaleString() },
});

module.exports = mg.model('User', User);