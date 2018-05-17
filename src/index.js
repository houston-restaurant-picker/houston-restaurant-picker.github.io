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

function callback(results, status, restaurant) {

    if (status === google.maps.GeocoderStatus.OK) {

        var marker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP
        });

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
}

function mapRestaurants() {
    getRestaurants()
        .then((restaurants) => {
            restaurants.forEach((restaurant) => {
                geocoder.geocode({address : restaurant.address}, function (results, status) {
                    console.log(restaurant);
                    callback(results, status, restaurant);
                })
            })
        })
}

function mapRestaurant (restaurant) {
    geocoder.geocode({address: restaurant.address}, function (results, status) {
        console.log(restaurant);
        callback(results, status, restaurant);
    });
}

$('#pickRandomRestaurant').on('click', function pickRandomRestaurant() {

    getRestaurants()
        .then((restaurants) => {
            let randomNumber = Math.floor((Math.random() * restaurants.length) + 1);
            console.log(randomNumber);
            let pickedRestaurant = restaurants[randomNumber];
            mapRestaurant(pickedRestaurant);
        })
});



