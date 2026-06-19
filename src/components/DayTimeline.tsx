import type { TimeSlot } from '../types'

interface Props {
  slots: TimeSlot[]
}

function conditionEmoji(slot: TimeSlot): string {
  if (slot.snow) return '❄️'
  if (slot.rain) return '🌧️'
  const icon = slot.icon
  if (icon.startsWith('01')) return '☀️'
  if (icon.startsWith('02') || icon.startsWith('03')) return '⛅'
  if (icon.startsWith('04')) return '☁️'
  if (icon.startsWith('09') || icon.startsWith('10')) return '🌧️'
  if (icon.startsWith('11')) return '⛈️'
  if (icon.startsWith('13')) return '❄️'
  if (icon.startsWith('50')) return '🌫️'
  return '🌤️'
}

function conditionLabel(slot: TimeSlot): string {
  if (slot.snow) return 'neige'
  if (slot.rain) return 'pluie'
  const icon = slot.icon
  if (icon.startsWith('01')) return 'ensoleillé'
  if (icon.startsWith('02') || icon.startsWith('03')) return 'partiellement nuageux'
  if (icon.startsWith('04')) return 'nuageux'
  if (icon.startsWith('09') || icon.startsWith('10')) return 'pluie'
  if (icon.startsWith('11')) return 'orage'
  if (icon.startsWith('13')) return 'neige'
  if (icon.startsWith('50')) return 'brouillard'
  return 'variable'
}


export function DayTimeline({ slots }: Props) {
  if (slots.length === 0) return null

  return (
    <section aria-label="Météo de la journée" className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl p-4 shadow-lg">
      <p className="text-xs font-semibold text-white uppercase tracking-widest mb-3 drop-shadow" aria-hidden="true">Météo de la journée</p>
      <ol
        aria-label="Prévisions heure par heure"
        className="flex gap-2 overflow-x-auto pb-1"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {slots.map((slot) => (
          <li
            key={slot.hour}
            aria-label={slot.isPast ? `${slot.label} (passé)` : `${slot.label} : ${slot.temp}°, ${conditionLabel(slot)}`}
            className={`flex-shrink-0 flex flex-col items-center gap-1 min-w-[56px] transition-opacity ${slot.isPast ? 'opacity-30' : 'opacity-100'}`}
          >
            <span aria-hidden="true" className="text-xs text-white font-medium drop-shadow-sm">{slot.label}</span>
            {slot.isPast ? (
              <>
                <span aria-hidden="true" className="text-xl">—</span>
                <span aria-hidden="true" className="text-sm font-semibold text-white/40">–</span>
              </>
            ) : (
              <>
                <span aria-hidden="true" className="text-xl">{conditionEmoji(slot)}</span>
                <span aria-hidden="true" className="text-sm font-semibold text-white">{slot.temp}°</span>
                {slot.rain && <span aria-hidden="true" className="text-xs text-blue-200">pluie</span>}
                {slot.snow && <span aria-hidden="true" className="text-xs text-sky-200">neige</span>}
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
