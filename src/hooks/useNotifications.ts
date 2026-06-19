import { useEffect, useState } from 'react'
import type { Weather, ClothingItem } from '../types'

const NOTIF_DATE_KEY = 'metefit_last_notif'

function getClothingSummary(items: ClothingItem[]): string {
  return items.slice(0, 3).map((i) => i.name).join(', ')
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )

  useEffect(() => { registerSW() }, [])

  async function requestPermission() {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setPermission(result)
  }

  function sendMorningNotif(weather: Weather, items: ClothingItem[]) {
    if (permission !== 'granted') return

    const today = new Date().toISOString().split('T')[0]
    const lastNotif = localStorage.getItem(NOTIF_DATE_KEY)
    if (lastNotif === today) return // one notification per day is enough

    const hour = new Date().getHours()
    if (hour < 6 || hour > 11) return // morning window only — not useful mid-afternoon

    const summary = getClothingSummary(items)
    const rainText = weather.rain ? ' · 🌧️ Pluie prévue' : ''

    new Notification('Météfit — Tenue du jour', {
      body: `${weather.temp}°C à ${weather.city}${rainText}\n${summary}`,
      icon: '/favicon.svg',
    })

    localStorage.setItem(NOTIF_DATE_KEY, today)
  }

  return { permission, requestPermission, sendMorningNotif }
}
