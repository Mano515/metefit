import { useState } from 'react'
import type { ClothingCategory, ClothingItem } from '../types'

interface Preset {
  name: string
  emoji: string
  category: ClothingCategory
  minTemp: number
  maxTemp: number
  rainproof: boolean
}

const PRESETS: Preset[] = [
  // Hauts
  { name: 'T-shirt',     emoji: '👕', category: 'haut',       minTemp: 18, maxTemp: 40,  rainproof: false },
  { name: 'Chemise',     emoji: '👔', category: 'haut',       minTemp: 12, maxTemp: 30,  rainproof: false },
  { name: 'Sweat',       emoji: '👕', category: 'haut',       minTemp: 5,  maxTemp: 18,  rainproof: false },
  { name: 'Pull',        emoji: '🧶', category: 'haut',       minTemp: -5, maxTemp: 12,  rainproof: false },
  // Bas
  { name: 'Short',       emoji: '🩳', category: 'bas',        minTemp: 22, maxTemp: 40,  rainproof: false },
  { name: 'Jean',        emoji: '👖', category: 'bas',        minTemp: 5,  maxTemp: 25,  rainproof: false },
  { name: 'Pantalon',    emoji: '👖', category: 'bas',        minTemp: 0,  maxTemp: 20,  rainproof: false },
  { name: 'Jupe',        emoji: '👗', category: 'bas',        minTemp: 18, maxTemp: 40,  rainproof: false },
  // Manteaux
  { name: 'Veste',       emoji: '🫱', category: 'manteau',    minTemp: 10, maxTemp: 20,  rainproof: false },
  { name: 'Manteau',     emoji: '🧥', category: 'manteau',    minTemp: -5, maxTemp: 12,  rainproof: false },
  { name: 'Doudoune',    emoji: '🧥', category: 'manteau',    minTemp: -20, maxTemp: 5,  rainproof: false },
  { name: 'Imperméable', emoji: '🌧️', category: 'manteau',    minTemp: 0,  maxTemp: 25,  rainproof: true  },
  // Chaussures
  { name: 'Sandales',    emoji: '👡', category: 'chaussures', minTemp: 22, maxTemp: 40,  rainproof: false },
  { name: 'Baskets',     emoji: '👟', category: 'chaussures', minTemp: 5,  maxTemp: 30,  rainproof: false },
  { name: 'Boots',       emoji: '🥾', category: 'chaussures', minTemp: -5, maxTemp: 15,  rainproof: false },
  // Accessoires
  { name: 'Bonnet',      emoji: '🧢', category: 'accessoire', minTemp: -20, maxTemp: 8,  rainproof: false },
  { name: 'Écharpe',     emoji: '🧣', category: 'accessoire', minTemp: -20, maxTemp: 10, rainproof: false },
  { name: 'Parapluie',   emoji: '☂️', category: 'accessoire', minTemp: 0,  maxTemp: 30,  rainproof: true  },
  { name: 'Lunettes',    emoji: '🕶️', category: 'accessoire', minTemp: 18, maxTemp: 40,  rainproof: false },
]

interface Props {
  onAdd: (item: Omit<ClothingItem, 'id'>) => void
}

function TempButton({ value, onChange, delta }: { value: number; onChange: (v: number) => void; delta: number }) {
  return (
    <button
      type="button"
      onClick={() => onChange(value + delta)}
      className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm font-bold flex items-center justify-center transition-colors"
    >
      {delta > 0 ? '+' : '−'}
    </button>
  )
}

export function AddClothingForm({ onAdd }: Props) {
  const [selected, setSelected] = useState<Preset | null>(null)
  const [name, setName] = useState('')
  const [minTemp, setMinTemp] = useState(0)
  const [maxTemp, setMaxTemp] = useState(20)
  const [rainproof, setRainproof] = useState(false)

  function pick(preset: Preset) {
    setSelected(preset)
    setName(preset.name)
    setMinTemp(preset.minTemp)
    setMaxTemp(preset.maxTemp)
    setRainproof(preset.rainproof)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || !name.trim()) return
    onAdd({ name: name.trim(), category: selected.category, minTemp, maxTemp, rainproof })
    setSelected(null)
  }

  function cancel() {
    setSelected(null)
  }

  if (selected) {
    return (
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{selected.emoji}</span>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 text-base font-medium text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 focus:outline-none focus:border-blue-400 pb-1 bg-transparent"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Température d'usage</p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TempButton value={minTemp} onChange={setMinTemp} delta={-1} />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 w-12 text-center">{minTemp}°</span>
              <TempButton value={minTemp} onChange={setMinTemp} delta={1} />
            </div>
            <span className="text-gray-300 dark:text-gray-600">→</span>
            <div className="flex items-center gap-2">
              <TempButton value={maxTemp} onChange={setMaxTemp} delta={-1} />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 w-12 text-center">{maxTemp}°</span>
              <TempButton value={maxTemp} onChange={setMaxTemp} delta={1} />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setRainproof(!rainproof)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
            rainproof
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
              : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-600'
          }`}
        >
          <span>{rainproof ? '☂️' : '☀️'}</span>
          <span>{rainproof ? 'Résistant à la pluie' : 'Pas résistant à la pluie'}</span>
        </button>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Ajouter
          </button>
          <button
            type="button"
            onClick={cancel}
            className="px-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            ←
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Ajouter un vêtement</p>
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => pick(preset)}
            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700 border border-transparent transition-colors"
          >
            <span className="text-2xl">{preset.emoji}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
