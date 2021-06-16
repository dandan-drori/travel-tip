'use strict'

import { mapService } from './services/map-service.js'
import { weatherService } from './services/weather-service.js'
import { geocodeService } from './services/geocode-service.js'
import { locationService } from './services/location-service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGoToLocation = onGoToLocation
window.onDeleteLocation = onDeleteLocation

var gLocationName

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
	onRenderLocations()
}

function onAddMarker() {
	gLocationName = prompt('name?')
	const pos = mapService.getPos()
	weatherService.getWeather(pos.lat, pos.lng, gLocationName).then(weather => {
		locationService.addLocation(gLocationName, pos.lat, pos.lng, weather)
	})
	const currLocation = locationService.getLocationByName(gLocationName)
	onRenderLocations()
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

function onRenderLocations() {
	locationService.getLocations().then(locations => {
		var strHtml = ''
		for (const key in locations) {
			strHtml += `
                <tr>
                    <td>${locations[key].name}</td>
                    <td>
                        <button onclick="onGoToLocation(${locations[key].lat},${locations[key].lng})">Go</button>
                        <button onclick="onDeleteLocation('${locations[key].id}')">Delete</button>
                    </td>
                </tr>
            `
		}
		document.querySelector('tbody').innerHTML = strHtml
	})
}

function onGoToLocation(location) {
	console.log('go to', location)
}
function onDeleteLocation(id) {
	console.log('delete location by', id)
}
