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
    <section aria-label="Météo de la journée" className="bg-white/30 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-xl shadow-black/10">
      <p className="text-xs font-bold text-white uppercase tracking-widest mb-4 drop-shadow" aria-hidden="true">Météo de la journée</p>
      {/* stopPropagation prevents the parent day-swipe handler from stealing horizontal touch events */}
      <ol
        aria-label="Prévisions heure par heure"
        className="grid pb-1"
        style={{ gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))` }}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {slots.map((slot) => (
          <li
            key={slot.hour}
            aria-label={slot.isPast ? `${slot.label} (passé)` : `${slot.label} : ${slot.temp}°, ${conditionLabel(slot)}`}
            className={`flex flex-col items-center gap-1.5 ${slot.isPast ? 'opacity-25' : 'opacity-100'}`}
          >
            <span aria-hidden="true" className={`text-xs font-semibold drop-shadow-sm ${slot.isPast ? 'text-white/60' : 'text-white'}`}>
              {slot.label}
            </span>
            {slot.isPast ? (
              <>
                <span aria-hidden="true" className="text-2xl text-white/40">—</span>
                <span aria-hidden="true" className="text-base font-bold text-white/40">–</span>
              </>
            ) : (
              <>
                <span aria-hidden="true" className="text-2xl drop-shadow">{conditionEmoji(slot)}</span>
                <span aria-hidden="true" className="text-base font-bold text-white drop-shadow">{slot.temp}°</span>
                {slot.rain && <span aria-hidden="true" className="text-xs text-white font-medium">pluie</span>}
                {slot.snow && <span aria-hidden="true" className="text-xs text-white font-medium">neige</span>}
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
