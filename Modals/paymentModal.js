const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
host:{
    type: mongoose.Types.ObjectId,
    ref: "Host"
},

user:{
    type: mongoose.Types.ObjectId,
    ref: "User"
},
paidAmount:{
    type: Number,
    default: 0
},



},{timestamps: true});


module.exports = mongoose.model("Payment", paymentSchema);