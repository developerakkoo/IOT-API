const Payment = require("./../Modals/paymentModal");

const io = require("../socket");


exports.postPayment = async(req, res, next) =>{
    try {
        let payment = await Payment.create(req.body);
        if(payment){
            res.status(200)
            .json({
                payment,
                message: "Payment Created!"
            })

            io.getIO().emit("get:payment", payment);
        }
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getPaymentByHostId = async(req, res, next) =>{
    try {
        let payment = await Payment.find({host: req.params.id});
        if(payment){
            res.status(201)
            .json({
                payment,
                message: "Payments By HostId!"
            })

            io.getIO().emit("getbyhost:payment", payment);

        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}