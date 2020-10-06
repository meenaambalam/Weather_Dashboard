$(document).ready(function(){

    var cityArray = [];
  
    //Function to dynamically delete all buttons and add new ones based on values in array
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

    // Function definition to add new City Button when user selects a city to lookup the weather
    function checkCityArray(cityName){
        cityArray.push(cityName);
        console.log(" 3: " + "cityArray: " + cityArray);
        addCityButton(cityName);
    }

   
    //Ajax function call to get 5 day forecast weather */
    function ajax_fiveDayForecast(cityName){
        /* 5 day forecast weather */
        //API_Key = "6b4ab0fdec08806ec39ecd7e60892ebc";
        API_Key = "322def8db829f38bd0bfe5fffb4ad1e9";

        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + API_Key + "&units=Imperial";
        
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response){
                var dayCounter = 1;
                var forecastDispDt;
                var dateDisp;

                for (let i = 0; i < response.list.length; i++) {     //response counter - note: the resposne has forecast for every 3 hours. We only want one per day.
          
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
                    if (dayCounter > 6) {
                        break;
                    }
                }
        })
    }    

    //Get UVIndex from OpenWeather API
    function UVIndexCalc(lat, lon){
        API_Key = "79e0cca66be57e320215eb8503d62db2";

        queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + API_Key;
                
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            
            var uvIndx = response.value;

            $("#uvIndxDisp").removeClass();

            if (uvIndx > 10) {
                $("#uvIndxDisp").addClass("uvIndx10");
                alert(">10) unindx: " + uvIndx);
            } else if (uvIndx > 7){
                $("#uvIndxDisp").addClass("uvIndx7");
                alert(">7 unindx: " + uvIndx);
            } else if (uvIndx > 5){
                $("#uvIndxDisp").addClass("uvIndx5");
                alert(">5 unindx: " + uvIndx);
            } else if (uvIndx > 2){
                $("#uvIndxDisp").addClass("uvIndx2");
                alert(">2 unindx: " + uvIndx);
            } else {
                $("#uvIndxDisp").addClass("uvIndxLess2");
                alert("<2) unindx: " + uvIndx);
            }
            $("#uvIndxDisp").attr("value", uvIndx);

        })
    }

    //AJAX call to get the Current Weather information from OpenWeather API for a particular City
    //Unit Imperial gets the temperature in Fareheit unit
    function ajax_citySrch(cityName){
        //API_Key = "6b4ab0fdec08806ec39ecd7e60892ebc";
        API_Key = "79e0cca66be57e320215eb8503d62db2";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +cityName + "&appid=" + API_Key + "&units=Imperial";
        //var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + API_Key + "&units=Imperial";
        //https://api.openweathermap.org/data/2.5/weather?q=eagan&appid=6b4ab0fdec08806ec39ecd7e60892ebc&units=Imperial
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            var results = response;

            /* Current day Weather */
            var forecastDateTime = response.dt;
            var forecastDate = new Date(forecastDateTime * 1000).toLocaleDateString();
            alert("forecastDate: " + forecastDate);

            //var forecastDate = moment(forecastDateTime).format('MM/DD/YYYY');
            var weatherIcon = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
            console.log("forecast date: " + forecastDate);
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
           
            checkCityArray(cityName);
        })
    }
    
    

    // Functionality to capture the Search Button Onclick event. 
    //The behavior when onclick is to call weather API and create dynamic city buttons and display the 5 days of forecast.
    $(".citySrchBtn").on("click", function(){
        var cityName = $(".citySrch").val();

        if (cityName == ""){
            alert("Please enter a city name");
        }
        else {
            ajax_citySrch(cityName);
        }
    })

    $(document).on("click",'.cityBtns', function(event){
        alert("cityBtn clicked");
        alert($(event.target).val());

        //event.stopPropagation();
        //event.preventDefault();    

        cityName = $(event.target).val();

        $(".citySrch").val(cityName);
        ajax_citySrch(cityName);
    })

    /*
    $(".cityBtns").on("click",function(){
        alert("cityBtn clicked");
        cityName = $(this).value;

        console("clicked text: " + cityName);
        $(".citySrch").val(cityName);
        ajax_citySrch(cityName);
    })*/

})