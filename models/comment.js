var mongoose = require("mongoose");
var commentSchema = mongoose.Schema({
   Author : String,
   Comment : String
});

module.exports = mongoose.model("comment",commentSchema);