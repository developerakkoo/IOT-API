const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hostSchema = new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },

    address: {
        type: String
    },

    image: {
        type: String
    },

    bankName: {
        type: String
    },

    IFSC: {
        type: String
    },

    AccountNumber: {
        type: String
    },

    AccountHolderName: {
        type: String
    },

    cords: {
        type: [Number]
    },

    status: {
        type: String,
        default: "available",
        enum: ['available', 'reserved', 'inuse', 'fault']
    },

    chargerId: {
        type: String
    },

    isBooked: {
        type: Boolean
    },

}, { timestamps: true });


module.exports = mongoose.model("Host", hostSchema);