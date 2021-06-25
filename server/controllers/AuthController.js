const User = require('../models/User');
const  { mutipleMongooseToObject } = require('../helpers/mongoose');
const apiResponse = require('../helpers/apiResponse');

class AuthController {
    getUser(req, res){
        let userInfo = req.body;

        try {
            User
                .find({username: userInfo.username, password: userInfo.password})
                .then((user) => {
                    console.log(user);
                    if(user.length > 0){
                        return apiResponse.successResponseWithData(res, 'Success', {userId: user[0]._id});
                    }
                    else {
                        return apiResponse.successResponseWithData(res, 'Success', {userId: ''});
                    }
                });
        } catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }
}

module.exports = new AuthController();