import { useState } from 'react'

export interface SavedCity {
  name: string
  region?: string
  country: string
  lat: number
  lon: number
}

const FAV_KEY = 'metefit_fav_cities'
const RECENT_KEY = 'metefit_recent_cities'

function loadFavs(): SavedCity[] {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]') } catch { return [] }
}

function loadRecent(): SavedCity[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
}

export function useCityMemory() {
  const [favs, setFavs] = useState<SavedCity[]>(loadFavs)
  const [recent, setRecent] = useState<SavedCity[]>(loadRecent)

  function addToRecent(city: SavedCity) {
    const withoutDupe = recent.filter((c) => !(c.lat === city.lat && c.lon === city.lon))
    // Don't store in recents if it's already a favourite — it would appear twice
    const withoutFav = withoutDupe.filter(
      () => !favs.some((f) => f.lat === city.lat && f.lon === city.lon)
    )
    const updated = [city, ...withoutFav].slice(0, 5)
    setRecent(updated)
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
  }

  function toggleFav(city: SavedCity) {
    const isFav = favs.some((f) => f.lat === city.lat && f.lon === city.lon)
    let updated: SavedCity[]
    if (isFav) {
      updated = favs.filter((f) => !(f.lat === city.lat && f.lon === city.lon))
    } else {
      updated = [...favs, city]
      // Move from recents to favs so it doesn't appear in both lists
      const cleanRecent = recent.filter((c) => !(c.lat === city.lat && c.lon === city.lon))
      setRecent(cleanRecent)
      localStorage.setItem(RECENT_KEY, JSON.stringify(cleanRecent))
    }
    setFavs(updated)
    localStorage.setItem(FAV_KEY, JSON.stringify(updated))
  }

  function isFav(city: SavedCity) {
    return favs.some((f) => f.lat === city.lat && f.lon === city.lon)
  }

  // Defensive filter — toggleFav should already keep these disjoint, but guard anyway
  const recentFiltered = recent.filter(
    (c) => !favs.some((f) => f.lat === c.lat && f.lon === c.lon)
  ).slice(0, 3)

  return { favs, recent: recentFiltered, addToRecent, toggleFav, isFav }
}
