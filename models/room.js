var mongoose = require("mongoose");
var roomSchema = mongoose.Schema({
    roomNo    : Number,
    roomType  : String,
    beds      : Number,
    occupancy : Number,
    cost      : Number,
    reserved  : [
       {
         from : String,
         to   : String,
       }
    ]
 });
 
 module.exports = mongoose.model("room",roomSchema);
 