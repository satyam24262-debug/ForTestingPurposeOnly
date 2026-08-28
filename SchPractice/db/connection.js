const mongoose = require("mongoose");

  const connectDB = async()=>{
    try{

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb is connected successfully");

    }catch(e){
        console.log(e);
    }
}


module.exports = connectDB;
