const mongoose = require("mongoose");

const User = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    }
})

module.exports = mongoose.model("user",User);