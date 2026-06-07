import { useState, useEffect } from 'react'
import type { Weather } from '../types'

const API_KEY = 'b1bbad1503a2ff186dd957972daf4b53'

async function fetchWeatherByCoords(lat: number, lon: number): Promise<Weather> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
  )
  if (!res.ok) throw new Error('Erreur météo')
  return parseWeather(await res.json())
}

async function fetchWeatherByCity(city: string): Promise<Weather> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=fr`
  )
  if (!res.ok) throw new Error('Ville introuvable')
  return parseWeather(await res.json())
}

function parseWeather(data: any): Weather {
  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    rain: data.weather[0].main === 'Rain' || data.weather[0].main === 'Drizzle' || data.weather[0].main === 'Thunderstorm',
    wind: Math.round(data.wind.speed * 3.6),
    city: data.name,
    icon: data.weather[0].icon,
  }
}

export function useWeather() {
  const [weather, setWeather] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [manualCity, setManualCity] = useState('')

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée')
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const w = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude)
          setWeather(w)
        } catch {
          setError('Impossible de récupérer la météo')
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('Localisation refusée — entre ta ville manuellement')
        setLoading(false)
      }
    )
  }, [])

  async function searchCity(city: string) {
    setLoading(true)
    setError(null)
    try {
      const w = await fetchWeatherByCity(city)
      setWeather(w)
      setManualCity('')
    } catch {
      setError('Ville introuvable')
    } finally {
      setLoading(false)
    }
  }

  return { weather, loading, error, manualCity, setManualCity, searchCity }
}
