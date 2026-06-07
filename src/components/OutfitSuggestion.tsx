import type { ClothingItem } from '../types'

const CATEGORY_LABELS: Record<string, string> = {
  haut: 'Haut',
  bas: 'Bas',
  manteau: 'Manteau / Veste',
  chaussures: 'Chaussures',
  accessoire: 'Accessoire',
}

const CATEGORY_ORDER = ['manteau', 'haut', 'bas', 'chaussures', 'accessoire']

interface Props {
  items: ClothingItem[]
}

export function OutfitSuggestion({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
        <p className="text-amber-700 text-sm">
          Aucun vêtement adapté à la météo du jour dans ta garde-robe.
        </p>
      </div>
    )
  }

  const byCategory = CATEGORY_ORDER.reduce<Record<string, ClothingItem[]>>((acc, cat) => {
    const catItems = items.filter((i) => i.category === cat)
    if (catItems.length > 0) acc[cat] = catItems
    return acc
  }, {})

  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 space-y-3">
      <p className="text-green-800 font-semibold text-sm">Tenue suggérée pour aujourd'hui</p>
      {Object.entries(byCategory).map(([cat, catItems]) => (
        <div key={cat}>
          <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">
            {CATEGORY_LABELS[cat]}
          </p>
          <ul className="space-y-1">
            {catItems.map((item) => (
              <li key={item.id} className="text-sm text-gray-700 bg-white rounded-lg px-3 py-2 border border-green-100">
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
