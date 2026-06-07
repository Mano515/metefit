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
          className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Sauver
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Annuler"
          className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-3 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </form>
    )
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="w-full text-sm text-blue-500 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <span aria-hidden="true">💾</span> Sauvegarder cette tenue
    </button>
  )
}
