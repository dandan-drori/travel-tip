'use strict'

import { mapService } from './services/map-service.js'
import { weatherService } from './services/weather-service.js'
import { geocodeService } from './services/geocode-service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos

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

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
	console.log('Getting Pos')
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	})
}

function onAddMarker() {
	console.log('Adding a marker')
	const pos = mapService.getPos()
	mapService.addMarker(pos)
}

function onGetLocs() {
	locService.getLocs().then(locs => {
		console.log('Locations:', locs)
		document.querySelector('.locs').innerText = JSON.stringify(locs)
	})
}

function onGetUserPos() {
	getPosition()
		.then(pos => {
			console.log('User position is:', pos.coords)
			document.querySelector(
				'.user-pos'
			).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
		})
		.catch(err => {
			console.log('err!!!', err)
		})
}
function onPanTo() {
	console.log('Panning the Map')
	mapService.panTo(35.6895, 139.6917)
}
