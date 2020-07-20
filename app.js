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
const { resolve } = require("path");
const { Console } = require("console");
var localStrategy = require("passport-local").Strategy;


var app = express();
mongoose.connect("mongodb://localhost/StayMinute");
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(session({
   secret : "secret",
   saveUninitialized : true,
   resave : true
}));

//Passport initialize
app.use(passport.initialize());
app.use(passport.session());

//********************User  Authentication Routes***********************/
app.get("/signup",function(req,res){  //go to signup page
   res.render("signup");
});

app.get("/login",function(req,res){   //render login if asked to login
   res.render("login");
});

app.post("/signup",function(req,res){  //Working
   var name       = req.body.name;
   var age        = req.body.age;
   var contact    = req.body.contact;
   var username   = req.body.username;
   var password   = req.body.password;
      var newUser = new user({
         username : username,
         password : password,
         age      : age,
         contact  : contact,
         name     : name
});
 
         user.createUser(newUser,function(err,user){ //As we call create user the user goes to the function which is inside the models which hashes the password and saves the new user to the database
             if(err)  throw err;
             console.log(user);
         });
         res.render("landing");
 });

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

 app.post("/login",passport.authenticate("user",{  //User login
   successRedirect :"/",  
   failureRedirect : "/login",
 }),function(req,res){
 });

 app.get("/logout",function(req,res){
   req.logout();
   res.send("Logout successful!");
 });
 

// RoomTestingData();

