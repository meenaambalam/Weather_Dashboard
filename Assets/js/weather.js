$(document).ready(function(){

    //get current date from Moment.js
    var momentDateString = moment().toString();
    var momentDate = moment().toDate();
    var unix_timestamp = 1601848935;
    var date = new Date(1601848935 * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();

    console.log("date: " + date + " hours: " + hours + " minutes: " + minutes + " seconds: " + seconds);
    //console.log(momentDateString);
    //console.log(momentDate);


    /*Everytime a city is searched, create the button and prepend to the button list
      Also pull the weather informaiton of the current date and 5 days forecast and display.
      When the user clicks on any of the older city buttons, it also should pull the information fro.
      Weather API and display in the appropriate widgets.
    */

    // Function definition of the AJAX call to Weatehr API to get weather of a particular city
    //Unit Imperial gets the temperature in Fareheit unit
    function ajax_citySrch(cityName){
        API_Key = "6b4ab0fdec08806ec39ecd7e60892ebc";
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + API_Key + "&units=Imperial";


        //console.log("queryURL: " + queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            var results = response;

            /*response.list - array with many info
              response.list[0].dt_txt =  current date format 2020-10-03 21:00:00
              response.list[0].main.temp (unit in Kelvin and need to be changed to Fareheit)
              response.list[0].main.humidity
              response.list[0].weather.icon
              response.list[0].weather.main & descirption give descriptgion og weather
              response.list[0].wind.speed
              response.city.name*/
            /* Current day Weather */
            i=0;
            var forecastDateTime = (response.list[i].dt_txt).split(" ");
            var forecastDate = forecastDateTime[0];
            var forecastTime = forecastDateTime[1];
            var weatherIcon = "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png";
            console.log("forecast date: " + forecastDate);
            $("#date" + i).text(response.city.name + "(" + forecastDate + ")");
            $("#icon" + i).attr("src", weatherIcon);
            $("#icon" + i).attr("alt", response.list[i].weather[0].description);
            $("#temp" + i).text("Temperature: " + response.list[i].main.temp);
            $("#humid" + i).text("Humidity: " + response.list[i].main.humidity);
            $("#wind" + i).text("Wind Speed: " + response.list[i].wind.speed);
            $("#uvindex" + i).text("UV Index: ");

            /* 5 day forecast weather */
            var dayCounter = 1;
            for (let i = 1; i < response.list.length; i++) {     //response counter - note: the resposne has forecast for every 3 hours. We only want one per day.
              
                forecastDateTime = (response.list[i].dt_txt).split(" ");
                forecastDate = forecastDateTime[0];
                forecastTime = forecastDateTime[1];
                if (forecastTime == "00:00:00") {
                    console.log("i: " + i + " daycounter: " + dayCounter);

                    weatherIcon = "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png";
                    $("#date" + dayCounter).text(forecastDate);
                    $("#icon" + dayCounter).attr("src", weatherIcon);
                    $("#icon" + dayCounter).attr("alt", response.list[i].weather[0].description);
                    $("#temp" + dayCounter).text("Temp: " + response.list[i].main.temp);
                    $("#humid" + dayCounter).text("Humidity: " + response.list[i].main.humidity);
                    dayCounter++;
                }
                if (dayCounter > 6) {
                    break;
                }
            }           
        })

    }
    
    // Function definition to add new City Button when user selects a city to lookup the weather
    function addCityBtn(){

    }

    // Functionality to capture the Search Button Onclick event. 
    //The behavior when onclick is to call weather API and create dynamic city buttons and display the 5 days of forecast.
    $(".citySrchBtn").on("click", function(){
        var cityName = $(".citySrch").val();
        if (cityName == ""){
            alert("Please enter a city name");
        }
        else {
            addCityBtn();
            ajax_citySrch(cityName);
        }
    })

})