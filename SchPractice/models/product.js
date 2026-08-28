const mongoose = require("mongoose");

const Product = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    }
})


module.exports = mongoose.model("product",Product);