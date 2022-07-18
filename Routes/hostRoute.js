const express = require('express');
const hostController = require('../Controller/host');
const router = express.Router();



router.get('/host/', hostController.getHost);
router.get('/host/:id', hostController.getHostById); 

router.post('/host', hostController.postHost);

router.put('/host/:id', hostController.updateHost);

router.delete('/host/:id', hostController.deleteHost);
module.exports = router;
