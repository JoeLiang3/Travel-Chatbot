var origin = "SFO";
var destination = "LAX";
var departure = "2016-11-25";
var returnBy = "2016-12-1T23%3A59";
var adults = 1;
var children = 0;
var max_price = 500000;
var numberResults = 5;
var originBool = true;
var departureBool = true;
var loadMore = 0
var enc = [66, 106, 117, 121, 69, 54, 107, 108, 55, 77, 122, 52, 79, 55, 100, 121, 52, 113, 82, 76, 53, 50, 113, 68, 122, 119, 116, 48, 68, 80, 86, 117];
var dec = String.fromCharCode(enc[0], enc[1], enc[2], enc[3], enc[4], enc[5], enc[6], enc[7], enc[8], enc[9], enc[10], enc[11], enc[12], enc[13], enc[14], enc[15], enc[16], enc[17], enc[18], enc[19], enc[20], enc[21], enc[22], enc[23], enc[24], enc[25], enc[26], enc[27], enc[28], enc[29],enc[30],enc[31]);
var APIKEY = dec //IF YOU USE THIS CODE USE YOUR OWN KEY! THIS IS A PLACEHOLDER

if (!('contains' in String.prototype)) String.prototype.contains = function (str, startIndex) {
    return -1 !== String.prototype.indexOf.call(this, str, startIndex);
};

$(document).ready(function () { // start js once document loads
 Chat("");
 $('#usermsg').bind("keypress", function(e) {
        if (e.keyCode == 13) {
            inputSent();
            return false; // prevent the button click from happening
        }
});
  
});
function Chat (input){
  if (input.contains("yes") || input.contains("Yes")){
    var message = "Here are more results!"
    sendMessage(message);
    loadMore += 1;
    getAirlinePrices();
  }
  else if (input == ""){
    var message = "Hi, welcome to flight tracker. Please tell us the code of the departure airport.";
    sendMessage(message);
  }
  else if (input.length == 3 && originBool){
    var message = "Thank you. Now please tell us the code of the arrival airport.";
    originBool = !originBool;
    sendMessage(message);
    origin = input; 
  }
  else if (input.length == 3 && !originBool){
    var message = "How many people are you looking to have?";
    originBool = !originBool;
    sendMessage(message);
    destination = input; 
  }
  else if (input.contains("adults") || input.length < 3){
    var message = "When are you planning to leave?";
    sendMessage(message);
    adults = input;
  }
  else if (input.contains("/") && departureBool){
    var message = "When are you planning to return by?";
    sendMessage(message);
    departureBool = !departureBool
    var date = input.split("/");
    console.log(date);
    if (date[0].length == 1){
      date[0] = "0" + date[0];
    }
    if (date[1].length == 1){
      date[1] = "0" + date[1];
    }
    var departureDate = "20" + date[2] + "-" + date[0] + "-" + date[1];
    console.log(departureDate);
    departure = departureDate;
  }
  else if (input.contains("/") && !departureBool){
    var message = "Thanks for the information! Loading your results!";
    sendMessage(message);
    departureBool = !departureBool
    var date = input.split("/");
    if (date[0].length == 1){
      date[0] = "0" + date[0];
    }
    if (date[1].length == 1){
      date[1] = "0" + date[1];
    }
    var returnDate = "20" + date[2] + "-" + date[0] + "-" + date[1] + "T23%3A59";
    returnBy = returnDate;
    getAirlinePrices();
  }
}
function getAirlinePrices(){
    
  var beginURL = "https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search/v1.2/flights/low-fare-search?apikey=" + APIKEY;
  var URL = beginURL + "&origin=" + origin + "&destination=" + destination + "&departure_date=" + departure
            + "&return_by=" + returnBy + "&adults=" + adults + "&children=" + children + "&max_price=" +
            max_price + "&number_of_results=" + numberResults + " HTTP/1.1";
  
  
  $.getJSON(URL, function(data) {
    console.log(data);
    console.log(data.results[1].fare.total_price);
    console.log(data.results[0].itineraries[0].outbound.flights[0].arrives_at);
    var arrival = data.results[loadMore].itineraries[0].outbound.flights[0].arrives_at;
    arrival = arrival.split("T")[0];
    var depart = data.results[loadMore].itineraries[0].inbound.flights[0].departs_at;
    depart = depart.split("T")[0];
    var message = "Here is the cheapest plane ticket fitting your criteria: $" + data.results[loadMore].fare.total_price;
    sendMessage(message);
    message = "The plane departs at " + data.results[loadMore].itineraries[0].outbound.flights[0].departs_at.split("T")[1];
    sendMessage(message);
    getHotelPrices(arrival, depart, data.results[loadMore].fare.total_price);

  });
}



