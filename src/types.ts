export type ClothingCategory = 'haut' | 'bas' | 'manteau' | 'chaussures' | 'accessoire'

export type ThermalProfile = 'frileux' | 'normal' | 'chaud'

export type OutfitFeedback = 'parfait' | 'trop_chaud' | 'trop_froid'

export interface ClothingItem {
  id: string
  name: string
  category: ClothingCategory
  minTemp: number
  maxTemp: number
  rainproof: boolean
}

export interface SavedOutfit {
  id: string
  name: string
  items: { id: string; name: string; category: ClothingCategory }[]
  createdAt: string
}

export interface Weather {
  temp: number
  feelsLike: number
  description: string
  rain: boolean
  wind: number
  city: string
  region?: string
  country?: string
  icon: string
  date?: string
}

export interface TimeSlot {
  hour: string
  label: string
  temp: number
  icon: string
  description: string
  rain: boolean
  snow: boolean
  isPast?: boolean
}

export interface HistoryEntry {
  id: string
  date: string
  weatherTemp: number
  weatherRain: boolean
  weatherCity: string
  items: { id: string; name: string }[]
  feedback: OutfitFeedback
}
