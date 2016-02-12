/*Importing modules*/
var express = require('express');
var app = express();
var http = require('http');
var appPort = 8080


/*Set header settings*/
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

/*listen at port 8080*/
app.listen(appPort);

/*Send the entire list of Communitys*/
app.get('/', function (req, res) {
    res.sendfile('./views/index.html');
});


/*send the current product by the user id*/
app.get('/api/community/:id', function (req, res) {

    var id = req.params.id;


    var data = getCommunityById(id);

    res.send(data);
});

app.get('/api/community', function (req, res) {

    var data = getCommunityList();

    res.send(data);
});


/*send the current product by location*/
app.get('/api/community/byLocation/:latitude/:longitud', function (req, res) {

    var latitude = parseFloat(req.params.latitude);
    var longitud = parseFloat(req.params.longitud);

    var data = getCommunityByLocation(latitude, longitud);

    //res.send('latitude:' + latitude + '-longitud:' + longitud);
    res.send(data);
});


console.log('Mock API Service running on port ' + appPort + ' (http://localhost:' + appPort +')');              // shoutout to the user


/*searching the Community by id*/
function getCommunityById(id) {

    var fs = require('fs');
    var data = JSON.parse(fs.readFileSync('./data/communities.json', 'utf8'));

    var community = {};

    for (var i = 0; i < data.length; i++) {

        if (data[i].CommunityId == id) {

            community = data[i];

        }
    }

    return community;

}
/*get the entire list of communitys*/
function getCommunityList() {

    var fs = require('fs');
    var data = JSON.parse(fs.readFileSync('./data/communities.json', 'utf8'));

    return data;
}

/*return the latitude and longitude values taking the location and angle params*/

function getLocation(location, angle) {

    var strLocation = location;

    var index = strLocation.indexOf(",");

    if (angle == "latitude") {

        return (strLocation.substr(0, index));


    } else {

        return (strLocation.substr(index + 1));

    }
}

/*get the current community through the latitude and longitude*/
function getCommunityByLocation(latitude, longitude) {
    //maxLatitud = 90
    //maxLongitud = 180
    var fiveMilesLat = 0.0086301;
    var fiveMilesLon = 0.0086301;


    console.log('latitude:' + latitude + ' - longitude:' + longitude)

    //force all coords as positive
    latitude = latitude + 90;
    longitude = longitude + 180;

    console.log('Converted to (180) latitude, (360) longitude')
    console.log('latitude:' + latitude + ' - longitude:' + longitude)
    var fs = require('fs');
    var data = JSON.parse(fs.readFileSync('./data/communities.json', 'utf8'));

    /*this 0.0086301 value represent a distance of 5 miles in 360°*/

    var downDistanceLat = (latitude) - fiveMilesLat;
    var highDistanceLat = (latitude) + fiveMilesLat;
    var downDistanceLong = (longitude) - fiveMilesLon;
    var highDistanceLong = (longitude) + fiveMilesLon;


    console.log('');
    console.log('latitude:' + latitude)
    console.log('downDistanceLat:' + downDistanceLat + ' - highDistanceLat:' + highDistanceLat);
    console.log('');
    console.log('longitude:' + longitude)
    console.log('downDistanceLong:' + downDistanceLong + ' - highDistanceLong:' + highDistanceLong);


    /*search a product range of 5 miles*/

    var community = {};
    var communityList = [];

    var latCommunity;
    var longCommunity;

    for (var i = 0; i < data.length; i++) {

        latCommunity = parseFloat(data[i].Latitud) + 90;
        longCommunity = parseFloat(data[i].Longitude) + 180;
        console.log('latCommunity:' + latCommunity + ' - longCommunity:' + longCommunity);


        if ((downDistanceLat <= latCommunity && highDistanceLat >= latCommunity) && (downDistanceLong <= longCommunity && highDistanceLong >= longCommunity)) {

            community = data[i];
            communityList.push(community);
            console.log("Case 1");

        }

    }

    return communityList;
}
