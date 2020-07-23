var express = require("express");
var router  = express.Router();
var user    = require("../models/comment");
var admin   = require("../models/Hoteladmin");
var comment = require("../models/comment");

//Route you get when you want to comment on the hotel
 
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

    admin.findById(req.params.id,function(err,foundadmin){
          if(err){
             console.log(err);
          }else{
             comment.create({Comment : req.body.comment,Author:{id:req.user._id,name:req.user.name}},function(err,comment){
                if(err){
                   console.log(err);
                }else{
                  //  comment.Author.id=req.user._id;
                  //  comment.Author.name=req.user.name;
                  //  comment.save();
                   foundadmin.comment.push(comment);
                   foundadmin.save();
                   console.log("Commented Successfully!");
                   res.redirect("/hotelDetails/"+req.params.id);
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
            res.redirect("/hotel");
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