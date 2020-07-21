var express = require("express");
var router  = express.Router();
var user    = require("../models/comment");

//Route you get when you want to comment on the hotel
router.get("/comment",function(req,res){
    res.render("comment");
 });
 
router.get("/comment/:id/edit",function(req,res){
    console.log("The comment to be edited = "+req.params.id);
    comment.findById(req.params.id,function(err,comment){
       if(err){
          console.log(err);
       }else{
          res.render("commentEdit",{comment:comment});
       }
    });
 });
 
router.post("/comment/:id",function(req,res){
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
 
router.put("/comment/:id",function(req,res){
     comment.findByIdAndUpdate(req.params.id,req.body.comment,function(err,updated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/room");
        }
     });
 });
 
router.delete("/comment/:id",function(req,res){
     comment.findByIdAndRemove(req.params.id,function(err){
         if(err){
            console.log(err);
         }else{
            res.redirect("/room");
         }
     });
    });
 
module.exports = router;