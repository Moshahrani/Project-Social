const mongoose = require("mongoose");

 async function connectDb() {
   try {
     mongoose.connect(process.env.MONGO_URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true
     });
     console.log("Mongodb connection made!");
   } catch (error) {
     console.log(error);
     process.exit(1);
   }
 }

 module.exports = connectDb;