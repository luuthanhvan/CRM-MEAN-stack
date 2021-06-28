const User = require('../models/User');
const apiResponse = require('../helpers/apiResponse');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path: '../../.env'});

class AuthController {
    getUser(req, res){
        let userInfo = req.body;

        // generate token
        const payload = JSON.stringify(userInfo);
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        try {
            User
                .findOne({username: userInfo.username, password: userInfo.password})
                .then((user) => {
                    return apiResponse.successResponseWithData(res, 'Success', {user: user, token: token});
                });
        } catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }
}

module.exports = new AuthController();