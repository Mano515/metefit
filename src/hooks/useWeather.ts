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

const countryNames = new Intl.DisplayNames(['fr'], { type: 'region' })

function countryLabel(code: string): string {
  try { return countryNames.of(code) ?? code } catch { return code }
}

interface GeoResult {
  name: string
  state?: string
  country: string
  lat: number
  lon: number
}

async function geocodeCity(city: string): Promise<GeoResult> {
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
  )
  const data = await res.json()
  if (!data.length) throw new Error('Ville introuvable')
  return data[0]
}

async function reverseGeocode(lat: number, lon: number): Promise<GeoResult> {
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
  )
  const data = await res.json()
  if (!data.length) throw new Error('Localisation introuvable')
  return data[0]
}

function parseForecast(data: any, geo: GeoResult): { forecast: Weather[]; slotsByDay: TimeSlot[][] } {
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
      city: geo.name,
      region: geo.state,
      country: countryLabel(geo.country),
      icon: noon.weather[0].icon,
      date,
    }
  })

  const nowHour = new Date().getHours()

  const slotsByDay: TimeSlot[][] = days.map(([, slots], dayIndex) => {
    return SLOT_HOURS.map((hour) => {
      const slot = slots.find((s: any) => s.dt_txt.endsWith(` ${hour}:00`))
      const slotHour = parseInt(hour.split(':')[0], 10)
      const isPast = dayIndex === 0 && slotHour + 3 <= nowHour // créneau de 3h déjà passé

      if (!slot) {
        // Créneau dans le passé : on l'inclut comme fantôme
        return {
          hour,
          label: TIME_LABELS[hour] ?? hour,
          temp: 0,
          icon: '01d',
          description: '',
          rain: false,
          snow: false,
          isPast: true,
        } satisfies TimeSlot
      }

      const main = slot.weather[0].main
      return {
        hour,
        label: TIME_LABELS[hour] ?? hour,
        temp: Math.round(slot.main.temp),
        icon: slot.weather[0].icon,
        description: slot.weather[0].description,
        rain: ['Rain', 'Drizzle', 'Thunderstorm'].includes(main),
        snow: main === 'Snow',
        isPast,
      } satisfies TimeSlot
    })
  })

  return { forecast, slotsByDay }
}

async function fetchByCoords(lat: number, lon: number) {
  const [geo, forecastRes] = await Promise.all([
    reverseGeocode(lat, lon),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`)
  ])
  if (!forecastRes.ok) throw new Error('Erreur météo')
  return parseForecast(await forecastRes.json(), geo)
}

async function fetchByCity(city: string) {
  const geo = await geocodeCity(city)
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${geo.lat}&lon=${geo.lon}&appid=${API_KEY}&units=metric&lang=fr`
  )
  if (!res.ok) throw new Error('Erreur météo')
  return parseForecast(await res.json(), geo)
}

export function useWeather() {
  const [forecast, setForecast] = useState<Weather[]>([])
  const [slotsByDay, setSlotsByDay] = useState<TimeSlot[][]>([])
  const [selectedDay, setSelectedDay] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsCity, setNeedsCity] = useState(false)
  const [manualCity, setManualCity] = useState('')

  function apply(result: { forecast: Weather[]; slotsByDay: TimeSlot[][] }) {
    setForecast(result.forecast)
    setSlotsByDay(result.slotsByDay)
    setNeedsCity(false)
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setNeedsCity(true)
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
        // Refus silencieux — on montre juste le champ ville
        setNeedsCity(true)
        setLoading(false)
      }
    )
  }, [])

  async function searchCity(input: string) {
    setLoading(true)
    setError(null)
    try {
      // Si on reçoit "lat,lon" (sélection depuis autocomplétion)
      const coordsMatch = input.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/)
      if (coordsMatch) {
        apply(await fetchByCoords(parseFloat(coordsMatch[1]), parseFloat(coordsMatch[2])))
      } else {
        apply(await fetchByCity(input))
      }
      setSelectedDay(0)
      setManualCity('')
    } catch (e: any) {
      setError(e.message ?? 'Ville introuvable')
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
    needsCity,
    manualCity,
    setManualCity,
    searchCity,
  }
}
