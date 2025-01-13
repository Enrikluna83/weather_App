import { useEffect, useState } from 'react'
import axios from 'axios'
import { FiWind } from 'react-icons/fi';
import { BsClouds } from "react-icons/bs";
import { IoThermometerSharp } from "react-icons/io5";
import './App.scss'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'

const codes = {
  thunderstorm: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
  drizzle: [300, 301, 302, 310, 311, 312, 313, 314, 321],
  rain: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
  snow: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
  atmosphere: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
  clear: [800],
  clouds: [801, 802, 803, 804]
}

const icons = {
  thunderstorm: '⛈ ',
  rain: '🌧',
  drizzle: '🌦',
  snow: '❄',
  atmosphere: '🌫',
  clear: '🌞',
  clouds: '🌤'
}

function App() {
const [coords, setCoords] = useState(null)
const [weather, setWeather] = useState(null)
const [isCelsius, setIsCelsius] = useState(true)
const [error, setError] = useState(null)

  useEffect(() => {
    console.log(navigator.geolocation)
    try {
      navigator.geolocation.getCurrentPosition((res) => {
        console.log(res)
        setCoords({
          lat: res.coords.latitude,
          lon: res.coords.longitude
        })
      }, (err) => {
        console.log(err)
        setError(err.message)
      })  
    } catch (error) {
      console.log('[GEO API]', error)
    }
  }, [])

  useEffect(() => {  
    if(coords) getWeatherData(coords)
  }, [coords])

  const getWeatherData = async ({lat, lon}) => {
    try {
      const res = await axios.get(baseUrl + `lat=${lat}&lon=${lon}&appid=8fc2ce6047d22b5fa1c40bc5700cded0`)
      const codeId = res.data.weather[0].id
      const codeKeys = Object.keys(codes)
      
      setWeather({
        city: res.data.name,
        country: res.data.sys.country,
        temperature: Math.floor(res.data.main.temp - 273.15),
        description: res.data.weather[0]?.description,
        clouds: res.data.clouds.all,
        wind: res.data.wind.speed,
        pressure: res.data.main.pressure,
        icon: icons['codeKeys.find(key => codes[key].includes(codeId)'] || '🌞'
        
      })
    } catch (error) {
      console.log('[WEATHER API]', error)
    }  
  }

  if (error) return (
    <div className='weather'>
      <h1>{erro}</h1>
      <p>Please enable your location to get the weather data.</p>
    </div>
  )
  
  if (!weather) return <h1>Loading...</h1>

  const temp = isCelsius ? weather.temperature + '°C' : weather.temperature * 9 / 5 + 32 + '°F'

  return (
    <div className='weater'>
      <h1 className='weather__title'>Weather App</h1>
      <p className='weather__city'>{weather.city}, {weather.country}</p>
      
      <div className='weather__content'>
      <span className='weather__icon' role='img' arial-label={weather.description} aria-hidden>
        {weather.icon}
        </span>
        <div className="weather__info">
          <h2 className='weather__info-item item--temp'>{temp}</h2>
        <p className='weather__info--item'>{weather.main}</p>
        <p className='weather__info--item'>{weather.description}''</p>
        </div>
      </div>
      <div className='weather__details'>
        <p className='weather__details-item'><FiWind /> {weather.wind}m/s</p>
        <p className='weather__details-item'><BsClouds /> {weather.clouds}%</p>
        <p className='weather__details-item'><IoThermometerSharp /> {weather.pressure}hPa</p>
      </div>
      <button type='button' className='btn' onClick={() => setIsCelsius(!isCelsius)}>
        Change to {isCelsius ? 'Fahrenheit' : 'Celsius'}
      </button>

    </div>
  )
}

export default App
