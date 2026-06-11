import type { ClothingItem, Weather, TimeSlot } from '../types'

function make(name: string, category: ClothingItem['category'], minTemp: number, maxTemp: number, rainproof = false): ClothingItem {
  return { id: `default-${name}`, name, category, minTemp, maxTemp, rainproof }
}

const DEFAULTS: ClothingItem[] = [
  make('Doudoune', 'manteau', -20, 5),
  make('Manteau chaud', 'manteau', -5, 10),
  make('Veste légère', 'manteau', 8, 18),
  make('Imperméable', 'manteau', 0, 25, true),
  make('Pull épais', 'haut', -10, 10),
  make('Sweat', 'haut', 5, 18),
  make('T-shirt', 'haut', 15, 40),
  make('Chemise', 'haut', 12, 30),
  make('Jean épais', 'bas', -10, 15),
  make('Jean', 'bas', 5, 25),
  make('Short', 'bas', 22, 40),
  make('Pantalon léger', 'bas', 15, 30),
  make('Boots', 'chaussures', -10, 15),
  make('Baskets', 'chaussures', 5, 30),
  make('Sandales', 'chaussures', 22, 40),
  make('Bonnet', 'accessoire', -20, 8),
  make('Écharpe', 'accessoire', -20, 10),
  make('Lunettes de soleil', 'accessoire', 18, 40),
  make('Parapluie', 'accessoire', 0, 30, true),
]

const CATEGORY_ORDER = ['manteau', 'haut', 'bas', 'chaussures', 'accessoire'] as const

function fitScore(item: ClothingItem, temp: number): number {
  const center = (item.minTemp + item.maxTemp) / 2
  return -Math.abs(temp - center)
}

export function getDefaultSuggestion(weather: Weather, slots: TimeSlot[], thermalOffset: number): ClothingItem[] {
  const effectiveTemp = weather.temp + thermalOffset
  const activeSlots = slots.filter((s) => !s.isPast)
  const dayMin = activeSlots.length > 0 ? Math.min(...activeSlots.map((s) => s.temp)) + thermalOffset : effectiveTemp
  const result: ClothingItem[] = []

  for (const category of CATEGORY_ORDER) {
    const candidates = DEFAULTS.filter(
      (item) => item.category === category && effectiveTemp >= item.minTemp && effectiveTemp <= item.maxTemp
    )

    if (candidates.length === 0) continue

    if (weather.rain && category === 'manteau') {
      const raincoat = candidates.find((i) => i.rainproof)
      const warm = candidates.filter((i) => !i.rainproof && dayMin >= i.minTemp)
        .sort((a, b) => fitScore(b, effectiveTemp) - fitScore(a, effectiveTemp))[0]
      if (raincoat) result.push(raincoat)
      if (warm) result.push(warm)
    } else if (!weather.rain && category === 'manteau') {
      const best = candidates.filter((i) => !i.rainproof)
        .sort((a, b) => fitScore(b, effectiveTemp) - fitScore(a, effectiveTemp))[0]
      if (best) result.push(best)
    } else if (weather.rain && category === 'accessoire') {
      const umbrella = candidates.find((i) => i.name === 'Parapluie')
      const other = candidates.filter((i) => !i.rainproof)
        .sort((a, b) => fitScore(b, effectiveTemp) - fitScore(a, effectiveTemp))[0]
      if (other) result.push(other)
      if (umbrella) result.push(umbrella)
    } else {
      const best = [...candidates].sort((a, b) => fitScore(b, effectiveTemp) - fitScore(a, effectiveTemp))[0]
      result.push(best)
    }
  }

  return result
}
