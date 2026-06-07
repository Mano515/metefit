import { useState } from 'react'
import type { ClothingItem } from '../types'

interface Props {
  items: ClothingItem[]
  onSave: (name: string, items: ClothingItem[]) => void
}

export function SaveOutfitButton({ items, onSave }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

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
      <form onSubmit={handleSave} className="flex gap-2">
        <input
          autoFocus
          type="text"
          placeholder="Nom de la tenue…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button type="submit" className="bg-blue-500 text-white px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          Sauver
        </button>
        <button type="button" onClick={() => setOpen(false)} className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-3 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          ✕
        </button>
      </form>
    )
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="w-full text-sm text-blue-500 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
    >
      💾 Sauvegarder cette tenue
    </button>
  )
}
