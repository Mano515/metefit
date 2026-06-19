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

  const allItems = CATEGORY_ORDER.flatMap((cat) => (byCategory[cat] ?? []).map((item) => ({ item, cat })))

  return (
    <section
      aria-label={isDefault ? 'Tenue suggérée (tenue de base)' : 'Tenue suggérée'}
      className="bg-white/30 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-xl shadow-black/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-sm drop-shadow">Tenue suggérée</h2>
        {isDefault && (
          <span className="text-xs text-white font-medium bg-white/30 border border-white/40 px-2 py-0.5 rounded-full drop-shadow">
            tenue de base
          </span>
        )}
      </div>

      <ul aria-label="Pièces de la tenue" className="grid grid-cols-3 gap-3">
        {allItems.map(({ item, cat }) => {
          const showGlareNote = isSunglasses(item) && !sunny && slots.length > 0
          return (
            <li
              key={item.id}
              className="flex flex-col items-center gap-2 bg-white/25 rounded-2xl px-2 py-4 border border-white/50 shadow shadow-black/5 text-center"
            >
              <span aria-hidden="true" className="text-4xl drop-shadow">{getClothingEmoji(item)}</span>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-white leading-tight drop-shadow-sm">{item.name}</p>
                <p className="text-xs text-white/60 uppercase tracking-wide">{CATEGORY_LABELS[cat]}</p>
              </div>
              {item.rainproof && (
                <span className="text-xs text-white/80 bg-white/20 px-1.5 py-0.5 rounded-full" aria-label="imperméable">☂️ imperméable</span>
              )}
              {showGlareNote && (
                <p className="text-xs text-white/70 leading-tight">💡 Lumineux même nuageux</p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
