"use strict";


var mapOptions = {
    zoom: 10,

    center: {
        lat: 29.716131,
        lng: -95.388718
    }
};

var mapCanvas = document.getElementById('map-canvas');
var map = new google.maps.Map(mapCanvas, mapOptions);

var geocoder = new google.maps.Geocoder();
var markers = [];
var unvisitedRestaurants;

function callback(results, status, restaurant) {

    if (status === google.maps.GeocoderStatus.OK) {

        var marker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP
        });

        markers.push(marker);

        var infoWindow = new google.maps.InfoWindow({
            content: restaurant.name
        });

        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        });

    } else {
        alert("Geocoding was not successful - STATUS: " + status);
    }
}

function getRestaurants() {
    return fetch('http://localhost:3000/restaurants')
        .then(response => response.json());
    // .then((restaurants) => {
        //     unvisitedRestaurants = restaurants.filter(restaurant => restaurant.been === false);
        //     console.log(unvisitedRestaurants);
        // })
}


// function mapRestaurants() {
//     getRestaurants()
//         .then((restaurants) => {
//             restaurants.forEach((restaurant) => {
//                 geocoder.geocode({address : restaurant.address}, function (results, status) {
//                     console.log(restaurant);
//                     callback(results, status, restaurant);
//                 })
//             })
//         })
// }

function mapRestaurant (restaurant) {
    geocoder.geocode({address: restaurant.address}, function (results, status) {
        console.log(restaurant);
        callback(results, status, restaurant);
    });
}

function setMapOnAll(map){
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
function clearMarkers() {
    setMapOnAll(null)
}



$('#pickRandomRestaurant').on('click', function pickRandomRestaurant() {
    var pickedRestaurant;
    clearMarkers();
    getRestaurants()
        .then((restaurants) => {
            let randomNumber = Math.floor((Math.random() * restaurants.length) + 1);
            console.log(randomNumber);
            pickedRestaurant = restaurants[randomNumber];
            $('#restaurant-name').html("Sweet Tomatoes").addClass('sweetTomatoes');
            setTimeout(function () {
                $('#restaurant-name').html("Just kidding, it's: <br>" + pickedRestaurant.name).removeClass('sweetTomatoes');
            } , 1200);
            $('#select-button').html(
                `<button id="select-restaurant" class="btn btn-success">I want to eat here</button>`
            );
            $('#select-restaurant').on('click', function changeRestaurantStatus(){
                if (pickedRestaurant.been === false) {
                    pickedRestaurant.been = true;
                }
                console.log(pickedRestaurant.been);
            });
            mapRestaurant(pickedRestaurant);
        });

});







