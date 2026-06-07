import type { HistoryEntry, OutfitFeedback } from '../types'

const FEEDBACK_EMOJI: Record<OutfitFeedback, string> = {
  parfait:    '👌',
  trop_chaud: '🥵',
  trop_froid: '🥶',
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (dateStr === today.toISOString().split('T')[0]) return 'Aujourd\'hui'
  if (dateStr === yesterday.toISOString().split('T')[0]) return 'Hier'
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })
}

interface Props {
  entries: HistoryEntry[]
}

export function HistoryList({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
        Aucun historique pour l'instant.<br />Valide ta tenue du jour pour commencer.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li key={entry.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">{formatDate(entry.date)}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{entry.weatherTemp}° {entry.weatherRain ? '🌧️' : '☀️'} {entry.weatherCity}</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                {entry.items.map((i) => i.name).join(', ')}
              </p>
            </div>
            <span className="text-xl flex-shrink-0">{FEEDBACK_EMOJI[entry.feedback]}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}
