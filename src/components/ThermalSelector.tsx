import type { ThermalProfile } from '../types'

const OPTIONS: { value: ThermalProfile; label: string; emoji: string; desc: string }[] = [
  { value: 'frileux', emoji: '🥶', label: 'Frileux',     desc: '-5°C' },
  { value: 'normal',  emoji: '😊', label: 'Normal',      desc: '±0°C' },
  { value: 'chaud',   emoji: '🥵', label: 'J\'ai chaud', desc: '+5°C' },
]

interface Props {
  profile: ThermalProfile
  onChange: (p: ThermalProfile) => void
}

export function ThermalSelector({ profile, onChange }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
      <fieldset>
        <legend className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
          Mon confort thermique
        </legend>
        <div role="radiogroup" className="flex gap-2">
          {OPTIONS.map((opt) => {
            const selected = profile === opt.value
            return (
              <button
                key={opt.value}
                role="radio"
                aria-checked={selected}
                aria-label={`${opt.label} (décalage ${opt.desc})`}
                onClick={() => onChange(opt.value)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-sm transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  selected
                    ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                    : 'border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-gray-600'
                }`}
              >
                <span aria-hidden="true" className="text-xl">{opt.emoji}</span>
                <span className="font-medium text-xs">{opt.label}</span>
                <span className="text-xs opacity-60" aria-hidden="true">{opt.desc}</span>
              </button>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}
