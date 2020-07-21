var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var methodOverride = require("method-override");
var room = require("./models/room");
var comment = require("./models/comment");
var admin = require("./models/Hoteladmin");  //importing the schema
var user = require("./models/user");  //Contains the Schema of user
var localStrategy = require("passport-local").Strategy;

var userRoutes = require("./routes/user"),
    commentRoutes = require("./routes/comments"),
    BookingRoutes = require("./routes/booking"),
    HotelRoutes   = require("./routes/hotel");

var app = express();
mongoose.connect("mongodb://localhost/StayMinute");



app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride('_method'));
app.use(session({
   secret : "secret",
   saveUninitialized : true,
   resave : true
}));

//Passport initialize
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){  //to use currentUser directly without passing any argument to the ejs files
   res.locals.currentUser = req.user;
   next();
})

app.use(userRoutes); 
app.use(commentRoutes);
app.use(BookingRoutes);
app.use(HotelRoutes);

passport.use("user",new localStrategy(
   function(username, password, done) {
    user.getUserByUsername(username,function(err,User){
       if(err) throw err;
       if(!User){
           return done(null, false, {message : 'Unknown user'})
       }
      user.comparePassword(password,User.password,function(err,isMatch){
               if(err) throw err;
               if(isMatch){
                   return done(null, User);
               }else{
                   return done(null, false,{message:'Invalid Password'});
               }
       });
    });
   }
 ));

 
passport.serializeUser(function(user, done) {
   done(null, user.id);
 });
 
passport.deserializeUser(function(id, done) {
   user.getUserById(id, function(err, user) {
     done(err, user);
   });
 });
 

app.get("/",function(req,res){
   res.render("landing");
});

app.get("/index",(req,res)=>{
   res.render("index");
});


//------------------------------------------------------------------------------------
//Sorting Rooms according to our parameters Routes
//------------------------------------------------------------------------------------

app.get("/room",function(req,res){
     comment.find({},function(err,comment){
          if(err){
             console.log(err);
          }else{
            res.render("Rooms",{comment:comment});
          }
     });
});

function successCallback(){
   console.log("Successful entry!");
}

function failure(){
   console.log("Failure in entry!");
}

passport.use("admin",new localStrategy(
   function(username, password, done) {
    admin.getAdminByUsername(username,function(err,Admin){
       if(err) throw err;
       if(!Admin){
           return done(null, false, {message : 'Unknown admin'})
       }
      admin.comparePassword(password,Admin.password,function(err,isMatch){
               if(err) throw err;
               if(isMatch){
                   return done(null, Admin);
               }else{
                   return done(null, false,{message:'Invalid Password'});
               }
       });
    });
   }
 ));

passport.serializeUser(function(admin, done) {
   done(null, admin.id);
 });

passport.deserializeUser(function(id, done) {
   admin.getAdminById(id, function(err, admin) {
     done(err, admin);
   });
 });

var port = process.env.PORT || 9000

app.listen(port,function(err){
   if(err){
       console.log(err);
   }else{
       console.log("Server Started!");
   }
});