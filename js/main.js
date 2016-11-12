$(document).ready(function(){ // start js once document loads
  var origin = "SFO"
  var destination = "LAX"
  var departure = "2016-11-25"
  var returnBy = "2016-12-1T23%3A59"
  var adults = 1
  var children = 0
  var max_price = 500000
  var numberResults = 5
 
  var beginURL = "https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search/v1.2/flights/low-fare-search?apikey=NNd0iA0mK7NWdWJreIepC8Heb41azLry"
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