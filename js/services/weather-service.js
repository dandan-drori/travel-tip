import { storageService } from './storage-service.js'
const baseURL = `http://api.openweathermap.org/data/2.5/weather?`
const W_KEY = 'd37174a5c4a04cb28f8c8ce1956f2037'
const WEATHER_KEY = 'weather'
var gWeather = storageService.load(WEATHER_KEY) || {}

export const weatherService = {
	getWeather,
}

function getWeather(lat, lon, locationName = 'default') {
	const isInStorage = checkIfInStorage(locationName)
	if (!Object.keys(gWeather).length || !isInStorage) {
		const url = `${baseURL}lat=${lat}&lon=${lon}&APPID=${W_KEY}&units=metric`
		return fetch(url)
			.then(res => res.json())
			.then(data => {
				const weatherData = {
					name: locationName,
					icon: data.weather[0].icon,
					country: data.sys.country,
					description: data.weather[0].description,
					temp: data.main.temp,
					min: data.main.temp_min,
					max: data.main.temp_max,
					wind: data.wind.speed,
				}
				gWeather[locationName] = weatherData
				storageService.save(WEATHER_KEY, gWeather)
				return weatherData
			})
	}
	console.log('got weather from cache')
	return Promise.resolve(gWeather[locationName])
}

function checkIfInStorage(locationName) {
	for (const key in gWeather) {
		if (key === locationName) {
			return true
		}
	}
	return false
}
