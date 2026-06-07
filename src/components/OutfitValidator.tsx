import type { OutfitFeedback, HistoryEntry } from '../types'

const FEEDBACK_OPTIONS: { value: OutfitFeedback; emoji: string; label: string }[] = [
  { value: 'parfait',    emoji: '👌', label: 'Parfait' },
  { value: 'trop_chaud', emoji: '🥵', label: 'Trop chaud' },
  { value: 'trop_froid', emoji: '🥶', label: 'Trop froid' },
]

const FEEDBACK_LABELS: Record<OutfitFeedback, string> = {
  parfait:    '👌 Parfait',
  trop_chaud: '🥵 Trop chaud',
  trop_froid: '🥶 Trop froid',
}

interface ValidatorProps {
  onFeedback: (f: OutfitFeedback) => void
  todayEntry?: HistoryEntry
}

export function OutfitValidator({ onFeedback, todayEntry }: ValidatorProps) {
  if (todayEntry) {
    return (
      <div className="text-center text-sm text-gray-400 dark:text-gray-500 py-1">
        Tenue du jour validée — {FEEDBACK_LABELS[todayEntry.feedback]}
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4">
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-3">J'ai porté cette tenue aujourd'hui…</p>
      <div className="flex gap-2">
        {FEEDBACK_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFeedback(opt.value)}
            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-600 dark:hover:bg-blue-900/20 transition-colors text-sm"
          >
            <span className="text-xl">{opt.emoji}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
