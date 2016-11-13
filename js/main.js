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
    var message = "How many adults are you looking to have?";
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
    
  var beginURL = "https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search/v1.2/flights/low-fare-search?apikey=NNd0iA0mK7NWdWJreIepC8Heb41azLry";
  var URL = beginURL + "&origin=" + origin + "&destination=" + destination + "&departure_date=" + departure
            + "&return_by=" + returnBy + "&adults=" + adults + "&children=" + children + "&max_price=" +
            max_price + "&number_of_results=" + numberResults + " HTTP/1.1";
  
  
  $.getJSON(URL, function(data) {
    console.log(data);
    console.log(data.results[1].fare.total_price);
    console.log(data.results[0].itineraries[0].outbound.flights[0].arrives_at);
    var arrival = data.results[loadMore].itineraries[loadMore].outbound.flights[loadMore].arrives_at;
    arrival = arrival.split("T")[0];
    var depart = data.results[loadMore].itineraries[loadMore].inbound.flights[loadMore].departs_at;
    depart = depart.split("T")[0];
    var message = "Here is the cheapest plane ticket fitting your criteria: $" + data.results[loadMore].fare.total_price;
    sendMessage(message);
    message = "The plane departs at " + data.results[loadMore].itineraries[0].outbound.flights[0].departs_at.split("T")[1];
    getHotelPrices(arrival, depart, data.results[loadMore].fare.total_price);

  });
}



function getHotelPrices(arrival, depart, airfare){
    
  var beginURL = "https://api.sandbox.amadeus.com/v1.2/hotels/search-airport?apikey=NNd0iA0mK7NWdWJreIepC8Heb41azLry";
   // &location=BOS&check_in=2016-11-15&check_out=2016-11-16&number_of_results=5"
  var URL = beginURL + "&location=" + destination + "&check_in=" + arrival + "&check_out=" + depart +"&number_of_results=5";
  
  
  $.getJSON(URL, function(data) {
    console.log(data);
    if(data.results.length != 0){
    console.log(data.results[loadMore].total_price.amount);
    var message = "Here is the cheapest hotel fitting your criteria: $" + data.results[loadMore].total_price.amount;
    sendMessage(message);
    var totalPrice = parseFloat(airfare) + parseFloat(data.results[loadMore].total_price.amount);
    message = "Flight and Hotel expenses add up to $" + totalPrice.toFixed(2);
    sendMessage(message);
    message = "Do you want to load more results?"
    sendMessage(message);
    }
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