var mongoose               = require("mongoose");
var passportLocalMongoose  = require("passport-local-mongoose");
var bcrypt                 = require("bcryptjs");

var hotelSchema   = new mongoose.Schema({
   name           :String,  //Hotel name
   owner          :String,
   no_of_rooms    :Number,
   city           :String,
   location       :String,
   image          :String,
   phone          :String,
   username       :String,
   password       :String,
   description    :String,
   room           : [
      {
         type     : mongoose.Schema.Types.ObjectId,
         reference   : "room"  
      }
   ],
   comment        : [
      {
         type        : mongoose.Schema.Types.ObjectId,
         reference   : "comment"  //name of the model
      }
   ]
});

// hotelSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("admin",hotelSchema);

var admin = module.exports = mongoose.model("admin",hotelSchema);

module.exports.createAdmin = function(newAdmin,callback){
   bcrypt.genSalt(10,function(err,salt){
      bcrypt.hash(newAdmin.password,salt,function(err,hash){
         //Store hash in your password DB.
         newAdmin.password = hash;
         newAdmin.save(callback);
      })
   })
}

module.exports.getAdminByUsername = function(username,callback){
   var query = {username : username};
   admin.findOne(query,callback);
}

module.exports.comparePassword = function(candidatePassword,hash,callback){
   bcrypt.compare(candidatePassword,hash,function(err,isMatch){
      if(err) throw err;
      callback(null,isMatch);
   });
}

module.exports.getAdminById = function(id,callback){
   admin.findById(id,callback);
}



