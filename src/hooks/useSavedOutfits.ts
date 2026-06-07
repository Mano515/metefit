import { useState } from 'react'
import type { SavedOutfit, ClothingItem } from '../types'

const KEY = 'metefit_saved_outfits'

function load(): SavedOutfit[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function save(outfits: SavedOutfit[]) {
  localStorage.setItem(KEY, JSON.stringify(outfits))
}

export function useSavedOutfits() {
  const [outfits, setOutfits] = useState<SavedOutfit[]>(load)

  function saveOutfit(name: string, items: ClothingItem[]) {
    const outfit: SavedOutfit = {
      id: crypto.randomUUID(),
      name,
      items: items.map((i) => ({ id: i.id, name: i.name, category: i.category })),
      createdAt: new Date().toISOString(),
    }
    const updated = [outfit, ...outfits]
    setOutfits(updated)
    save(updated)
  }

  function removeOutfit(id: string) {
    const updated = outfits.filter((o) => o.id !== id)
    setOutfits(updated)
    save(updated)
  }

  return { outfits, saveOutfit, removeOutfit }
}
