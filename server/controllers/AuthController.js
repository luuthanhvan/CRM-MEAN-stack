const User = require('../models/User');
const apiResponse = require('../helpers/apiResponse');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const dotenv = require('dotenv');
dotenv.config({path: '../../.env'});

class AuthController {
    login(req, res){
        let userInfo = req.body;
        try {
            User
                .findOne({username: userInfo.username, password: userInfo.password})
                .then((user) => {
                    // generate token
                    const token = jwt.sign(JSON.stringify(user._id), process.env.JWT_SECRET);

                    return apiResponse.successResponseWithData(res, 'Success', {user: user, idToken: token, expiresIn: 3600}); // expired in 1 hour
                });
        } catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    authenticate(req, res, next){
        // call for passport authentication
        passport.authenticate('local', (err, user, info) => {       
            // error from passport middleware
            if (err)
                return apiResponse.ErrorResponse(res, err);
            // registered user
            else if (user){
                return apiResponse.successResponseWithData(res, 'Success', {token: user.generateJwt()});
            }
            // unknown user or wrong password
            else 
                return apiResponse.ErrorResponse(res, info);
        })(req, res);
    }

    userProfile(req, res, next){
        try {
            User
            .findOne({ _id: req._id })
            .then((data) => {
                // remove password before sent user info to client
                let userInfo = _.pick(data, ['_id', 'name','username', 'email', 'phone', 'isAdmin', 'isActive', 'createdTime']);
                return apiResponse.successResponseWithData(res, 'Success', {user: userInfo}); 
            });
        } catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }
}

module.exports = new AuthController();