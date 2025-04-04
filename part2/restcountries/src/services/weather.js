import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getCurrentConditions = (cityName, countryCode, apiKey) => {
    const url = `${baseUrl}?q=${cityName},${countryCode}&appid=${apiKey}&units=imperial`
    console.log(`Getting weather from ${url}`)
    return axios.get(url).then(response => response.data)
}

export default { getCurrentConditions }