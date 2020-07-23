var express = require("express");
var router  = express.Router();
var user    = require("../models/comment");
var admin   = require("../models/Hoteladmin");
var comment = require("../models/comment");

//Route you get when you want to comment on the hotel
 
router.get("/hotel/:id/comment/:cid/edit",function(req,res){
    console.log("The comment to be edited = "+req.params.cid);
    comment.findById(req.params.cid,function(err,comment){
       if(err){
          console.log(err);
       }else{
          data = {
             hid : req.params.id,
             comment : comment
          }
          res.render("commentEdit",data);
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
 
router.put("/hotel/:id/comment/:cid",function(req,res){

      console.log("Edited="+req.body.comment);
     comment.findByIdAndUpdate(req.params.cid,{Comment:req.body.comment},function(err,updated){
        if(err){           
            console.log(err);
        }else{
            console.log("Updated="+updated);
            res.redirect("/hotelDetails/"+req.params.id);
        }
     });
 });
 
router.delete("/hotel/:id/comment/:cid",function(req,res){
     comment.findByIdAndRemove(req.params.cid,function(err){
         if(err){
            console.log(err);
         }else{
            res.redirect("/hotelDetails/"+req.params.id);
         }
     });
    });
 
module.exports = router;