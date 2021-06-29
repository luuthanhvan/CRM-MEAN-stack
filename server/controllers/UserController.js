const User = require('../models/User');
const  { mutipleMongooseToObject } = require('../helpers/mongoose');
const apiResponse = require('../helpers/apiResponse');

/* 
UserController contains function handlers to handle request from User management page.
It will recieve the data from client, send to its model and vice versa. 
This model will interact with database to store or update data.
*/

class UserController {
    // [POST] /user_management - function to store a user
    userStore(req, res){
        try{
            let userInfo = req.body;
            const user = new User(userInfo);

            user
                .save()
                .then(() => {
                    return apiResponse.successResponse(res, 'Add user successfully');
                });

        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [GET] /user_management - function to get list of user
    userList(req, res){
        try{
            User
                .find({})
                .then((users) => {
                    if(users.length > 0)
                        return apiResponse.successResponseWithData(res, 'Success', {users: mutipleMongooseToObject(users)});
                    else
                        return apiResponse.successResponseWithData(res, 'Success', {users:[]});
                });

        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [GET] /user_management/:id - function to get a user
    userDetail(req, res){
        let userId = req.params.id;
        try{
            User
                .findOne({ _id: userId })
                .then((user) => {
                    return apiResponse.successResponseWithData(res, 'Success', { user: user });
                });
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [PUT] /user_management/:id - function to update a user
    userUpdate(req, res){
        try{
            let userId = req.params.id;
            let userInfo = req.body;
            User
                .updateOne({ _id: userId }, userInfo)
                .then(() => {
                    return apiResponse.successResponse(res, 'Update user successfully');
                });
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [POST] /user_management/:id - function to change user's password
    changePassword(req, res){
        try{
            let userId = req.params.id,
                newPass = req.body.newPass;

            User
                .findByIdAndUpdate({_id : userId}, {password : newPass})
                .then(() => {
                    return apiResponse.successResponse(res, 'Change password successfully');
                });

        } catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }
}

module.exports = new UserController();