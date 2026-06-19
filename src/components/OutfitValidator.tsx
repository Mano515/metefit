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
      <p role="status" className="text-center text-sm text-white/50 py-1">
        Tenue du jour validée — {FEEDBACK_LABELS[todayEntry.feedback]}
      </p>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
      <fieldset>
        <legend className="text-xs text-white/50 text-center w-full mb-3">
          J'ai porté cette tenue aujourd'hui…
        </legend>
        <div className="flex gap-2">
          {FEEDBACK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-label={opt.label}
              onClick={() => onFeedback(opt.value)}
              className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/20 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <span aria-hidden="true" className="text-xl">{opt.emoji}</span>
              <span className="text-xs text-white/70">{opt.label}</span>
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
