function Amount(){
    var nos = document.getElementById("no").value;
    var types = document.getElementsByName("roomType")[0].value;
    var from = document.querySelector("#from").value;
    var to = document.querySelector("#to").value;

    // console.log("From="+from);
    // console.log("To="+to);

    if(from!=="" && to!==""){

    var fromDate = parseInt( from.substring(0,4) + from.substring(5,7) + from.substring(8,10) + from.substring(11,13) + from.substring(14,16));
    var toDate   = parseInt( to.substring(0,4) + to.substring(5,7) + to.substring(8,10) + to.substring(11,13) + to.substring(14,16));
    var flag=1;
    
    if(toDate-fromDate<30){
        $("#total").val("");
        alert("You will have to book the room for at least 30 minutes");
        $("#RoomTypeSelection").val("");
        $("#no").val("");
        document.getElementById("from").type="text";
        document.getElementById("from").value="";
        document.getElementById("to").type="text";
        document.getElementById("to").value="";
        flag=0;
    }else{

    var fromYear = parseInt(from.substring(0,4));
    var toYear   = parseInt(to.substring(0,4));

    var fromMonth = parseInt(from.substring(5,7));
    var toMonth = parseInt(to.substring(5,7));

    var fromDay   = parseInt(from.substring(8,10));
    var toDay     = parseInt(to.substring(8,10));

    var fromHour  = parseInt(from.substring(11,13));
    var toHour    = parseInt(to.substring(11,13));

    var fromMinutes = parseInt(from.substring(14,16));
    var toMinutes   = parseInt(to.substring(14,16));
    
    var minutesDuration,hoursDuration,daysDuration,monthsDuration;   
   
    if(toMinutes>=fromMinutes){
        minutesDuration = toMinutes-fromMinutes;
    }else{
            toHour-=1;
            toMinutes+=60;
            minutesDuration = toMinutes-fromMinutes;
    }

    if(toHour>=fromHour){
        hoursDuration = toHour-fromHour;
    }else{
            toDay-=1;
            toHour+=24;
            hoursDuration = toHour-fromHour;
    }

    if(toDay>=fromDay){
        daysDuration=toDay-fromDay;
    }else{
            if(toMonth==1){
                toMonth-=1;
                toDay+=31;
                daysDuration=toDay-fromDay;
            }else if(toMonth==2){
                toMonth-=1;
                toDay+=31;
                daysDuration=toDay-fromDay;
            }else if(toMonth==3){
                 if(leapYear(toYear)){
                    toMonth-=1;
                    toDay+=29;
                }else{
                    toMonth-=1;
                    toDay+=28;
                }
                daysDuration=toDay-fromDay;
            }else if(toMonth==4){
                toMonth-=1;
                toDay+=31;
                daysDuration=toDay-fromDay;
            }else if(toMonth==5){
                toMonth-=1;
                toDay+=30;
                daysDuration=toDay-fromDay;
            }else if(toMonth==6){
                toMonth-=1;
                toDay+=31;
                daysDuration=toDay-fromDay;
            }else if(toMonth==7){
                toMonth-=1;
                toDay+=30;
                daysDuration=toDay-fromDay;
            }else if(toMonth==8){
                toMonth-=1;
                toDay+=31;
                daysDuration=toDay-fromDay;
            }else if(toMonth==9){
                toMonth-=1;
                toDay+=31;
                daysDuration=toDay-fromDay;
            }else if(toMonth==10){
                toMonth-=1;
                toDay+=30;
                daysDuration=toDay-fromDay;
            }else if(toMonth==11){
                toMonth-=1;
                toDay+=31;
                daysDuration=toDay-fromDay;
            }else if(toMonth==12){
                toMonth-=1;
                toDay+=30;
                daysDuration=toDay-fromDay;
            }
    }if(toMonth>=fromMonth){
        if(toMonth-fromMonth==1){
            if(((daysDuration==0) && (hoursDuration==0)) && ((minutesDuration==0) && (toYear-fromYear==0))){
                monthsDuration=1;
            }else{
                // console.log("Sorry we are not permitted to serve you for more than a month continuously");
                $("#total").val("");
                alert("Sorry we are not permitted to serve you for more than a month continuously");
                $("#RoomTypeSelection").val("");
                $("#no").val("");
                document.getElementById("from").type="text";
                document.getElementById("from").value="";
                document.getElementById("to").type="text";
                document.getElementById("to").value="";
                flag=0;
                minutesDuration=0;
                hoursDuration=0;
                daysDuration=0;
                monthsDuration=0; 
            }
        }else if(toMonth-fromMonth==0){
                if(toYear>fromYear){
                    // console.log("Sorry we are not permitted to serve you for more than a month continuously");
                    $("#total").val("");
                    alert("Sorry we are not permitted to serve you for more than a month continuously");
                $("#RoomTypeSelection").val("");
                $("#no").val("");
                document.getElementById("from").type="text";
                document.getElementById("from").value="";
                document.getElementById("to").type="text";
                document.getElementById("to").value="";
                        flag=0;
                }else{
                    monthsDuration = 0;
                }
            }else{  //Greater than 1
                // console.log("Sorry we are not permitted to serve you for more than a month continuously");
                $("#total").val("");
                alert("Sorry we are not permitted to serve you for more than a month continuously");
                $("#RoomTypeSelection").val("");
                $("#no").val("");
                document.getElementById("from").type="text";
                document.getElementById("from").value="";
                document.getElementById("to").type="text";
                document.getElementById("to").value="";
                flag=0;
                minutesDuration=0;
                hoursDuration=0;
                daysDuration=0;
                monthsDuration=0;
            }
    }else{  //toMonth<fromMonth and toyear>fromyear
        // console.log("Month Less");
        if(toYear-fromYear==1){
            // console.log("to-from=1");
            if((toMonth==1) && (fromMonth==12)){
                // console.log("to=1 and from=12");
                if(((minutesDuration==0) && (hoursDuration==0)) && (daysDuration==0)){
                    // console.log("Yes");
                    monthsDuration=1;
                }else{
                    // console.log("Sorry we are not permitted to serve you for more than a month continuously");
                    $("#total").val("");
                    alert("Sorry we are not permitted to serve you for more than a month continuously");
                $("#RoomTypeSelection").val("");
                $("#no").val("");
                document.getElementById("from").type="text";
                document.getElementById("from").value="";
                document.getElementById("to").type="text";
                document.getElementById("to").value="";
                    flag=0;
                    minutesDuration=0;
                    hoursDuration=0;
                    daysDuration=0;
                    monthsDuration=0;
                }
            }else if( (toMonth==0) && (fromMonth==12) ){
                monthsDuration=0;
            }else{  //for any other months in which to<from wont work
                // console.log("Sorry we are not permitted to serve you for more than a month continuously");
                $("#total").val("");
                alert("Sorry we are not permitted to serve you for more than a month continuously");
                $("#RoomTypeSelection").val("");
                $("#no").val("");
                document.getElementById("from").type="text";
                document.getElementById("from").value="";
                document.getElementById("to").type="text";
                document.getElementById("to").value="";
                flag=0;
            }
        }else{  //Since we are entering here only if the toyear is greater than fromyear therefore this condition would only be checked only if the year difference is greater than 1
                // console.log("Sorry we are not permitted to serve you for more than a month continuously");
                $("#total").val("");
                alert("Sorry we are not permitted to serve you for more than a month continuously");
                $("#RoomTypeSelection").val("");
                $("#no").val("");
                document.getElementById("from").type="text";
                document.getElementById("from").value="";
                document.getElementById("to").type="text";
                document.getElementById("to").value="";
                flag=0;
                minutesDuration=0;
                hoursDuration=0;
                daysDuration=0;
                monthsDuration=0;
        }
    }

    if(flag==1){
                // console.log("Minutes Duration="+minutesDuration);
                // console.log("Hours Duration="+hoursDuration);
                // console.log("Days Duration="+daysDuration);
                // console.log("Months Duration="+monthsDuration);


                var totalStayAmount;
                
                if(types.localeCompare("Simple")==0){

                    var cost_of_half_hour = parseInt($("#simpleRoom").text());
                    var cost_of_an_hour   = 2*cost_of_half_hour;
                    var cost_of_a_day     = cost_of_an_hour*24;

                    // console.log("Cost of half hour="+cost_of_half_hour);
                    // console.log("Cost of an hour="+cost_of_an_hour);
                    // console.log("Cost of a day="+cost_of_a_day);

                    totalStayAmount = cost_of_half_hour*Math.ceil(minutesDuration/30);
                    totalStayAmount += cost_of_an_hour*hoursDuration;
                    totalStayAmount += cost_of_a_day*daysDuration;
                    if(monthsDuration==1){
                        if(fromMonth==1 || fromMonth==3 || fromMonth==5 || fromMonth==7 || fromMonth==8 || fromMonth==10 || fromMonth==12){
                                totalStayAmount += cost_of_a_day*31;
                        }else if(fromMonth==4 || fromMonth==6 || fromMonth==9 || fromMonth==11){
                                totalStayAmount += cost_of_a_day*30;
                        }else if(fromMonth==2){
                             if(leapYear(toYear)){
                                 totalStayAmount+=cost_of_a_day*29;
                             }else{
                                 totalStayAmount+=cost_of_a_day*28;
                             }
                        }
                    }
                    
                    totalStayAmount=totalStayAmount*parseInt(nos);  //total amount * no_of_rooms
                    
                }else if(types.localeCompare("Deluxe")==0){
                    var cost_of_half_hour = parseInt($("#deluxeRoom").text());
                    var cost_of_an_hour   = 2*cost_of_half_hour;
                    var cost_of_a_day     = cost_of_an_hour*24;

                    // console.log("Cost of half hour="+cost_of_half_hour);
                    // console.log("Cost of an hour="+cost_of_an_hour);
                    // console.log("Cost of a day="+cost_of_a_day);
                    
                    totalStayAmount = cost_of_half_hour*Math.ceil(minutesDuration/30);
                    totalStayAmount += cost_of_an_hour*hoursDuration;
                    totalStayAmount += cost_of_a_day*daysDuration;
                    if(monthsDuration==1){
                        if(fromMonth==1 || fromMonth==3 || fromMonth==5 || fromMonth==7 || fromMonth==8 || fromMonth==10 || fromMonth==12){
                                totalStayAmount += cost_of_a_day*31;
                        }else if(fromMonth==4 || fromMonth==6 || fromMonth==9 || fromMonth==11){
                                totalStayAmount += cost_of_a_day*30;
                        }else if(fromMonth==2){
                             if(leapYear(toYear)){
                                 totalStayAmount+=cost_of_a_day*29;
                             }else{
                                 totalStayAmount+=cost_of_a_day*28;
                             }
                        }
                    }
                    
                    totalStayAmount=totalStayAmount*parseInt(nos);
                }else if(types.localeCompare("Super Deluxe")==0){
            
                    var cost_of_half_hour = parseInt($("#superDeluxeRoom").text());
                    var cost_of_an_hour   = 2*cost_of_half_hour;
                    var cost_of_a_day     = cost_of_an_hour*24;

                    // console.log("Cost of half hour="+cost_of_half_hour);
                    // console.log("Cost of an hour="+cost_of_an_hour);
                    // console.log("Cost of a day="+cost_of_a_day);
                    
                    totalStayAmount = cost_of_half_hour*Math.ceil(minutesDuration/30);
                    totalStayAmount += cost_of_an_hour*hoursDuration;
                    totalStayAmount += cost_of_a_day*daysDuration;
                    if(monthsDuration==1){
                        if(fromMonth==1 || fromMonth==3 || fromMonth==5 || fromMonth==7 || fromMonth==8 || fromMonth==10 || fromMonth==12){
                                totalStayAmount += cost_of_a_day*31;
                        }else if(fromMonth==4 || fromMonth==6 || fromMonth==9 || fromMonth==11){
                                totalStayAmount += cost_of_a_day*30;
                        }else if(fromMonth==2){
                             if(leapYear(toYear)){
                                 totalStayAmount+=cost_of_a_day*29;
                             }else{
                                 totalStayAmount+=cost_of_a_day*28;
                             }
                        }
                    }
                    
                    totalStayAmount=totalStayAmount*parseInt(nos);
                }
                
                // console.log("Total Stay Amount="+totalStayAmount);
                $("#total").val(totalStayAmount);
            }               
    }
    }
}

function leapYear(year){
    if(year%400==0){
        return true;
    }else if((year%4==0) && ((year%100)!=0)){
        return true;
    }else{
        return false;
    }
}