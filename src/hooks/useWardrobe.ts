import { useState } from 'react'
import type { ClothingItem, Weather, TimeSlot } from '../types'

const STORAGE_KEY = 'metefit_wardrobe'
const CATEGORY_ORDER = ['manteau', 'haut', 'bas', 'chaussures', 'accessoire'] as const

function load(): ClothingItem[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

function save(items: ClothingItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

// Negative distance so higher score = better fit (can be sorted descending)
function fitScore(item: ClothingItem, temp: number): number {
  const center = (item.minTemp + item.maxTemp) / 2
  return -Math.abs(temp - center)
}

export function useWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>(load)

  function addItem(item: Omit<ClothingItem, 'id'>) {
    const updated = [...items, { ...item, id: crypto.randomUUID() }]
    setItems(updated)
    save(updated)
  }

  function removeItem(id: string) {
    const updated = items.filter((i) => i.id !== id)
    setItems(updated)
    save(updated)
  }

  function getSuggestion(weather: Weather, slots: TimeSlot[], thermalOffset: number): ClothingItem[] {
    const effectiveTemp = weather.temp + thermalOffset
    const activeSlots = slots.filter((s) => !s.isPast)
    // Coats are sized against the daily low so they cover the full day's range
    const dayMin = activeSlots.length > 0 ? Math.min(...activeSlots.map((s) => s.temp)) + thermalOffset : effectiveTemp
    const result: ClothingItem[] = []

    for (const category of CATEGORY_ORDER) {
      const eligible = items.filter((item) => {
        if (item.category !== category) return false
        const tempRef = category === 'manteau' ? dayMin : effectiveTemp
        if (tempRef < item.minTemp || tempRef > item.maxTemp) return false
        // Suppress rainproof coats on dry days to avoid always suggesting an umbrella coat
        if (item.rainproof && category === 'manteau' && !weather.rain) return false
        return true
      })

      if (eligible.length === 0) continue

      if (weather.rain && category === 'manteau') {
        const raincoat = eligible.filter((i) => i.rainproof).sort((a, b) => fitScore(b, effectiveTemp) - fitScore(a, effectiveTemp))[0]
        const warmest = eligible.filter((i) => !i.rainproof).sort((a, b) => fitScore(b, effectiveTemp) - fitScore(a, effectiveTemp))[0]
        if (raincoat) result.push(raincoat)
        if (warmest) result.push(warmest)
      } else if (weather.rain && category === 'accessoire') {
        const umbrella = eligible.find((i) => i.rainproof)
        const best = eligible.filter((i) => !i.rainproof).sort((a, b) => fitScore(b, effectiveTemp) - fitScore(a, effectiveTemp))[0]
        if (best) result.push(best)
        if (umbrella) result.push(umbrella)
      } else {
        const best = [...eligible].sort((a, b) => fitScore(b, effectiveTemp) - fitScore(a, effectiveTemp))[0]
        result.push(best)
      }
    }

    return result
  }

  return { items, addItem, removeItem, getSuggestion }
}
