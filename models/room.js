var mongoose = require("mongoose");
var roomSchema = mongoose.Schema({
    roomNo    : Number,
    roomType  : String,
    beds      : Number,
    occupancy : Number,
    reserved  : [
       {
         from : String,
         to   : String,
         customer : {
                  id:{
                     type : mongoose.Schema.Types.ObjectId,
                     ref  : "user"
                  },
                  name : String
         },
         room_Number : Number
       }
    ]
 });
 
 module.exports = mongoose.model("room",roomSchema);
 