var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var bcrypt = require("bcryptjs");

var userSchema  = mongoose.Schema({
    name : String,
    age  : Number,
    contact : String,
    username : String,
    password  : String
 });
 
//  userSchema.plugin(passportLocalMongoose);

 var user = module.exports = mongoose.model("user",userSchema);

 module.exports.createUser = function(newUser,callback){  // here as this function is called Newuser from app.js goes inside newUser of function and this function hashes the password and the newUser is saved in the database
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password, salt,function(err,hash){
              //Store hash in your password DB.
              newUser.password = hash;  //new user is the model of the
              newUser.save(callback);
        })
    })
}

module.exports.getUserByUsername = function(username,callback){
    var query = {username : username};
    user.findOne(query,callback);
}

module.exports.comparePassword = function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword,hash,function(err,isMatch){
        if(err) throw err;
        callback(null,isMatch);
    });
}

module.exports.getUserById = function(id,callback){
    user.findById(id,callback);
}


