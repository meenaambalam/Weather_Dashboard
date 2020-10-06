$(document).ready(function(){

     //get current date from Moment.js
     var momentDateString = moment().toString();
     var momentDate = moment().toDate();
     var unix_timestamp = 1601848935;
     var date = new Date(1601848935 * 1000);
     var hours = date.getHours();
     var minutes = "0" + date.getMinutes();
     var seconds = "0" + date.getSeconds();
     var cityArray = [];
 
     console.log("date: " + date + " hours: " + hours + " minutes: " + minutes + " seconds: " + seconds);
     //console.log(momentDateString);
     //console.log(momentDate);
 

    function addCityButton(){
        var ctyButton;
        $(".cityBtns").remove(); //delete all the button elements
        
        for (var i = 0; i < cityArray.length; i++) {
            console.log("cityArray Length: " + cityArray.length);
            ctyButton = $("<input type='button'>");
            //ctyButton = $("<button>");
            ctyButton.addClass("cityBtns");
            ctyButton.text(cityArray[i]);
            ctyButton.attr("value",cityArray[i]);
            $(".srchdCityLst").prepend(ctyButton);      
        }
    }

    // Function definition to add new City Button when user selects a city to lookup the weather
    function checkCityArray(cityName){

        cityArray.push(cityName);

        // var indexCityArray = cityArray.indexOf(cityName);
        // console.log(" 1: " + "cityArray: " + cityArray + " index: " + indexCityArray);
        // //If the city searched is already in the button array list, remove it
        // if (indexCityArray >=0 ) {
        //     cityArray.splice(indexCityArray,1);
        //     console.log(" 2: " + "cityArray: " + cityArray + " index: " + indexCityArray);
        // }
        // cityArray.push(cityName); //push search city to Array as the last item
        console.log(" 3: " + "cityArray: " + cityArray);
        addCityButton();
    }

   

    /*Everytime a city is searched, create the button and prepend to the button list
      Also pull the weather informaiton of the current date and 5 days forecast and display.
      When the user clicks on any of the older city buttons, it also should pull the information fro.
      Weather API and display in the appropriate widgets.
    */

    //Ajax function call to get 5 day forecast weather */
    function ajax_fiveDayForecast(cityName){
        /* 5 day forecast weather */
        //API_Key = "6b4ab0fdec08806ec39ecd7e60892ebc";
        API_Key = "322def8db829f38bd0bfe5fffb4ad1e9";
        //var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +cityName + "&appid=" + API_Key + "&units=Imperial";
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + API_Key + "&units=Imperial";
        
        //   https://api.openweathermap.org/data/2.5/forecast?q=eagan&appid=322def8db829f38bd0bfe5fffb4ad1e9&units=Imperial

        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response){
                var dayCounter = 0;
                for (let i = 0; i < response.list.length; i++) {     //response counter - note: the resposne has forecast for every 3 hours. We only want one per day.
          
                    forecastDateTime = (response.list[i].dt_txt).split(" ");
                    forecastDate = forecastDateTime[0];
                    forecastTime = forecastDateTime[1];
                    if (forecastTime == "00:00:00") {
                    //console.log("i: " + i + " daycounter: " + dayCounter);

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

    //Get UVIndex
    function UVIndexCalc(lat, lon){
        API_Key = "79e0cca66be57e320215eb8503d62db2";

        queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + API_Key;
                
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            
            var uvIndx = response.value;
            $("#uvindex0").text("UV Index: " + uvIndx);

            if (uvIndx > 10) {
                $("#uvindxDisp").addClass("unIndxXtrm");
            } else if (uvIndx > 7){
                $("#uvindxDisp").addClass("unIndxVHigh");
            } else if (uvIndx > 5){
                $("#uvindxDisp").addClass("unIndxHigh");
            } else if (uvIndx > 2){
                $("#uviuvindxDispndx").addClass("unIndxMed");
            } else {
                $("#uvindxDisp").addClass("unIndxLow");
            }
            //$("#uvindxDisp").value(uvIndx);
        })
    }

    // Function definition of the AJAX call to Weatehr API to get weather of a particular city
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
            var forecastDateTime = (response.dt);
            var forecastDate = forecastDateTime;
            var weatherIcon = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
            console.log("forecast date: " + forecastDate);
            $("#city0").text(response.name);
            $("#date0").text("(" + forecastDate + ")");
            $("#icon0").attr("src", weatherIcon);
            $("#icon0").attr("alt", response.weather[0].description);
            $("#temp0").text("Temperature: " + response.main.temp);
            $("#humid0").text("Humidity: " + response.main.humidity);
            $("#wind0").text("Wind Speed: " + response.wind.speed);
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            alert("lat: " + response.coord.lat + " lon: " + response.coord.lon);

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