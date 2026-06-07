import { useState } from 'react'
import type { HistoryEntry, OutfitFeedback, ClothingItem, Weather } from '../types'

const KEY = 'metefit_history'

function load(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function save(entries: HistoryEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries))
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(load)

  function addEntry(weather: Weather, items: ClothingItem[], feedback: OutfitFeedback) {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      date: weather.date ?? new Date().toISOString().split('T')[0],
      weatherTemp: weather.temp,
      weatherRain: weather.rain,
      weatherCity: weather.city,
      items: items.map((i) => ({ id: i.id, name: i.name })),
      feedback,
    }
    const updated = [entry, ...entries].slice(0, 30)
    setEntries(updated)
    save(updated)
  }

  const todayDate = new Date().toISOString().split('T')[0]
  const todayEntry = entries.find((e) => e.date === todayDate)

  return { entries: entries.slice(0, 7), addEntry, todayEntry }
}
