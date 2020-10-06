$(document).ready(function(){

    var cityArray = [];
    var API_Key;
    var APIKeyFlag = false;
    
    // Function definition to run at the time of Application/Page
    
    function run_onload(){

        //Get APIKey from local storage at the time of the load
        //If it is not available, alert user to enter and save an APIKey
        if (localStorage.getItem("Weather_APIKey") !== null) {
            API_Key = localStorage.getItem("Weather_APIKey");
            APIKeyFlag = true;
        } else{
            alert("Please enter and save your OpenWeather APIKey first time you use this Application");
        }
        
        // Pull searched history from local history if any

        if (localStorage.getItem("Weather_cityArray") !== null) {
            cityArray = JSON.parse(localStorage.getItem("Weather_cityArray"));
            for ( var i = 0; i < cityArray.length ; i++) {
                    addCityButton(cityArray[i]);
            }
            var lastCitySrched = cityArray[cityArray.length-1];
            $(".citySrch").val(cityArray[cityArray.length-1]);
            ajax_citySrch(lastCitySrched);
        }

    }
 
    // Invoke the page load function - Load the prioir searched city forecast
    run_onload();

  
    //Function to dynamically add the Citities as they get searched. The full set of buttons are removed and rebuilt everytime a new city is searched
    function addCityButton(cityName){
        var ctyButton;
        $(".cityBtns").remove(); //delete all the button elements
        
        for (var i = 0; i < cityArray.length; i++) {
            console.log("cityArray Length: " + cityArray.length);
            ctyButton = $("<input type='button'>");
            ctyButton.addClass("cityBtns");
            ctyButton.text(cityArray[i]);
            ctyButton.attr("value",cityArray[i]);
            $(".srchdCityLst").prepend(ctyButton);    
        }
         
    } 

    // Function definition to add new City to the Array when a new search is made. The searched city is added to the local storage as well
    function checkCityArray(cityName){
        cityArray.push(cityName);
        localStorage.setItem("Weather_cityArray", JSON.stringify(cityArray));
    }

   
    //Get 5 day weather forecast for the searched city
    function ajax_fiveDayForecast(cityName){
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + API_Key + "&units=Imperial";
        
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response){
                var dayCounter = 1;
                var forecastDispDt;
                var dateDisp;
                //i - response counter - note: the response has forecast for every 3 hours. We only want one per day.
                for (let i = 0; i < response.list.length; i++) { 
          
                    forecastDateTime = (response.list[i].dt_txt).split(" ");
                    forecastDate = forecastDateTime[0];
                    forecastTime = forecastDateTime[1];
                    if (forecastTime == "12:00:00") {
                        forecastDispDt = response.list[i].dt;
                        dateDisp = new Date(forecastDispDt * 1000).toLocaleDateString();
                        weatherIcon = "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png";
                        $("#date" + dayCounter).text(dateDisp);
                        $("#icon" + dayCounter).attr("src", weatherIcon);
                        $("#icon" + dayCounter).attr("alt", response.list[i].weather[0].description);
                        $("#temp" + dayCounter).text("Temp: " + response.list[i].main.temp + " F");
                        $("#humid" + dayCounter).text("Humidity: " + response.list[i].main.humidity + "%");
                        dayCounter++;
                    }
                    if (dayCounter >= 6) {
                        break;
                    }
                }
        })
    }    

    //Get UVIndex  for the specific lat and lon - from OpenWeather API
    function UVIndexCalc(lat, lon){
        queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + API_Key;
                
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            
            var uvIndx = response.value;

            $("#uvIndxDisp").removeClass();

            if (uvIndx > 10) {
                $("#uvIndxDisp").addClass("uvIndx10");
            } else if (uvIndx > 7){
                $("#uvIndxDisp").addClass("uvIndx7");
            } else if (uvIndx > 5){
                $("#uvIndxDisp").addClass("uvIndx5");
            } else if (uvIndx > 2){
                $("#uvIndxDisp").addClass("uvIndx2");
            } else {
                $("#uvIndxDisp").addClass("uvIndxLess2");
            }
            $("#uvIndxDisp").attr("value", uvIndx);

        })
    }

    //Get current weather information from OpenWeather Public API for the searched City
    //Unit Imperial gets the temperature in Fareheit unit
    //Only rebuild the searched city buttons when the city is Searched. 
    //When the city is selected from previously searched list, rebuilding of the srched city buttons are not built

    function ajax_citySrch(cityName, newSearch){
        var cityFoundFlag = false;
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +cityName + "&appid=" + API_Key + "&units=Imperial";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            var forecastDateTime = response.dt;
            var forecastDate = new Date(forecastDateTime * 1000).toLocaleDateString();
            var weatherIcon = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";

            $("#city0").text(response.name);
            $("#date0").text("(" + forecastDate + ")");
            $("#icon0").attr("src", weatherIcon);
            $("#icon0").attr("alt", response.weather[0].description);
            $("#temp0").text("Temperature: " + response.main.temp + " F");
            $("#humid0").text("Humidity: " + response.main.humidity + "%");
            $("#wind0").text("Wind Speed: " + response.wind.speed + " MPH");
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            UVIndexCalc(lat, lon);

            /* 5 day forecast weather */
            ajax_fiveDayForecast(cityName); 
            cityFoundFlag = true; 
            if (cityFoundFlag &&  newSearch){   //When the city response is returned by API and when it is a search done through search option
                checkCityArray(cityName);       //rebuild the array
                addCityButton(cityName);        //rebuild the searched city buttons
            } 

        })
    }
  

    //Functionality to capture the Search Button Onclick event. 
    //The behavior when onclick is to call weather API and create dynamic city buttons and display the 5 days of forecast.
    $(".citySrchBtn").on("click", function(){
        var cityName = $(".citySrch").val();

        if (cityName == ""){
            alert("Please enter a city name");
        }
        else {
            var newSearch = true;
            if (APIKeyFlag){
                ajax_citySrch(cityName, newSearch);
            }
            else{
                alert("Please enter and save OpenWeather API Key the first time you use this application");
            }
            //ajax_citySrch(cityName, newSearch);
        }
    })

    // When the previously searched city "button" is clicked, the daily and 5 day forecast of that city should be captured from webAPI and displayed
    $(document).on("click",'.cityBtns', function(event){
        //event.stopPropagation();
        //event.preventDefault();    
        newSearch = false;
        cityName = $(event.target).val();

        $(".citySrch").val(cityName);
        ajax_citySrch(cityName, newSearch);
    })

    $(".saveAPIBtn").on("click", function(){

        if ($(".APIKey").val() === ""){
            alert ("API Key is empty");
        } else {
            API_Key = $(".APIKey").val();
            localStorage.setItem("Weather_APIKey", API_Key);
            APIKeyFlag = true;
            alert ("API Key is saved locally");
            $(".APIKey").val("");
        }
    })


})