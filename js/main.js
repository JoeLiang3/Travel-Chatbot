$(document).ready(function(){ // start js once document loads
  $.getJSON("https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search/v1.2/flights/low-fare-search?apikey=NNd0iA0mK7NWdWJreIepC8Heb41azLry&origin=BOS&destination=LON&departure_date=2016-11-25&return_by=2016-12-1T16%3A00&adults=1&children=1&infants=1&max_price=50000&number_of_results=5 HTTP/1.1", function(data) {
    console.log(data);
    console.log(data.results[1].fare.total_price);
    for (var i = 0; i < data.results.length; i++){
      console.log(data.results[i].fare.total_price);
    }
  });
});