function getHotelPrices(arrival, depart, airfare){
    
  var beginURL = "https://api.sandbox.amadeus.com/v1.2/hotels/search-airport?apikey=" + APIKEY;
   // &location=BOS&check_in=2016-11-15&check_out=2016-11-16&number_of_results=5"
  var URL = beginURL + "&location=" + destination + "&check_in=" + arrival + "&check_out=" + depart +"&number_of_results=5";
  
  
  $.getJSON(URL, function(data) {
    console.log(data);
    if(data.results.length != 0){
    console.log(data.results[loadMore].total_price.amount);
    var message = "Here is the cheapest hotel fitting your criteria: $" + data.results[loadMore].total_price.amount;
    sendMessage(message);
    var message = "The hotel is called " + data.results[loadMore].property_name;
    sendMessage(message);
    var totalPrice = parseFloat(airfare) + parseFloat(data.results[loadMore].total_price.amount);
    getRentalCarPrices(arrival, depart, totalPrice);
    }
  });
}
function getRentalCarPrices(arrival, depart, twoprice){
    
  var beginURL = "https://api.sandbox.amadeus.com/v1.2/cars/search-airport?apikey=" + APIKEY;
   // "&location=NCE&pick_up=2016-11-22&drop_off=2016-11-28"
  var URL = beginURL + "&location=" + destination + "&pick_up=" + arrival + "&drop_off=" + depart +"&number_of_results=5";
  
  
  $.getJSON(URL, function(data) {
    console.log(data);
    console.log(data.results[loadMore].cars[0].estimated_total.amount);
    var message = "Here is the cheapest car rental fitting your criteria: $" + data.results[loadMore].cars[0].estimated_total.amount;
    sendMessage(message);
    var totalPrice = parseFloat(twoprice) + parseFloat(data.results[loadMore].cars[0].estimated_total.amount);
    message = "All the expenses add up to $" + totalPrice.toFixed(2);
    sendMessage(message);
    message = "Do you want to see the next best offer?"
    sendMessage(message);
  });
}




function addInput (input) {
  // create a new div element 
  // and give it some content 
  //var base = document.getElementsByName('height')[0].value;
  var newDiv = document.createElement("div"); 
  newDiv.className = "input";
  console.log(input);
  var newContent = document.createTextNode(input); 
  newDiv.appendChild(newContent); //add the text node to the newly created div. 
  
  // add the newly created element and its content into the DOM 
  var currentDiv = document.getElementById("chatbox"); 
  var parentDiv = currentDiv.parentNode;
  parentDiv.insertBefore(newDiv, currentDiv);
  document.getElementById("chatbox").value = "";
  window.scrollTo(0,document.body.scrollHeight);

}
function sendMessage (Output) {
  // create a new div element 
  // and give it some content 
  //var base = document.getElementsByName('height')[0].value;
  var newDiv = document.createElement("div"); 
  newDiv.className = "output";
  var newContent = document.createTextNode(Output); 
  newDiv.appendChild(newContent); //add the text node to the newly created div. 
  
  // add the newly created element and its content into the DOM 
  var currentDiv = document.getElementById("chatbox"); 
  var parentDiv = currentDiv.parentNode;
  parentDiv.insertBefore(newDiv, currentDiv);
  document.getElementById("chatbox").value = "";
  window.scrollTo(0,document.body.scrollHeight);

}
function inputSent () {
  var input = document.getElementById('usermsg').value.toString();
  document.getElementById('usermsg').value="";
  addInput(input);
  Chat(input);
}