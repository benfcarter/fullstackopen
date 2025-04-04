import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY

const SearchBox = ({ value, onChange }) => {
  return (
    <>
      find countries <input value={value} onChange={onChange} />
    </>
  )
}

const CountryInfoEntry = ({ match, onShowCountry }) => {
  return (
    <div>{match.name.common} <button onClick={onShowCountry(match)}>Show</button> </div>
  )
}

const SingleCountryWeatherData = ({ countryInfo }) => {
  const [weatherData, setWeatherData] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)

  if(selectedCountry != countryInfo) {
    setSelectedCountry(countryInfo)
  }

  useEffect(() => {
    if(selectedCountry !== null) {
      weatherService.getCurrentConditions(selectedCountry.capital, selectedCountry.ccn3, weatherApiKey)
      .then(data => setWeatherData(data))
    }
  }, [selectedCountry])

  if(weatherData === null) {
    return (
      <div>Fetching weather data...</div>
    ) 
  }

  return (
    <>
      <div>Temperature: {weatherData.main.temp} F</div>
      <div><img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} /></div>
      <div>Wind {weatherData.wind.speed} mph</div>
    </>
  )
}

const SingleVerboseCountryInfo = ({ match }) => {
  return (
    <>
      <h1>{match.name.common}</h1>
      <div>Capital {match.capital}</div>
      <div>Area {match.area}</div>
      <h2>Languages</h2>
      <ul >
        {Object.values(match.languages).map(x => <li key={x}>{x}</li>)}
      </ul>
      <img src={match.flags.png} alt={match.flags.alt} />
      <h2>Weather in {match.capital}</h2>
      <SingleCountryWeatherData countryInfo={match} />
    </>
  )
}

const CountryInfo = ({ matches, onShowCountry }) => {
  if(matches.length > 10) {
    return (
      <>
        Too many matches, specify another filter
      </>
    )
  } else if(matches.length === 0) {
    return (
      <>
        No countries match
      </>
    )
  } else if(matches.length > 1) {
    return (
      <>
        {matches.map(match => <CountryInfoEntry key={match.ccn3} match={match} onShowCountry={onShowCountry} />)}
      </>
    )
  } else {
    return (
      <>
        <SingleVerboseCountryInfo match={matches[0]} />
      </>
    )
  }
}

const App = () => {
  const [countryFilter, setCountryFilter] = useState('')
  const [countryData, setCountryData] = useState(null)

  const onCountryFilterChange = (event) => {
    setCountryFilter(event.target.value)
  }

  const getMatches = () => {
    if(countryData === null) {
      return []
    }

    if(countryFilter === '') {
      return []
    }

    return countryData.filter(x => x.name.common.toUpperCase().includes(countryFilter.toUpperCase()))
  }

  const selectCountry = (countryInfo) => {
    return (() => setCountryFilter(countryInfo.name.common))
  }

  useEffect(() => {
    countryService.getAll()
    .then(data => setCountryData(data))
  }, [])

  if (countryData === null) {
    return (
      <div>Loading country data...</div>
    )
  }

  return (
    <>
      <div><SearchBox value={countryFilter} onChange={onCountryFilterChange} /></div>
      <div><CountryInfo matches={getMatches()} onShowCountry={selectCountry} /></div>
    </>
  )
}

export default App