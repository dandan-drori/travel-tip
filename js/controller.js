'use strict'

import { mapService } from './services/map-service.js'
import { storageService } from './services/storage-service.js'
import { weatherService } from './services/weather-service.js'
import { geocodeService } from './services/geocode-service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGoToLocation = onGoToLocation
window.onDeleteLocation = onDeleteLocation

function onInit() {
	// <-- weather -->
	// FIXME: get query from location input
	geocodeService.getGeocode('Tokyo').then(res => console.log(res))
	// FIXME: get coords from map service
	const coords = { lat: 31.11, lon: 31.11 }
	weatherService.getWeather(coords.lat, coords.lon, 'default').then(location => {
		const { name, country, icon, description, wind, temp, max, min } = location
		const baseIconURL = 'http://openweathermap.org/img/wn/'
		const iconURL = `${baseIconURL}${icon}@2x.png`
		const strHtml = `
            <section>
                <img src="${iconURL}"/>
                <article>
                    <span>${name}, ${country}</span>
                    <span>${description}</span>
                </article>
                <article>
                    <span>${temp}&deg;C</span>
                    <span>temperature from ${min} to ${max} &deg;C,</span> 
                    <span>wind ${wind} m/s.</span>
                </article>
            </section>
        `
		document.querySelector('.weather-container').innerHTML = strHtml
	})
	// <-- map -->
	mapService
		.initMap()
		// onGetLocs()
		.then(() => {
			// console.log('Map is ready')
		})
		.catch(() => console.log('Error: cannot init map'))
}

function onAddMarker() {
	const pos = mapService.getPos()
	mapService.addMarker(pos)
}

function onGetLocs() {
	locService.getLocs().then(locs => {
		console.log('Locations:', locs)
		document.querySelector('.locs').innerText = JSON.stringify(locs)
	})
}

function getPosition() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	})
}

function onGetUserPos() {
	getPosition()
		.then(pos => {
			mapService.panTo(pos.coords.latitude, pos.coords.longitude)
		})
		.catch(err => {
			console.log('err!!!', err)
		})
}

function onPanTo() {
	console.log('Panning the Map')
	mapService.panTo(35.6895, 139.6917)
}

onRenderLocations()
function onRenderLocations() {
	const elTbody = document.querySelector('tbody');
	// const location = prompt('name?')
	// const locations = gLocation?
	const location = 'name'
	for (let i = 0; i < 5; i++) {
		const strHtml = `
		<tr>
		<td>${location}</td>
		<td>
		<button onclick="onGoToLocation('{lat:31,lng:31}')">Go</button>
		<button onclick="onDeleteLocation('id')">Delete</button>
		</td>
		</tr>
		`
		elTbody.innerHTML += strHtml
	}
}

function onGoToLocation(location) {
	console.log('go to', location);
}
function onDeleteLocation(id) {
	console.log('delete location by', id);
}
