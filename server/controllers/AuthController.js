const User = require('../models/User');
const apiResponse = require('../helpers/apiResponse');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path: '../../.env'});

class AuthController {
    getUser(req, res){
        let userInfo = req.body;
        try {
            User
                .findOne({username: userInfo.username, password: userInfo.password})
                .then((user) => {
                    // generate token
                    const token = jwt.sign(JSON.stringify(user._id), process.env.JWT_SECRET);

                    return apiResponse.successResponseWithData(res, 'Success', {user: user, idToken: token, expiresIn: 120});
                });
        } catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }
}

module.exports = new AuthController();