import { useState, useId } from 'react'
import type { ClothingItem } from '../types'

interface Props {
  items: ClothingItem[]
  onSave: (name: string, items: ClothingItem[]) => void
}

export function SaveOutfitButton({ items, onSave }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const inputId = useId()

  if (items.length === 0) return null

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSave(name.trim(), items)
    setName('')
    setOpen(false)
  }

  if (open) {
    return (
      <form onSubmit={handleSave} className="flex gap-2" aria-label="Sauvegarder cette tenue">
        <label htmlFor={inputId} className="sr-only">Nom de la tenue</label>
        <input
          id={inputId}
          autoFocus
          type="text"
          placeholder="Nom de la tenue…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border border-white/30 rounded-lg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 bg-white/20 backdrop-blur-md text-white placeholder-white/40"
        />
        <button
          type="submit"
          className="bg-white/25 backdrop-blur-md text-white border border-white/30 px-3 rounded-lg text-sm font-medium hover:bg-white/35 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          Sauver
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Annuler"
          className="bg-white/10 backdrop-blur-md text-white/60 border border-white/20 px-3 rounded-lg text-sm hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </form>
    )
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="w-full text-sm text-white font-medium border border-white/40 bg-white/25 backdrop-blur-xl rounded-xl py-2.5 hover:bg-white/35 transition-colors shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 drop-shadow"
    >
      <span aria-hidden="true">💾</span> Sauvegarder cette tenue
    </button>
  )
}
