import type { ClothingItem, TimeSlot } from '../types'
import { getClothingEmoji } from '../utils/clothingEmoji'

const CATEGORY_LABELS: Record<string, string> = {
  haut: 'Haut', bas: 'Bas', manteau: 'Manteau / Veste', chaussures: 'Chaussures', accessoire: 'Accessoire',
}

const CATEGORY_ORDER = ['manteau', 'haut', 'bas', 'chaussures', 'accessoire']

/** Vrai si au moins un créneau est dégagé/ensoleillé */
function hasSunnySlot(slots: TimeSlot[]): boolean {
  return slots.some((s) => s.icon.startsWith('01') || s.icon.startsWith('02'))
}

function isSunglasses(item: ClothingItem): boolean {
  const n = item.name.toLowerCase()
  return n.includes('lunette') || n.includes('soleil')
}

interface Props {
  items: ClothingItem[]
  isDefault?: boolean
  slots?: TimeSlot[]
}

export function OutfitSuggestion({ items, isDefault, slots = [] }: Props) {
  const sunny = hasSunnySlot(slots)

  const byCategory = CATEGORY_ORDER.reduce<Record<string, ClothingItem[]>>((acc, cat) => {
    const catItems = items.filter((i) => i.category === cat)
    if (catItems.length > 0) acc[cat] = catItems
    return acc
  }, {})

  return (
    <section
      aria-label={isDefault ? 'Tenue suggérée (suggestion générique)' : 'Tenue suggérée'}
      className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-green-800 dark:text-green-300 font-semibold text-sm">Tenue suggérée</h2>
        {isDefault && (
          <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">
            suggestion générique
          </span>
        )}
      </div>

      {Object.entries(byCategory).map(([cat, catItems]) => (
        <div key={cat}>
          <h3 className="text-xs text-green-600 dark:text-green-500 font-medium uppercase tracking-wide mb-1">
            {CATEGORY_LABELS[cat]}
          </h3>
          <ul aria-label={CATEGORY_LABELS[cat]} className="space-y-1">
            {catItems.map((item) => {
              const showGlareNote = isSunglasses(item) && !sunny && slots.length > 0
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-green-100 dark:border-green-900"
                >
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-base">{getClothingEmoji(item)}</span>
                    <span>{item.name}</span>
                    {item.rainproof && (
                      <span className="ml-auto text-xs text-blue-400" aria-label="imperméable">imperméable</span>
                    )}
                  </div>
                  {showGlareNote && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 pl-6">
                      <span aria-hidden="true">💡</span>
                      Luminosité élevée malgré les nuages
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </section>
  )
}
