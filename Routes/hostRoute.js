const express = require('express');
const hostController = require('../Controller/host');
const router = express.Router();



router.get('/host/', hostController.getHost);
router.get('/host/:id', hostController.getHostById); 

router.post('/host', hostController.postHost);
router.post('/host/login', hostController.loginHost);

router.put('/host/:id', hostController.updateHost);
router.put('/host/prebook/:id', hostController.prebook);


router.delete('/host/:id', hostController.deleteHost);
module.exports = router;
