'use strict'
const map;
function initMap(lat, lng) {
    if (!lat) lat = 32.0749831;
    if (!lng) lat = 34.9120554;

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 29.55823779167494, lng: 34.9526631121632 },
        zoom: 18,
        mapId: '25c4971063e3a54',
        label: {
            text: 'Label text',
        },
        gestureHandling: "cooperative",
        zoomControl: false,
        streetViewControl: false,
    });

    new google.maps.Marker({
        position: { lat: 29.55823779167494, lng: 34.9526631121632 },
        map,
        title: 'You Are Here',
        icon: {
            url: 'https://www.partnersmak.com/wp-content/uploads/2015/11/Map-Marker-PNG-Picture.png',
            scaledSize: new google.maps.Size(40, 40)
        },
        animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(map, 'click', (event) => {
        addPlace({ coords: event.latLng });
    });

    function addPlace(place) {
        new google.maps.Marker({
            position: place.coords,
            map,
            title: 'Saved',
            icon: {
                url: 'https://www.partnersmak.com/wp-content/uploads/2015/11/Map-Marker-PNG-Picture.png',
                scaledSize: new google.maps.Size(40, 40)
            },
            animation: google.maps.Animation.DROP
        });

    }
}

function onSetPlace() {
    var currNickname = prompt('Enter nickname');
    var currLocationName = prompt('Enter Location name');
    console.log('currNickname:', currNickname);
    console.log('currLocationName:', currLocationName);
}

function setCurrLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
        new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: position.coords.latitude, lng: position.coords.longitude },
            zoom: 17
        })
    });
}

var modal = document.getElementById("myModal");
var elMap = document.getElementById("map");
var span = document.getElementsByClassName("save")[0];
// When the user clicks the button, open the modal 
elMap.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

// get input from user
span.onclick = function () {
    modal.style.display = "none";
}


