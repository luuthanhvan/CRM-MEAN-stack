const mg = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path: '../../.env'});

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

// Methods
User.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP });
}

module.exports = mg.model('User', User);