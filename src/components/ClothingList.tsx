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
      <p className="text-sm text-white/40 text-center py-4">
        Aucun vêtement ajouté pour l'instant.
      </p>
    )
  }

  return (
    <ul aria-label="Mes vêtements" className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3">
          <span aria-hidden="true" className="text-xl">{getClothingEmoji(item)}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">{item.name}</p>
            <p className="text-xs text-white/50">
              {CATEGORY_LABELS[item.category]} · {item.minTemp}° à {item.maxTemp}°
              {item.rainproof && ' · ☂️ imperméable'}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            aria-label={`Supprimer ${item.name}`}
            className="text-white/30 hover:text-red-300 transition-colors text-lg leading-none flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <span aria-hidden="true">×</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
