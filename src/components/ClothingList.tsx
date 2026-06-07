import type { ClothingItem } from '../types'
import { getClothingEmoji } from '../utils/clothingEmoji'

const CATEGORY_LABELS: Record<string, string> = {
  haut: 'Haut',
  bas: 'Bas',
  manteau: 'Manteau / Veste',
  chaussures: 'Chaussures',
  accessoire: 'Accessoire',
}

interface Props {
  items: ClothingItem[]
  onRemove: (id: string) => void
}

export function ClothingList({ items, onRemove }: Props) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
        Aucun vêtement ajouté pour l'instant.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm">
          <span className="text-xl">{getClothingEmoji(item)}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {CATEGORY_LABELS[item.category]} · {item.minTemp}° à {item.maxTemp}°
              {item.rainproof && ' · ☂️ imperméable'}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-300 dark:text-gray-600 hover:text-red-400 transition-colors text-lg leading-none flex-shrink-0"
            aria-label="Supprimer"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
