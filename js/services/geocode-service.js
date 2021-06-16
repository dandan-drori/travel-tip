import { storageService } from './storage-service.js'

export const geocodeService = {
	getGeocode,
}

const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='
const apiKey = '&key=AIzaSyAiRrtdr43yR0RnPf3j9N-telgAqwwd2Bk&map_ids=25c4971063e3a54'
const GEOCODE_KEY = 'geocode'
const gGeocodes = storageService.load(GEOCODE_KEY) || {}

function getGeocode(query) {
	if (!Object.keys(gGeocodes).length || !gGeocodes[query]) {
		const url = `${baseURL}${query}${apiKey}`
		return fetch(url)
			.then(res => res.json())
			.then(data => {
				if (!data.results.length) return Promise.reject(null)
				gGeocodes[query] = data.results[0].geometry.location
				storageService.save(GEOCODE_KEY, gGeocodes)
				return gGeocodes[query]
			})
	}
	return Promise.resolve(gGeocodes[query])
}
