function Amount(){
    var from = document.querySelector("#from").value;
    var to = document.querySelector("#to").value;

    if(Date.parse(to)>Date.parse(from)){
        if(from!=="" && to!==""){
            var fromDate = Date.parse(from);
            var toDate   = Date.parse(to);
            
            var difference_in_dates = toDate-fromDate;
            if(difference_in_dates/(1000*60*60*24)>28){
                alert("Sorry we are not permitted to serve you for more than 28 days!");
                $("#from").val("");
                $("#to").val("");
            }else{
                if($("#RoomTypeSelection").val().localeCompare("Simple")==0){
                    var cost = parseInt($("#simpleRoom").text());
                    var no_of_rooms = $("#no").val();
                    var total_cost = cost*no_of_rooms*Math.ceil(difference_in_dates/(1000*60*30));
                    $("#total").val(total_cost);
                    
                }else if($("#RoomTypeSelection").val().localeCompare("Deluxe")==0){
                    var cost = parseInt($("#deluxeRoom").text());
                    var no_of_rooms = $("#no").val();
                    var total_cost = cost*no_of_rooms*Math.ceil(difference_in_dates/(1000*60*30));
                    $("#total").val(total_cost);
        
                }else if($("#RoomTypeSelection").val().localeCompare("Super Deluxe")==0){
                    var cost = parseInt($("#superDeluxeRoom").text());
                    var no_of_rooms = $("#no").val();
                    var total_cost = cost*no_of_rooms*Math.ceil(difference_in_dates/(1000*60*30));
                    $("#total").val(total_cost);
                }else{
                    alert("Invalid Room Type");
                    $("#from").val("");
                    $("#to").val("");
                }
            }
            }    
    }else{
                    $("#from").val("");
                    $("#to").val("");
                    $("#total").val("Invalid Date");
    }
}