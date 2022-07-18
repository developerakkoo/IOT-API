const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
email:{
    type: String
},
password:{
    type: String
},

mobileNo:{
    type: Number
},


image:{
    type: String
},

balance:{
    type: Number,
    default: 0
}




},{timestamps: true});


module.exports = mongoose.model("User", userSchema);