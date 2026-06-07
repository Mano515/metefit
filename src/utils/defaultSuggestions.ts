import type { ClothingItem, Weather } from '../types'

function make(name: string, category: ClothingItem['category'], minTemp: number, maxTemp: number, rainproof = false): ClothingItem {
  return { id: `default-${name}`, name, category, minTemp, maxTemp, rainproof }
}

const DEFAULTS: ClothingItem[] = [
  make('Doudoune', 'manteau', -20, 5),
  make('Manteau chaud', 'manteau', -5, 10),
  make('Veste légère', 'manteau', 8, 18),
  make('Imperméable', 'manteau', 0, 30, true),
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

export function getDefaultSuggestion(weather: Weather): ClothingItem[] {
  const CATEGORY_ORDER = ['manteau', 'haut', 'bas', 'chaussures', 'accessoire'] as const
  const result: ClothingItem[] = []

  for (const category of CATEGORY_ORDER) {
    const candidates = DEFAULTS.filter(
      (item) =>
        item.category === category &&
        weather.temp >= item.minTemp &&
        weather.temp <= item.maxTemp
    )
    if (candidates.length === 0) continue

    if (weather.rain && category === 'manteau') {
      // Quand il pleut : imperméable en priorité + manteau chaud si froid
      const raincoat = candidates.find((i) => i.rainproof)
      const warm = candidates.find((i) => !i.rainproof)
      if (raincoat) result.push(raincoat)
      if (warm) result.push(warm)
    } else if (!weather.rain && category === 'manteau') {
      // Pas de pluie : exclure les imperméables
      const nonRain = candidates.filter((i) => !i.rainproof)
      if (nonRain.length > 0) result.push(nonRain[0])
    } else if (weather.rain && category === 'accessoire') {
      // Pluie : ajouter parapluie + autres accessoires utiles
      const umbrella = candidates.find((i) => i.name === 'Parapluie')
      const other = candidates.find((i) => !i.rainproof)
      if (other) result.push(other)
      if (umbrella) result.push(umbrella)
    } else {
      result.push(candidates[0])
    }
  }

  return result
}
