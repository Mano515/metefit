import type { SavedOutfit } from '../types'
import { getClothingEmoji } from '../utils/clothingEmoji'

const CATEGORY_ORDER = ['manteau', 'haut', 'bas', 'chaussures', 'accessoire']

interface Props {
  outfits: SavedOutfit[]
  onRemove: (id: string) => void
}

export function SavedOutfitLibrary({ outfits, onRemove }: Props) {
  if (outfits.length === 0) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
        Aucune tenue sauvegardée.<br />Sauvegarde une suggestion depuis l'onglet Tenue.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {outfits.map((outfit) => {
        const sorted = [...outfit.items].sort(
          (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
        )
        return (
          <li key={outfit.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{outfit.name}</p>
              <button
                onClick={() => onRemove(outfit.id)}
                className="text-gray-300 dark:text-gray-600 hover:text-red-400 transition-colors text-lg leading-none"
                aria-label="Supprimer"
              >
                ×
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sorted.map((item) => (
                <span key={item.id} className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
                  <span>{getClothingEmoji({ ...item, id: item.id, minTemp: 0, maxTemp: 0, rainproof: false })}</span>
                  {item.name}
                </span>
              ))}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
