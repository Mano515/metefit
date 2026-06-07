import { useState } from 'react'
import type { ClothingCategory, ClothingItem } from '../types'

const CATEGORIES: { value: ClothingCategory; label: string }[] = [
  { value: 'haut', label: 'Haut' },
  { value: 'bas', label: 'Bas' },
  { value: 'manteau', label: 'Manteau / Veste' },
  { value: 'chaussures', label: 'Chaussures' },
  { value: 'accessoire', label: 'Accessoire' },
]

interface Props {
  onAdd: (item: Omit<ClothingItem, 'id'>) => void
}

export function AddClothingForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ClothingCategory>('haut')
  const [minTemp, setMinTemp] = useState(-10)
  const [maxTemp, setMaxTemp] = useState(15)
  const [rainproof, setRainproof] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({ name: name.trim(), category, minTemp, maxTemp, rainproof })
    setName('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full border-2 border-dashed border-gray-300 rounded-xl py-4 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Ajouter un vêtement
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-sm">
      <input
        autoFocus
        type="text"
        placeholder="Nom du vêtement"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as ClothingCategory)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Temp. min (°C)</label>
          <input
            type="number"
            value={minTemp}
            onChange={(e) => setMinTemp(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Temp. max (°C)</label>
          <input
            type="number"
            value={maxTemp}
            onChange={(e) => setMaxTemp(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={rainproof}
          onChange={(e) => setRainproof(e.target.checked)}
          className="rounded"
        />
        Résistant à la pluie
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Ajouter
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 bg-gray-100 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
