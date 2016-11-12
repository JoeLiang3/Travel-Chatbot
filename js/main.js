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
$(document).ready(function () { // start js once document loads

 
  var beginURL = "https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search/v1.2/flights/low-fare-search?apikey=NNd0iA0mK7NWdWJreIepC8Heb41azLry";
  var URL = beginURL + "&origin=" + origin + "&destination=" + destination + "&departure_date=" + departure
            + "&return_by=" + returnBy + "&adults=" + adults + "&children=" + children + "&max_price=" +
            max_price + "&number_of_results=" + numberResults + " HTTP/1.1";
  
  
  $.getJSON(URL, function(data) {
    console.log(data);
    console.log(data.results[1].fare.total_price);
    for (var i = 0; i < data.results.length; i++){
      console.log(data.results[i].fare.total_price);
    }
  });
});

function Chat (input){
  if (input == ""){
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
    var message = "How many adults are you looking to have?";
    originBool = !originBool;
    sendMessage(message);
    destination = input; 
  }
  else if (input.contains("adults")){
    var message = "When are you planning to leave?";
    sendMessage(message);
    adults = input;
  }
  else if (input.contains("/") && departureBool){
    var message = "When are you planning to return by?";
    sendMessage(message);
    departureBool = !departureBool
    var date = input.split("/");
    var departureDate = "20" + input[2] + "-" + input[0] + "-" + input[1];
    departure = departureDate;
  }
  else if (input.contains("/") && !departureBool){
    var message = "Thanks for the information! Loading your results!";
    sendMessage(message);
    departureBool = !departureBool
    var date = input.split("/");
    var departureDate = "20" + input[2] + "-" + input[0] + "-" + input[1] + "T23%3A59";
    returnsBy = returnsBy;
    getPrice();
  }
  
}