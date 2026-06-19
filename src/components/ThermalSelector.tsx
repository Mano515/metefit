import { useRef } from 'react'
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
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    let next = index
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      next = (index + 1) % OPTIONS.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      next = (index - 1 + OPTIONS.length) % OPTIONS.length
    } else {
      return
    }
    onChange(OPTIONS[next].value)
    btnRefs.current[next]?.focus()
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
      <fieldset>
        <legend className="text-xs font-medium text-white/50 uppercase tracking-wide mb-3">
          Mon confort thermique
        </legend>
        <div role="radiogroup" className="flex gap-2">
          {OPTIONS.map((opt, i) => {
            const selected = profile === opt.value
            return (
              <button
                key={opt.value}
                ref={(el) => { btnRefs.current[i] = el }}
                role="radio"
                aria-checked={selected}
                aria-label={`${opt.label} (décalage ${opt.desc})`}
                tabIndex={selected ? 0 : -1}
                onClick={() => onChange(opt.value)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-sm transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                  selected
                    ? 'bg-white/25 border-white/40 text-white'
                    : 'border-white/15 text-white/50 hover:bg-white/10 hover:border-white/25'
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
