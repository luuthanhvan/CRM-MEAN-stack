const User = require("../models/User");
const apiResponse = require("../helpers/apiResponse");
const _ = require("lodash");

/* 
UserController contains function handlers to handle request from User management page.
It will recieve the data from client, send to its model and vice versa. 
This model will interact with database to store or update data.
*/

class UserController {
  // [POST] /user_management/create - function to create a new user
  createNewUser(req, res) {
    try {
      const userInfo = {
        isAdmin: true,
        isActive: true,
        name: "Admin",
        username: "admin",
        password: "123456",
        email: "admin@gmail.com",
        phone: "0123456789",
      };
      const user = new User(userInfo);
      user.save().then(() => {
        console.log("Create user successfully");
        return res.status(200).send("Create user successfully!");
      });
    } catch (err) {
      console.log("ERROR: ", err);
      return res.status(500).send("Oop! Something wrong!");
    }
  }

  // [POST] /user_management - function to store a user
  storeUser(req, res) {
    setTimeout(() => {
      try {
        let userInfo = req.body;
        const user = new User(userInfo);

        user.save().then(() => {
          return apiResponse.successResponse(res, "Add user successfully");
        });
      } catch (err) {
        return apiResponse.ErrorResponse(res, err);
      }
    }, 1000);
  }

  // [POST] /user_management/list - function to get list of user
  getListOfUsers(req, res) {
    try {
      const isAdmin = req.isAdmin,
        userId = req._id;
      if (!isAdmin) {
        User.findOne({ _id: userId }).then((data) => {
          return apiResponse.successResponseWithData(res, "Success", {
            user: data,
          });
        });
      } else {
        User.find({}).then((data) => {
          return apiResponse.successResponseWithData(res, "Success", {
            users: data,
          });
        });
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  }

  // [GET] /user_management/:id - function to get a user
  getUser(req, res) {
    let userId = req.params.id;
    try {
      User.findOne({ _id: userId }).then((data) => {
        return apiResponse.successResponseWithData(res, "Success", {
          user: data,
        });
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  }

  // [PUT] /user_management/:id - function to update a user
  updateUser(req, res) {
    setTimeout(() => {
      try {
        let userId = req.params.id;
        let userInfo = req.body;
        User.updateOne({ _id: userId }, userInfo).then(() => {
          return apiResponse.successResponse(res, "Update user successfully");
        });
      } catch (err) {
        return apiResponse.ErrorResponse(res, err);
      }
    }, 1000);
  }

  // [POST] /user_management/:id - function to change user's password
  changePassword(req, res) {
    setTimeout(() => {
      try {
        let userId = req.params.id,
          newPass = req.body.newPass;

        User.findByIdAndUpdate({ _id: userId }, { password: newPass }).then(
          () => {
            return apiResponse.successResponse(
              res,
              "Change password successfully"
            );
          }
        );
      } catch (err) {
        return apiResponse.ErrorResponse(res, err);
      }
    }, 1000);
  }
}

module.exports = new UserController();
