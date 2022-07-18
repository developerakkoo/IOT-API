const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const serviceSchema = new Schema({

email:{
    type: String
},

password:{
    type: String
},

hosts:[{
    type: Schema.Types.ObjectId,
    ref: "Host"
}]




},{
    timestamps: true
});


module.exports = mongoose.model("Service", serviceSchema);