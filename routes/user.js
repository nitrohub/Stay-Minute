var express = require("express");
var router  = express.Router();
var user = require("../models/user");
var passport = require("passport");
const { resolve } = require("path");
const { Console } = require("console");
var localStrategy = require("passport-local").Strategy;

router.get("/signup",function(req,res){  //go to signup page
    res.render("signup");
 });

 router.get("/login",function(req,res){   //render login if asked to login
    res.render("login");
 });
 
 router.post("/signup",function(req,res){  //Working
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
 
  
  router.post("/login",passport.authenticate("user",{  //User login
    successRedirect :"/index",  
    failureRedirect : "/login",
  }),function(req,res){
  });
 
  router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/index");
  });

 

 module.exports = router;
 