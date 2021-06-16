const baseURL = `http://api.openweathermap.org/data/2.5/weather?`
const W_KEY = 'd37174a5c4a04cb28f8c8ce1956f2037'

export function getWeather(lat, lon) {
	const url = `${baseURL}lat=${lat}&lon=${lon}&APPID=${W_KEY}`
	fetch(url)
		.then(res => res.json())
		.then(data => console.log(data))
}
