import { useState, useEffect } from 'react'
import type { Weather } from '../types'

const API_KEY = 'b1bbad1503a2ff186dd957972daf4b53'

async function fetchForecastByCoords(lat: number, lon: number): Promise<Weather[]> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
  )
  if (!res.ok) throw new Error('Erreur météo')
  return parseForecast(await res.json())
}

async function fetchForecastByCity(city: string): Promise<Weather[]> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=fr`
  )
  if (!res.ok) throw new Error('Ville introuvable')
  return parseForecast(await res.json())
}

function parseForecast(data: any): Weather[] {
  const byDay: Record<string, any[]> = {}
  for (const item of data.list) {
    const date = item.dt_txt.split(' ')[0]
    if (!byDay[date]) byDay[date] = []
    byDay[date].push(item)
  }

  return Object.entries(byDay).slice(0, 5).map(([date, slots]) => {
    // Préférer le slot de midi, sinon le premier disponible
    const noon = slots.find((s: any) => s.dt_txt.includes('12:00')) ?? slots[Math.floor(slots.length / 2)]
    const rain = slots.some((s: any) =>
      ['Rain', 'Drizzle', 'Thunderstorm'].includes(s.weather[0].main)
    )
    return {
      temp: Math.round(noon.main.temp),
      feelsLike: Math.round(noon.main.feels_like),
      description: noon.weather[0].description,
      rain,
      wind: Math.round(noon.wind.speed * 3.6),
      city: data.city.name,
      icon: noon.weather[0].icon,
      date,
    }
  })
}

export function useWeather() {
  const [forecast, setForecast] = useState<Weather[]>([])
  const [selectedDay, setSelectedDay] = useState(0)
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
          const days = await fetchForecastByCoords(pos.coords.latitude, pos.coords.longitude)
          setForecast(days)
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
      const days = await fetchForecastByCity(city)
      setForecast(days)
      setSelectedDay(0)
      setManualCity('')
    } catch {
      setError('Ville introuvable')
    } finally {
      setLoading(false)
    }
  }

  const weather = forecast[selectedDay] ?? null

  return { weather, forecast, selectedDay, setSelectedDay, loading, error, manualCity, setManualCity, searchCity }
}
