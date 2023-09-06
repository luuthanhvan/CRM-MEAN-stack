const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');
const jwtHelper = require('../config/jwtHelper');

router.post('/', userController.storeUser); // add a user
router.get('/create', userController.createNewUser); // create a user
router.post('/list', jwtHelper.verifyJwtToken, authController.verifyUser, userController.getListOfUsers);  // get list of users
router.get('/:id', userController.getUser); // get a user
router.put('/:id', userController.updateUser); // update a user 
router.post('/:id', userController.changePassword); // change password of a user

module.exports = router;