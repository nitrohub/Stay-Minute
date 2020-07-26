var express = require("express");
var router  = express.Router();
var admin = require("../models/Hoteladmin");
var room  = require("../models/room");
var comment = require("../models/comment");
var middleware    = require("../middleware/index");

router.post("/search",function(req,res){
   
    var city = req.body.city.toLowerCase();
    var data;
    if(!city){
      console.log("undd");
      data={};
    }else{
       data={
          city:city
       }
    }
       
      admin.find(data,function(err,hotels){
             if(err){
                console.log("Error in finding the hotels");
             }else{  
               //  console.log(hotels);    
                 res.json(hotels);
             }
          })
 });
 
 router.get("/hotelDetails/:id",function(req,res){
    var id =req.params.id;
    admin.findById(id).populate("comment").exec(function(err,foundHotel){
      if(err){
         console.log(err)
      }else{
         res.render("hotelDetails",{hotel:foundHotel});
      }
    });
 });
 
 
 router.post("/checkAvailability/:id",middleware.isLoggedIn,function(req,res){
    
    admin.find({_id : req.params.id}).populate("room").exec(function(err,hotel){
       if(err){
          console.log(err);
       }else{
          var count = 0;
          console.log("Count before searching="+count);
          
          var book = [];  // to store the Room Id to store the reservations.
          console.log("Book before searching="+book);
          var fromInput =req.body.from.toString();
          var toInput   =req.body.to.toString();
            // console.log("fr="+fromInput);
            // console.log("to="+toInput);
          var fromDate = parseInt( fromInput.substring(0,4) + fromInput.substring(5,7) + fromInput.substring(8,10) + fromInput.substring(11,13) + fromInput.substring(14,16));
          var toDate   = parseInt( toInput.substring(0,4) + toInput.substring(5,7) + toInput.substring(8,10) + toInput.substring(11,13) + toInput.substring(14,16));
 
          console.log("From Date = "+fromDate);
          console.log("To Date = "+toDate);
 
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
                     $push: {"reserved": {from: (fromDate.toString()), to: (toDate.toString()), customer:{id:req.user._id,name:req.user.name}}}
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
                  //  res.send("Rooms Reserved Successfully!");
                  req.flash("success","Booking Successful!");
                  res.redirect("/index");
            }else{

                  // res.send("only "+count+" rooms are left");
                  req.flash("error","only "+count+" "+req.body.roomType+" rooms are left");            
                  res.redirect("/hotelDetails/"+req.params.id);
            } 
       }
    })
 });

 module.exports = router;