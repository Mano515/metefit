import type { ClothingItem } from '../types'

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
      <p className="text-sm text-gray-400 text-center py-4">
        Aucun vêtement ajouté pour l'instant.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-400">
              {CATEGORY_LABELS[item.category]} · {item.minTemp}° à {item.maxTemp}°
              {item.rainproof && ' · 🌧 imperméable'}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
            aria-label="Supprimer"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
