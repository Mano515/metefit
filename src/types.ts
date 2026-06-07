export type ClothingCategory = 'haut' | 'bas' | 'manteau' | 'chaussures' | 'accessoire'

export interface ClothingItem {
  id: string
  name: string
  category: ClothingCategory
  minTemp: number
  maxTemp: number
  rainproof: boolean
}

export interface Weather {
  temp: number
  feelsLike: number
  description: string
  rain: boolean
  wind: number
  city: string
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
}
