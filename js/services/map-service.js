'use strict'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getPos
}

var gMap;
var gPos;

function initMap(lat = 31, lng = 31) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    // var searchParams = new URLSearchParams(window.location.search);
    // searchParams.set(lat, lng);
    // window.location.search = searchParams.toString();
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                // center: { lat: +params.lat, lng: +params.lng },
                center: { lat, lng },
                zoom: 18,
                mapId: '25c4971063e3a54',
                label: {
                    text: 'Label text',
                },
                gestureHandling: 'cooperative',
                zoomControl: false,
                streetViewControl: false,
            })
            // console.log('Map!', gMap);

            gMap.addListener("click", (mapsMouseEvent) => {
                console.log(mapsMouseEvent);
                gPos = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
                gPos = JSON.parse(gPos)
                console.log(gPos);
            })
        })
        .catch((eror) => console.log(eror))
}
function addMarker(pos) {
    const marker = new google.maps.Marker({
        position: pos,
        map: gMap,
        title: 'Hello World!',
        icon: {
            url: 'https://toppng.com/uploads/thumbnail//blue-map-pin-blue-google-maps-marker-115629322352wmfavf4hh.png',
            scaledSize: new google.maps.Size(30, 50)
        },
        animation: google.maps.Animation.DROP
    });
    return marker;
}


function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyAiRrtdr43yR0RnPf3j9N-telgAqwwd2Bk&map_ids=25c4971063e3a54'
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getPos() {
    return gPos
}

var modal = document.getElementById('myModal')
var elMap = document.getElementById('map')
var span = document.getElementsByClassName('save')[0]
// When the user clicks the button, open the modal
// elMap.onclick = function () {
//     modal.style.display = 'block'
// }

// span.onclick = function () {
//     modal.style.display = 'none'
// }

// get input from user
// span.onclick = function () {
//     modal.style.display = 'none'
// }