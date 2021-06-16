import { storageService } from './storage-service.js'
import { utilService } from './util-service.js'

export const locationService = {
	getLocations,
	addLocation,
	getLocationByName,
	getLocationByCoords,
}

const LOCATIONS_KEY = 'locations'
const gLocations = storageService.load(LOCATIONS_KEY) || []

function getLocations() {
	return Promise.resolve(gLocations)
}

function getLocationByName(name) {
	return gLocations.find(location => location.name === name)
}

function getLocationByCoords(lat, lng) {
	return gLocations.find(location => location.lat === lat && location.lng === lng)
}

function addLocation(id, name, lat, lng, weather, createdAt, updatedAt) {
	if (!id) id = utilService.makeId()
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