app.get("/",function(req,res){
   res.render("landing");
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

// app.post("/room",function(req,res){
//     room.find({
//             roomType: "studio",//req.body.type,
//             beds    :  1,         //req.body.beds,
//             occupancy: {$gte: 2},//req.body.occupancy},  //should be greater than the number of guests
//             cost: {$gte: req.body.lower, $lte: req.body.upper},  //greater than or equal to lower range and less than or equals to higher range    
//             reserved:{
//                $not:{  //not specifies that this should not happen
//                   $elemMatch:{
//                      from: {$lte: req.body.to}, //The date and time should not be overlapping
//                      to: {$gte: req.body.from}  // Dates and time should not be overlapping
//                   }
//                }
//             }
//         },function(err, rooms){
//             if(err){
//                 res.send(err);
//             }else {
//                 console.log("Rooms Found:");
//                 var obj = JSON.parse(JSON.stringify(rooms));
//                 if(obj.length<req.body.no_of_rooms) {
//                      res.send("Max Availability="+obj.length);
//                 }else{
//                   res.send(obj); 
//                   for(var i=0;i<req.body.no_of_rooms;i++){  //For inserting multiple rooms
//                      room.findByIdAndUpdate(obj[i]._id,{
//                         $push: {"reserved": {from: req.body.from, to: req.body.to}}
//                     },{
//                         safe: true,
//                         new: true
//                     }, function(err, room){
//                         if(err){
//                             console.log("Error in updating:"+err);
//                         } else {
//                             console.log("Updated Room:"+room);
//                         }
//                     });
//                   }
//                 }
//             }
//         });
// });

//---------------------------------------------------------------------------------------
//Comment Routes
//---------------------------------------------------------------------------------------

//Route you get when you want to comment on the hotel
app.get("/comment",function(req,res){
   res.render("comment");
});

app.get("/comment/:id/edit",function(req,res){
   console.log("The comment to be edited = "+req.params.id);
   comment.findById(req.params.id,function(err,comment){
      if(err){
         console.log(err);
      }else{
         res.render("commentEdit",{comment:comment});
      }
   });
});

app.post("/comment/:id",function(req,res){
   // res.send("You are commenting!");
   admin.findById(req.params.id,function(err,foundadmin){
         if(err){
            console.log(err);
         }else{

            comment.create(req.body.comment,function(err,comments){
               if(err){
                  console.log(err);
               }else{
                  admin.comment.push(req.body.comment);
                  admin.save();
                  console.log("Commented Successfully!");
                  res.redirect("/room");
               }
         })


         }
   });
});

app.put("/comment/:id",function(req,res){
    comment.findByIdAndUpdate(req.params.id,req.body.comment,function(err,updated){
       if(err){
           console.log(err);
       }else{
           res.redirect("/room");
       }
    });
});

app.delete("/comment/:id",function(req,res){
    comment.findByIdAndRemove(req.params.id,function(err){
        if(err){
           console.log(err);
        }else{
           res.redirect("/room");
        }
    });
   });


//------------------------------------------------------------------------------------
//User Authenticate Routes
//------------------------------------------------------------------------------------ 
 

function isLoggedIn(req,res,next){  //preparing a middleware
   if(req.isAuthenticated()){
        return next();
   }
   res.redirect("/login");
}

//----------------------------------------------------------------------------------------------------------------------------
//Hotel Admin Authentication routes
//----------------------------------------------------------------------------------------------------------------------------


app.get("/Radmin",function(req,res){  //Register Admin!
     res.render("Radmin");
});

var no_of_rooms_global_var=0;

app.post("/Radmin",function(req,res){
   var name          = req.body.name;
   var owner         = req.body.owner;
   var no_of_rooms   = req.body.no_of_rooms;
   var city          = req.body.city.toLowerCase();
   var location      = req.body.location;
   var image         = req.body.image;
   var phone         = req.body.phone;
   var username      = req.body.username;
   var password      = req.body.password;
   var description   = req.body.description;
   var cost_of_simple_room = req.body.cost_of_simple_room;
   var cost_of_deluxe_room = req.body.cost_of_deluxe_room;
   var cost_of_superDeluxe_room = req.body.cost_of_superDeluxe_room;
   var newAdmin = new admin({
   name : name,
   owner : owner,
   no_of_rooms : no_of_rooms,
   city : city,
   location : location,
   image : image,
   phone : phone,
   username : username,
   password : password,
   description :description,
   cost_of_simple_room : cost_of_simple_room,
   cost_of_deluxe_room : cost_of_deluxe_room,
   cost_of_superDeluxe_room : cost_of_superDeluxe_room
   });

   no_of_rooms_global_var=no_of_rooms;
  
  admin.createAdmin(newAdmin,function(err,admin){
      if(err) throw err;
      console.log(admin);
      res.render("addRoom",{no_of_rooms:no_of_rooms_global_var,admin:admin});
  });
});


function successCallback(){
   console.log("Successful entry!");
}

function failure(){
   console.log("Failure in entry!");
}

// 

app.post("/addroom/:id",function(req,res){
   var roomEntry = [];
   for(var i=0;i<no_of_rooms_global_var;i++){
    var number    = req.body.room["number".concat((i+1).toString())];
    var type      = req.body.room["type".concat((i+1).toString())];
    var beds      = req.body.room["beds".concat((i+1).toString())];
    var occupancy = req.body.room["occupancy".concat((i+1).toString())];
    var cost      = req.body.room["cost".concat((i+1).toString())];
    
      
      var newRoom = new room({
         roomNo     : number,
         roomType   : type,
         beds       : beds,
         occupancy  : occupancy,
         cost       : cost
      });

      roomEntry.push(newRoom);

   }


   admin.findById(req.params.id,(err,found)=>{
      if(err){
         console.log(err);
      }else{   
         room.insertMany(roomEntry,(err,rooms)=>{
            if(err){
               console.log(err);
            }else{
               console.log("Rooms="+rooms);
            }
            found.room=found.room.concat(rooms);
            found.save();
      });

      }
   })
      


   //  admin.findById(req.params.id,function(err,found){
   //    function myFucnc(i){
   //       return new Promise((resolve,reject)=>{
   //          room.create(roomEntry[i],function(err,newRoom){
   //             if(err){
   //                console.log("Error in creating new Room");
   //                reject();
   //             }else{
   //                // console.log("Found Hotel = "+found);
   //                let p = new Promise((resolve,reject)=>{
   //                   found.room.push(newRoom);
   //                      resolve();
   //                });
   //                let q = new Promise((resolve,reject)=>{
   //                   found.save();
   //                   resolve();
   //                });
                  
   //                p.then(function(){
   //                   q.then(function(){
   //                      resolve();                        
   //                   }).catch(function(){
   //                      console.log("Error in inserting Rooms");
   //                   }).catch(function(){
   //                      console.log("Error in saving Rooms");
   //                   })
   //                })

   //             }
   //          })
            
   //       });
   //    }

   //     if(err){
   //        console.log("Error in finding the hotel admin");
   //        res.redirect("/");
   //     }else{     
   //          // console.log("Hotel Found!");

   //          async function registerRooms(){
   //             for(let i=0;i<no_of_rooms_global_var;i++){
   //                   await myFucnc(i);
   //                   console.log("Room"+(i+1)+"Registered!");
   //               }
   //          }
   //          registerRooms();
   //     }
   //  })
   
      
      res.redirect("/");

});


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



app.get("/Ladmin",function(req,res){
   res.render("Ladmin");
});


app.post("/Ladmin",passport.authenticate("admin",{  //User login
   successRedirect :"/",  
   failureRedirect : "/Ladmin",
 }),function(req,res){
 });

app.get("/Oadmin",function(req,res){
 req.logout();
 res.send("Logout successful!");
});

//----------------------------------------------------------------------------------------------------------------------------
//Searching Hotels and Showing Details
//----------------------------------------------------------------------------------------------------------------------------

app.post("/search",function(req,res){
   var city = req.body.city.toLowerCase();
   admin.find({city:city},function(err,hotels){
      if(err){
         console.log("Error in finding the hotels");
      }else{
         res.render("showHotel",{hotels:hotels});
      }
   })
});

app.get("/hotelDetails/:id",function(req,res){
   var id =req.params.id;
   admin.find({_id:id},function(err,hotel){
      if(err){
         console.log(err);
      }else{
         res.render("hotelDetails",{hotel:hotel[0]})
         // console.log("Room Type="+hotel[0]);
         
      }
      
   })
   // res.render("hotelDetails");
});


app.post("/checkAvailability/:id",function(req,res){
   // console.log("Inside the check Availability");
   
   admin.find({_id : req.params.id}).populate("room").exec(function(err,hotel){
      if(err){
         console.log(err);
      }else{
         
         var count = 0;
         console.log("Count before searching="+count);
         
         var book = [];  // to store the Room Id to store the reservations.
         console.log("Book before searching="+book);
         var fromDate = parseInt( req.body.from.substring(0,4) + req.body.from.substring(5,7) + req.body.from.substring(8,10) + req.body.from.substring(11,13) + req.body.from.substring(14,16));
         var toDate   = parseInt( req.body.from.substring(0,4) + req.body.from.substring(5,7) + req.body.to.substring(8,10) + req.body.to.substring(11,13) + req.body.to.substring(14,16));

         console.log("From After time = "+fromDate);
         console.log("To After time = "+toDate);

          loop1: for(let i=0;i<hotel[0].room.length;i++){
             var flag=0;
             let roomOfHotel = hotel[0].room[i];
               //   console.log("Room "+i+" = "+roomOfHotel);
            if(roomOfHotel.roomType.localeCompare(req.body.roomType)==0){

               loop2: for(let j=0;j<roomOfHotel.reserved.length;j++){  //Checking all the reservations of the rooms

                  let reservation = roomOfHotel.reserved[j];
                  // console.log("Reservation "+j+"="+reservation);
                  //  console.log("****************************************************")
                  //  console.log("From="+fromDate);
                  //  console.log("To="+toDate);
                  //  console.log("Reservation.From="+reservation.from);
                  //  console.log("Reservation.To="+reservation.to);
                  //  console.log("from>=reservation.form="+(fromDate>=parseInt(reservation.from)));
                  //  console.log("from=<reservation.to="+(fromDate<=parseInt(reservation.to)));
                  //  console.log("to>=reservation.from="+(toDate >= parseInt(reservation.from)));
                  //  console.log("to=<reservation.to="+(toDate<=parseInt(reservation.to)));
                  //  console.log("****************************************************")
                  if(((fromDate>=parseInt(reservation.from)) && (fromDate<=parseInt(reservation.to))) || ((toDate >= parseInt(reservation.from)) && (toDate<=parseInt(reservation.to)) ) ){
                     console.log("Break to loop2");
                     flag=1;
                     break loop2;
                }
               }
               // console.log("After Breaking loop2");
               if(flag==0){  //if it is not in the reservation then only
                  count++;
                  console.log("Count="+count);
                  book.push(roomOfHotel._id);  //ith room had the space
                  if(count>=req.body.No_of_room){
                     console.log("Count="+count);
                        break loop1;
                  }
               }
                
             }

          }


function booking(fromDate,toDate){
   // console.log("Inside Booking from=>"+fromDate);
   // console.log("Inside Booking to=>"+toDate);

   for(let i=0;i<book.length;i++){
                 room.findByIdAndUpdate(book[i],{
                    $push: {"reserved": {from: (fromDate.toString()), to: (toDate.toString())}}
                },{
                    safe: true,
                    new: true
                }, function(err, room){
                    if(err){
                        console.log("Error in updating:"+err);
                    } else {
                     //   console.log("Reservation Booked from=>"+room.reserved);
                    }
                });
              }
   }         
            if(count>=req.body.No_of_room){
               console.log("Count after Searching="+count);
               // console.log("FromDate before Booking="+fromDate);
               // console.log("ToDate before Booking="+toDate);
               booking(fromDate,toDate);
                  res.send("Rooms Reserved Successfully!");
           }else{
                 res.send("only "+count+" rooms are left");            
           } 
      }
   })
});



// console.log("Hotel="+hotel[0]);

// hotel.room.find({
// roomType: req.body.type,
// //   beds    :  1,// req.body.beds,
// //         occupancy: {$gte: 2},//req.body.occupancy},  //should be greater than the number of guests
// //         cost: {$gte: req.body.lower, $lte: req.body.upper},  //greater than or equal to lower range and less than or equals to higher range    
// reserved:{
//   $not:{  //not specifies that this should not happen
//      $elemMatch:{
//         from: {$lte: req.body.to}, //The date and time should not be overlapping
//         to: {$gte: req.body.from}  // Dates and time should not be overlapping
//      }
//   }
// }
// },function(err, rooms){
// if(err){
//    res.send(err);
// }else {
//    console.log("Rooms Found:");
//    var obj = JSON.parse(JSON.stringify(rooms));
//    if(obj.length<req.body.no_of_rooms) {
//         res.send("Max Availability="+obj.length);
//    }else{
//      res.send(obj); 
//      for(let i=0;i<req.body.no_of_rooms;i++){  //For inserting multiple rooms
//         room.findByIdAndUpdate(obj[i]._id,{
//            $push: {"reserved": {from: req.body.from, to: req.body.to}}
//        },{
//            safe: true,
//            new: true
//        }, function(err, room){
//            if(err){
//                console.log("Error in updating:"+err);
//            } else {
//                console.log("Room:"+obj[i]._id+" booked from :"+req.body.from+" to : "+req.body.to);
//            }
//        });
//      }
//    }
// }
// });






// function RoomTestingData(){
//        user.remove({},function(err){
//           if(err){
//              console.log(err);
//           }
//        });

//        admin.remove({},function(err){
//           if(err){
//              console.log(err);
//           }
//        });
      
//       comment.remove({},function(err){
//        if(err){
//           console.log(err);
//        }else{
//           console.log("All Comments removed successfully!");
//        }
//    });

//    room.remove({},function(err){
//       if(err){
//          console.log(err);
//       }else{
//          console.log("Successfully Removed!");
//       }
//    });
   
//     function getRandomInt(min,max){
//       return Math.floor(Math.random() * ( max - min + 1 ) ) + min;
//     }
  
//    for(var i=100;i<=250;i++){
//        var RoomTypes = [
//           "standard",
//           "villa",
//           "penthouse",
//           "studio"
//        ];
   
//         var newRoom = new room({
//            roomNo    : i,
//            roomType  : RoomTypes[getRandomInt(0,3)],
//            beds      : getRandomInt(1,6),
//            occupancy : getRandomInt(1,6),
//            cost      : getRandomInt(200,1000),
//            reserved  : [
//             {from    : '1970-02-01-12:30', to: '1970-02-02-12:40'},
//             {from    : '2010-01-01-12:10', to: '2010-01-03-13:50'},
//             {from    : '2011-01-01-11:00', to: '2011-01-01-13:50'}
//                    ]  
//         });
   
//         newRoom.save(function(err,room){
//            if(err){
//               console.log(err);
//            }else{
//               console.log(room);
//            }
//         });
//        // For Testing purpose all rooms will be booked from specific dates to specific dates
//    }   
// }
 
var port = process.env.PORT || 9000

app.listen(port,function(err){
   if(err){
       console.log(err);
   }else{
       console.log("Server Started!");
   }
});