const express = require('express');
const UserController = require('../Controller/admin');
const router = express.Router();


router.post('/admin/login', UserController.loginUser);
router.post('/admin/register', UserController.postSignup);



module.exports = router;