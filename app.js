const { log } = require("console");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
const https = require("https");

app.get('/', function (req, res) {
    res.sendFile(__dirname+"/index.html");
  });

// app.post('/', function(req, res){
//     console.log(req.body.City_Name);
//     var latitude;
//     var longitude;
//     const appKey="3138f53859bee65326c3d743e2029020";
//     const City_Name= req.body.City_Name;
//     console.log(City_Name);
//     const geocodeURL = "https://api.openweathermap.org/geo/1.0/direct?q="+City_Name+"&appid="+appKey+"";
//     https.get(geocodeURL, function(resp){
//         resp.on("data", function(data){
//             const locationData=JSON.parse(data);
//             latitude = locationData[0].lat;
//             longitude = locationData[0].lon;
//             console.log(latitude);
//             console.log(longitude);
//         } )
//     })

//     const lat=latitude;
//     const lon=longitude;
//     const units="metric";
//     const url = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units="+units+"&appid="+appKey+"";
//     https.get(url, function(response){
        
//         response.on("data", function(data){

//             const weatherData = JSON.parse(data);
//             const temp = weatherData.main.temp;
//             const icon = weatherData.weather[0].icon;
//             const desc = weatherData.weather[0].description;
//             const iconURL = "https://openweathermap.org/img/wn/"+icon+"@2x.png"; 
//             console.log(weatherData);
//             console.log(temp);
//             console.log(icon);
//             res.write("<h1>The temperature in Italy is currently "+temp+" degrees celsius</h1>");
//             res.write("<p>The weather condition is currently "+desc+"<p>");
//             res.write("<img src="+iconURL+">");
//             res.send();
//         })
//     })
// })

app.post('/', function(req, res){
    const appKey="3138f53859bee65326c3d743e2029020";
    const City_Name= req.body.City_Name;
    console.log(City_Name);
    const geocodeURL = "https://api.openweathermap.org/geo/1.0/direct?q="+City_Name+"&appid="+appKey+"";
    
    https.get(geocodeURL, function(resp){
        let data = '';

        resp.on("data", function(chunk){
            data += chunk;
        });

        resp.on("end", function(){
            const locationData = JSON.parse(data);
            const latitude = locationData[0].lat;
            const longitude = locationData[0].lon;
            const units="metric";
            console.log(latitude);
            console.log(longitude);

            const url = "https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&units="+units+"&appid="+appKey+"";
            
            https.get(url, function(response){
                let weatherData = '';

                response.on("data", function(chunk){
                    weatherData += chunk;
                });

                response.on("end", function(){
                    weatherData = JSON.parse(weatherData);
                    const temp = weatherData.main.temp;
                    const icon = weatherData.weather[0].icon;
                    const desc = weatherData.weather[0].description;
                    const iconURL = "https://openweathermap.org/img/wn/"+icon+"@2x.png"; 
                    console.log(weatherData);
                    console.log(temp);
                    console.log(icon);
                    res.write("<h1>The temperature in "+City_Name+" is currently "+temp+" degrees celsius</h1>");
                    res.write("<p>The weather condition is currently "+desc+"<p>");
                    res.write("<img src="+iconURL+">");
                    res.send();
                });
            });
        });
    });
});




app.listen(3000, function(req, res){
    console.log('Server is running on port 3000');
})