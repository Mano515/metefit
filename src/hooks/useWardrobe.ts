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

// Score : plus le centre de la plage est proche de la temp actuelle, mieux c'est
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
    // Amplitude thermique du jour pour choisir le manteau le plus adapté
    const dayMin = slots.length > 0 ? Math.min(...slots.map((s) => s.temp)) + thermalOffset : effectiveTemp
    const result: ClothingItem[] = []

    for (const category of CATEGORY_ORDER) {
      const eligible = items.filter((item) => {
        if (item.category !== category) return false

        // Pour les manteaux : couvrir l'amplitude du jour
        const tempRef = category === 'manteau' ? dayMin : effectiveTemp
        if (tempRef < item.minTemp || tempRef > item.maxTemp) return false

        // Imperméable uniquement si pluie
        if (item.rainproof && category === 'manteau' && !weather.rain) return false

        return true
      })

      if (eligible.length === 0) continue

      if (weather.rain && category === 'manteau') {
        // Pluie : imperméable en premier, puis le manteau le mieux adapté
        const raincoat = eligible.filter((i) => i.rainproof).sort((a, b) => fitScore(b, effectiveTemp) - fitScore(a, effectiveTemp))[0]
        const warmest = eligible.filter((i) => !i.rainproof).sort((a, b) => fitScore(b, effectiveTemp) - fitScore(a, effectiveTemp))[0]
        if (raincoat) result.push(raincoat)
        if (warmest) result.push(warmest)
      } else if (weather.rain && category === 'accessoire') {
        // Pluie : parapluie + meilleur accessoire
        const umbrella = eligible.find((i) => i.rainproof)
        const best = eligible.filter((i) => !i.rainproof).sort((a, b) => fitScore(b, effectiveTemp) - fitScore(a, effectiveTemp))[0]
        if (best) result.push(best)
        if (umbrella) result.push(umbrella)
      } else {
        // Sinon : le vêtement dont le centre de plage est le plus proche de la temp effective
        const best = [...eligible].sort((a, b) => fitScore(b, effectiveTemp) - fitScore(a, effectiveTemp))[0]
        result.push(best)
      }
    }

    return result
  }

  return { items, addItem, removeItem, getSuggestion }
}
