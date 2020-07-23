var mongoose = require("mongoose");
var commentSchema = mongoose.Schema({
   Author : {
        id:{
               type : mongoose.Schema.Types.ObjectId,
               ref  : "users" 
        },
        name     : String
   },
    Comment : String
});

module.exports = mongoose.model("comment",commentSchema);