import type { ClothingItem, TimeSlot } from '../types'
import { getClothingEmoji } from '../utils/clothingEmoji'

const CATEGORY_LABELS: Record<string, string> = {
  haut: 'Haut', bas: 'Bas', manteau: 'Manteau / Veste', chaussures: 'Chaussures', accessoire: 'Accessoire',
}

const CATEGORY_ORDER = ['manteau', 'haut', 'bas', 'chaussures', 'accessoire']

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
      aria-label={isDefault ? 'Tenue suggérée (tenue de base)' : 'Tenue suggérée'}
      className="bg-white/30 backdrop-blur-xl border border-white/50 rounded-2xl p-5 space-y-3 shadow-xl shadow-black/10"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-sm drop-shadow">Tenue suggérée</h2>
        {isDefault && (
          <span className="text-xs text-white font-medium bg-white/30 border border-white/40 px-2 py-0.5 rounded-full drop-shadow">
            tenue de base
          </span>
        )}
      </div>

      {Object.entries(byCategory).map(([cat, catItems]) => (
        <div key={cat}>
          <h3 className="text-xs text-white font-bold uppercase tracking-widest mb-1 drop-shadow-sm [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">
            {CATEGORY_LABELS[cat]}
          </h3>
          <ul aria-label={CATEGORY_LABELS[cat]} className="space-y-1">
            {catItems.map((item) => {
              const showGlareNote = isSunglasses(item) && !sunny && slots.length > 0
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-1 text-sm text-white bg-white/25 rounded-xl px-3 py-2.5 border border-white/50 shadow shadow-black/5"
                >
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-base">{getClothingEmoji(item)}</span>
                    <span className="font-medium drop-shadow-sm">{item.name}</span>
                    {item.rainproof && (
                      <span className="ml-auto text-xs text-white/80 bg-white/20 px-1.5 rounded" aria-label="imperméable">☂️</span>
                    )}
                  </div>
                  {showGlareNote && (
                    <p className="text-xs text-white/80 flex items-center gap-1 pl-6">
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
