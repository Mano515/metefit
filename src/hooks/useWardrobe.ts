import { useState } from 'react'
import { ClothingItem, Weather } from '../types'

const STORAGE_KEY = 'metefit_wardrobe'

function load(): ClothingItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function save(items: ClothingItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>(load)

  function addItem(item: Omit<ClothingItem, 'id'>) {
    const newItem = { ...item, id: crypto.randomUUID() }
    const updated = [...items, newItem]
    setItems(updated)
    save(updated)
  }

  function removeItem(id: string) {
    const updated = items.filter((i) => i.id !== id)
    setItems(updated)
    save(updated)
  }

  function getSuggestion(weather: Weather): ClothingItem[] {
    return items.filter((item) => {
      const tempOk = weather.temp >= item.minTemp && weather.temp <= item.maxTemp
      const rainOk = !weather.rain || item.rainproof || item.category === 'haut' || item.category === 'bas'
      return tempOk && rainOk
    })
  }

  return { items, addItem, removeItem, getSuggestion }
}
