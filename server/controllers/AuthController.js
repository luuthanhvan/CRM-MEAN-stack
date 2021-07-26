const User = require('../models/User');
const apiResponse = require('../helpers/apiResponse');
const passport = require('passport');
const _ = require('lodash');

const dotenv = require('dotenv');
dotenv.config({path: '../../.env'});

class AuthController {
    authenticate(req, res){
        // call for passport authentication
        passport.authenticate('local', (err, user, info) => {       
            // error from passport middleware
            if (err)
                return apiResponse.validationError(res, err);
            // registered user
            else if (user){
                return apiResponse.successResponseWithData(res, 'Success', {token: user.generateJwt()});
            }
            // unknown user or wrong password
            else 
                return apiResponse.notFoundResponse(res, info);
        })(req, res);
    }

    userProfile(req, res){
        const userId = req._id;
        try {
            User
                .findOne({ _id: userId })
                .then((data) => {
                    // remove password before sent user info to client
                    let userInfo = _.pick(data, ['_id', 'name','username', 'email', 'phone', 'isAdmin', 'isActive', 'createdTime']);
                    return apiResponse.successResponseWithData(res, 'Success', {user: userInfo}); 
                });
        } catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    verifyUser(req, res, next){
        const userId = req._id;
        try{
            User
                .findOne({_id: userId})
                .then((user) => {
                    if(user){
                        req.isAdmin = user.isAdmin;
                        req.name = user.name;
                        next();
                    }
                    else{
                        return apiResponse.notFoundResponse(res, 'User not found');
                    }
                })
        } catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }
}

module.exports = new AuthController();