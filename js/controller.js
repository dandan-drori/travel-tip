'use strict'

import { mapService } from './services/map-service.js'
import { weatherService } from './services/weather-service.js'
import { geocodeService } from './services/geocode-service.js'
import { locationService } from './services/location-service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetUserPos = onGetUserPos
window.onGoToLocation = onGoToLocation
window.onDeleteLocation = onDeleteLocation
window.onSearch = onSearch
window.onCopyURL = onCopyURL

var gLocationName

function onInit() {
	// <-- get query string params -->
	const urlSearchParams = new URLSearchParams(window.location.search)
	var coords = Object.fromEntries(urlSearchParams.entries())
	if (!Object.keys(coords).length) coords = { lat: 31, lng: 31 }
	// <-- weather -->
	const location = locationService.getLocationByCoords(coords.lat, coords.lng)
	var locationName
	if (!location || !Object.keys(location).length) locationName = 'default'
	else locationName = location.name
	weatherService.getWeather(coords.lat, coords.lon, locationName).then(weather => {
		locationService.addLocation(locationName, coords.lat, coords.lng, weather)
		displayLocationWeather(weather)
		onRenderLocations()
	})
	// <-- map -->
	mapService
		.initMap()
		.then(() => {
			mapService.panTo(coords.lat, coords.lng)
		})
		.catch(() => console.log('Error: cannot init map'))
	onRenderLocations()
}

function onAddMarker(lat, lng) {
	gLocationName = prompt('name?')
	if (!gLocationName) return
	var pos
	if (!lat || !lng) {
		pos = mapService.getPos()
		lat = pos.lat
		lng = pos.lng
	}
	// <-- set query string params -->
	if ('URLSearchParams' in window) {
		var searchParams = new URLSearchParams(window.location.search)
		searchParams.set('lat', lat)
		searchParams.set('lng', lng)
		var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString()
		history.pushState(null, '', newRelativePathQuery)
	}
	weatherService.getWeather(lat, lng, gLocationName).then(weather => {
		locationService.addLocation(gLocationName, lat, lng, weather)
		displayLocationWeather(weather)
		onRenderLocations()
	})

	const currLocation = locationService.getLocationByName(gLocationName)
	mapService.addMarker({ lat, lng })
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
		// TODO: change for in to map cause its an array
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

function onGoToLocation(lat, lng) {
	mapService.panTo(lat, lng)
}

function onDeleteLocation(id) {
	// TODO: change confirm to modal
	const isReadyToDelete = confirm('This action is irreversible. Are you sure you want to continue?')
	if (!isReadyToDelete) return
	locationService.removeLocationById(id)
	onRenderLocations()
}

function onSearch(query) {
	geocodeService
		.getGeocode(query)
		.then(({ lat, lng }) => {
			mapService.panTo(lat, lng)
			onAddMarker(lat, lng)
		})
		.catch(err => {
			// TODO: change alert to modal
			alert('Error: please enter another location')
		})
}

function displayLocationWeather({ name, description, icon, max, min, temp, wind, country }) {
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
}

function onCopyURL() {
	const url = window.location.href
	const invisibleInput = document.querySelector('.invisible-input')
	invisibleInput.value = url
	invisibleInput.select()
	invisibleInput.setSelectionRange(0, 99999) // for mobile
	document.execCommand('copy')
	// TODO: add "title" - copied url to clipboard
}
