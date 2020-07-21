var express = require("express");
var router  = express.Router();
var admin = require("../models/Hoteladmin");
var room  = require("../models/room");
var passport = require("passport");
const { resolve } = require("path");
const { Console } = require("console");
var localStrategy = require("passport-local").Strategy;

router.get("/Radmin",function(req,res){  //Register Admin!
    res.render("Radmin");
});

var no_of_rooms_global_var=0;

router.post("/Radmin",function(req,res){
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

router.post("/addroom/:id",function(req,res){
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
             
       res.redirect("/");
 
 });

 
router.get("/Ladmin",function(req,res){
    res.render("Ladmin");
 });
 
 
router.post("/Ladmin",passport.authenticate("admin",{  //User login
    successRedirect :"/checkout",  
    failureRedirect : "/Ladmin",
  }),function(req,res){
  });
 
router.get("/Oadmin",function(req,res){
  req.logout();
  res.send("Logout successful!");
 });
 
 
module.exports = router;
