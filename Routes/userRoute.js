const express = require('express');
const UserController = require('../Controller/user');
const router = express.Router();



router.get('/user/', UserController.getUser);
router.get('/user/:id', UserController.getUserById); 

router.post('/order', UserController.createOrder);
router.post('/user/login', UserController.loginUser);
router.post('/user/register', UserController.postSignup);

router.put('/user/:id', UserController.updateUser);
router.put('/user/add-balance/:id', UserController.updateUserBalance);

router.delete('/user/:id', UserController.deleteUser);

module.exports = router;