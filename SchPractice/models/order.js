const mongoose = require("mongoose");

const Order = mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },

    product:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"product"
        }
    ],

    total:{
        type:Number
    }

})

module.exports = mongoose.model("order",Order);