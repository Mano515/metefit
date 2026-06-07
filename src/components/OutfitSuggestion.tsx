import type { ClothingItem } from '../types'
import { getClothingEmoji } from '../utils/clothingEmoji'

const CATEGORY_LABELS: Record<string, string> = {
  haut: 'Haut', bas: 'Bas', manteau: 'Manteau / Veste', chaussures: 'Chaussures', accessoire: 'Accessoire',
}

const CATEGORY_ORDER = ['manteau', 'haut', 'bas', 'chaussures', 'accessoire']

interface Props {
  items: ClothingItem[]
  isDefault?: boolean
}

export function OutfitSuggestion({ items, isDefault }: Props) {
  const byCategory = CATEGORY_ORDER.reduce<Record<string, ClothingItem[]>>((acc, cat) => {
    const catItems = items.filter((i) => i.category === cat)
    if (catItems.length > 0) acc[cat] = catItems
    return acc
  }, {})

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-green-800 dark:text-green-300 font-semibold text-sm">Tenue suggérée</p>
        {isDefault && (
          <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">
            suggestion générique
          </span>
        )}
      </div>
      {Object.entries(byCategory).map(([cat, catItems]) => (
        <div key={cat}>
          <p className="text-xs text-green-600 dark:text-green-500 font-medium uppercase tracking-wide mb-1">{CATEGORY_LABELS[cat]}</p>
          <ul className="space-y-1">
            {catItems.map((item) => (
              <li key={item.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-green-100 dark:border-green-900">
                <span className="text-base">{getClothingEmoji(item)}</span>
                <span>{item.name}</span>
                {item.rainproof && <span className="ml-auto text-xs text-blue-400">imperméable</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
