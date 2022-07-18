const express = require("express");
const payment = require("./../Controller/payment");

let router = express.Router();

router.post('/payment', payment.postPayment);

router.get('/payment/:id', payment.getPaymentByHostId);

module.exports = router;