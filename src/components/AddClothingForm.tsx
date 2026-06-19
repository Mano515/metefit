import { useState, useId } from 'react'
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
  { name: 'T-shirt',     emoji: '👕', category: 'haut',       minTemp: 18, maxTemp: 40,  rainproof: false },
  { name: 'Chemise',     emoji: '👔', category: 'haut',       minTemp: 12, maxTemp: 30,  rainproof: false },
  { name: 'Sweat',       emoji: '👕', category: 'haut',       minTemp: 5,  maxTemp: 18,  rainproof: false },
  { name: 'Pull',        emoji: '🧶', category: 'haut',       minTemp: -5, maxTemp: 12,  rainproof: false },
  { name: 'Short',       emoji: '🩳', category: 'bas',        minTemp: 22, maxTemp: 40,  rainproof: false },
  { name: 'Jean',        emoji: '👖', category: 'bas',        minTemp: 5,  maxTemp: 25,  rainproof: false },
  { name: 'Pantalon',    emoji: '👖', category: 'bas',        minTemp: 0,  maxTemp: 20,  rainproof: false },
  { name: 'Jupe',        emoji: '👗', category: 'bas',        minTemp: 18, maxTemp: 40,  rainproof: false },
  { name: 'Veste',       emoji: '🫱', category: 'manteau',    minTemp: 10, maxTemp: 20,  rainproof: false },
  { name: 'Manteau',     emoji: '🧥', category: 'manteau',    minTemp: -5, maxTemp: 12,  rainproof: false },
  { name: 'Doudoune',    emoji: '🧥', category: 'manteau',    minTemp: -20, maxTemp: 5,  rainproof: false },
  { name: 'Imperméable', emoji: '🌧️', category: 'manteau',    minTemp: 0,  maxTemp: 25,  rainproof: true  },
  { name: 'Sandales',    emoji: '👡', category: 'chaussures', minTemp: 22, maxTemp: 40,  rainproof: false },
  { name: 'Baskets',     emoji: '👟', category: 'chaussures', minTemp: 5,  maxTemp: 30,  rainproof: false },
  { name: 'Boots',       emoji: '🥾', category: 'chaussures', minTemp: -5, maxTemp: 15,  rainproof: false },
  { name: 'Bonnet',      emoji: '🧢', category: 'accessoire', minTemp: -20, maxTemp: 8,  rainproof: false },
  { name: 'Écharpe',     emoji: '🧣', category: 'accessoire', minTemp: -20, maxTemp: 10, rainproof: false },
  { name: 'Parapluie',   emoji: '☂️', category: 'accessoire', minTemp: 0,  maxTemp: 30,  rainproof: true  },
  { name: 'Lunettes',    emoji: '🕶️', category: 'accessoire', minTemp: 18, maxTemp: 40,  rainproof: false },
]

interface Props {
  onAdd: (item: Omit<ClothingItem, 'id'>) => void
}

interface TempButtonProps {
  value: number
  onChange: (v: number) => void
  delta: number
  label: string
}

function TempButton({ value, onChange, delta, label }: TempButtonProps) {
  return (
    <button
      type="button"
      aria-label={`${label} ${delta > 0 ? 'augmenter' : 'diminuer'} (actuellement ${value}°)`}
      onClick={() => onChange(value + delta)}
      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-bold flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
    >
      <span aria-hidden="true">{delta > 0 ? '+' : '−'}</span>
    </button>
  )
}

export function AddClothingForm({ onAdd }: Props) {
  const [selected, setSelected] = useState<Preset | null>(null)
  const [name, setName] = useState('')
  const [minTemp, setMinTemp] = useState(0)
  const [maxTemp, setMaxTemp] = useState(20)
  const [rainproof, setRainproof] = useState(false)
  const nameId = useId()
  const minOutputId = useId()
  const maxOutputId = useId()

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
      <form onSubmit={handleSubmit} aria-label={`Configurer ${selected.name}`} className="bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 p-4 space-y-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="text-3xl">{selected.emoji}</span>
          <div className="flex-1">
            <label htmlFor={nameId} className="sr-only">Nom du vêtement</label>
            <input
              id={nameId}
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-base font-medium text-white border-b border-white/30 focus-visible:outline-none focus-visible:border-white/60 pb-1 bg-transparent placeholder-white/40"
            />
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-xs text-white/50 uppercase tracking-wide">Température d'usage</legend>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TempButton value={minTemp} onChange={setMinTemp} delta={-1} label="Température minimale" />
              <output
                id={minOutputId}
                aria-live="polite"
                aria-label={`Température minimale : ${minTemp}°`}
                className="text-sm font-semibold text-white w-12 text-center"
              >
                {minTemp}°
              </output>
              <TempButton value={minTemp} onChange={setMinTemp} delta={1} label="Température minimale" />
            </div>
            <span aria-hidden="true" className="text-white/30">→</span>
            <div className="flex items-center gap-2">
              <TempButton value={maxTemp} onChange={setMaxTemp} delta={-1} label="Température maximale" />
              <output
                id={maxOutputId}
                aria-live="polite"
                aria-label={`Température maximale : ${maxTemp}°`}
                className="text-sm font-semibold text-white w-12 text-center"
              >
                {maxTemp}°
              </output>
              <TempButton value={maxTemp} onChange={setMaxTemp} delta={1} label="Température maximale" />
            </div>
          </div>
        </fieldset>

        <button
          type="button"
          role="switch"
          aria-checked={rainproof}
          aria-label="Résistant à la pluie"
          onClick={() => setRainproof(!rainproof)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 border ${
            rainproof
              ? 'bg-white/25 border-white/40 text-white'
              : 'bg-white/10 border-white/20 text-white/60'
          }`}
        >
          <span aria-hidden="true">{rainproof ? '☂️' : '☀️'}</span>
          <span>{rainproof ? 'Résistant à la pluie' : 'Pas résistant à la pluie'}</span>
        </button>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-white/25 backdrop-blur-md text-white border border-white/30 rounded-xl py-2.5 text-sm font-medium hover:bg-white/35 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Ajouter
          </button>
          <button
            type="button"
            onClick={cancel}
            aria-label="Retour à la liste des vêtements"
            className="px-4 bg-white/10 text-white/60 border border-white/20 rounded-xl py-2.5 text-sm font-medium hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <span aria-hidden="true">←</span>
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 p-4">
      <p id="add-clothing-label" className="text-xs text-white/50 uppercase tracking-wide mb-3">
        Ajouter un vêtement
      </p>
      <ul role="list" aria-labelledby="add-clothing-label" className="grid grid-cols-4 gap-2">
        {PRESETS.map((preset) => (
          <li key={preset.name}>
            <button
              type="button"
              aria-label={`Ajouter un ${preset.name}`}
              onClick={() => pick(preset)}
              className="w-full flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/20 border border-transparent hover:border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <span aria-hidden="true" className="text-2xl">{preset.emoji}</span>
              <span className="text-xs text-white/70 text-center leading-tight">{preset.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
