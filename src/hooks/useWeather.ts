import { useState, useEffect } from 'react'
import type { Weather, TimeSlot } from '../types'

const API_KEY = 'b1bbad1503a2ff186dd957972daf4b53'

const TIME_LABELS: Record<string, string> = {
  '06:00': 'Matin',
  '09:00': 'Matin',
  '12:00': 'Midi',
  '15:00': 'Après-midi',
  '18:00': 'Soir',
  '21:00': 'Nuit',
}

const SLOT_HOURS = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00']

function parseForecast(data: any): { forecast: Weather[]; slotsByDay: TimeSlot[][] } {
  const byDay: Record<string, any[]> = {}
  for (const item of data.list) {
    const [date] = item.dt_txt.split(' ')
    if (!byDay[date]) byDay[date] = []
    byDay[date].push(item)
  }

  const days = Object.entries(byDay).slice(0, 5)

  const forecast: Weather[] = days.map(([date, slots]) => {
    const noon = slots.find((s: any) => s.dt_txt.includes('12:00')) ?? slots[Math.floor(slots.length / 2)]
    const rain = slots.some((s: any) => ['Rain', 'Drizzle', 'Thunderstorm'].includes(s.weather[0].main))
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

  const slotsByDay: TimeSlot[][] = days.map(([, slots]) => {
    return SLOT_HOURS.flatMap((hour) => {
      const slot = slots.find((s: any) => s.dt_txt.endsWith(` ${hour}:00`))
      if (!slot) return []
      const main = slot.weather[0].main
      return [{
        hour,
        label: TIME_LABELS[hour] ?? hour,
        temp: Math.round(slot.main.temp),
        icon: slot.weather[0].icon,
        description: slot.weather[0].description,
        rain: ['Rain', 'Drizzle', 'Thunderstorm'].includes(main),
        snow: main === 'Snow',
      }]
    })
  })

  return { forecast, slotsByDay }
}

async function fetchByCoords(lat: number, lon: number) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
  )
  if (!res.ok) throw new Error('Erreur météo')
  return parseForecast(await res.json())
}

async function fetchByCity(city: string) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=fr`
  )
  if (!res.ok) throw new Error('Ville introuvable')
  return parseForecast(await res.json())
}

export function useWeather() {
  const [forecast, setForecast] = useState<Weather[]>([])
  const [slotsByDay, setSlotsByDay] = useState<TimeSlot[][]>([])
  const [selectedDay, setSelectedDay] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [manualCity, setManualCity] = useState('')

  function apply(result: { forecast: Weather[]; slotsByDay: TimeSlot[][] }) {
    setForecast(result.forecast)
    setSlotsByDay(result.slotsByDay)
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée')
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          apply(await fetchByCoords(pos.coords.latitude, pos.coords.longitude))
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
      apply(await fetchByCity(city))
      setSelectedDay(0)
      setManualCity('')
    } catch {
      setError('Ville introuvable')
    } finally {
      setLoading(false)
    }
  }

  return {
    weather: forecast[selectedDay] ?? null,
    forecast,
    slots: slotsByDay[selectedDay] ?? [],
    selectedDay,
    setSelectedDay,
    loading,
    error,
    manualCity,
    setManualCity,
    searchCity,
  }
}
