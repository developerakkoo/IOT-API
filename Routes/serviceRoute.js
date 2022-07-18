const express = require('express');
const router = express.Router();

const serviceController = require('../Controller/service');



router.post('/service', serviceController.postService);
router.post('/login/service', serviceController.loginService);

router.get('/service', serviceController.getService);
router.get('/service/:id', serviceController.getServiceById); 

router.put('/service/:id', serviceController.updateService);

router.delete('/service/:id', serviceController.deleteService);
module.exports = router;