import { storageService } from './storage-service.js'
import { utilService } from './util-service.js'

export const locationService = {
	getLocations,
	addLocation,
	getLocationByName,
	getLocationByCoords,
	removeLocationById,
}

const LOCATIONS_KEY = 'locations'
var gLocations = storageService.load(LOCATIONS_KEY) || []

function getLocations() {
	return Promise.resolve(gLocations)
}

function getLocationByName(name) {
	gLocations = storageService.load(LOCATIONS_KEY) || []
	return gLocations.find(location => location.name === name)
}

function getLocationByCoords(lat, lng) {
	gLocations = storageService.load(LOCATIONS_KEY) || []
	return gLocations.find(location => location.lat === lat && location.lng === lng)
}

function addLocation(name, lat, lng, weather, updatedAt) {
	if (getLocationByName(name)) return
	if (getLocationByCoords(lat, lng)) return
	const id = utilService.makeId()
	const createdAt = Date.now()
	if (!updatedAt) updatedAt = createdAt
	const newLocation = {
		id,
		name,
		lat,
		lng,
		weather,
		createdAt,
		updatedAt,
	}
	gLocations = storageService.load(LOCATIONS_KEY) || []
	gLocations.push(newLocation)
	storageService.save(LOCATIONS_KEY, gLocations)
}

function removeLocationById(id) {
	gLocations = storageService.load(LOCATIONS_KEY) || []
	const idx = gLocations.findIndex(location => location.id === id)
	gLocations.splice(idx, 1)
	storageService.save(LOCATIONS_KEY, gLocations)
}
