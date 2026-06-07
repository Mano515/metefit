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

function tempColor(temp: number): string {
  if (temp <= 0) return 'text-blue-500'
  if (temp <= 10) return 'text-sky-500'
  if (temp <= 18) return 'text-green-600 dark:text-green-400'
  if (temp <= 25) return 'text-amber-500'
  return 'text-red-500'
}

export function DayTimeline({ slots }: Props) {
  if (slots.length === 0) return null

  return (
    <section aria-label="Météo de la journée" className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3" aria-hidden="true">Météo de la journée</p>
      <ol aria-label="Prévisions heure par heure" className="flex gap-2 overflow-x-auto pb-1">
        {slots.map((slot) => (
          <li
            key={slot.hour}
            aria-label={`${slot.label} : ${slot.temp}°, ${conditionLabel(slot)}`}
            className="flex-shrink-0 flex flex-col items-center gap-1 min-w-[56px]"
          >
            <span aria-hidden="true" className="text-xs text-gray-400 dark:text-gray-500">{slot.label}</span>
            <span aria-hidden="true" className="text-xl">{conditionEmoji(slot)}</span>
            <span aria-hidden="true" className={`text-sm font-semibold ${tempColor(slot.temp)}`}>{slot.temp}°</span>
            {slot.rain && <span aria-hidden="true" className="text-xs text-blue-400">pluie</span>}
            {slot.snow && <span aria-hidden="true" className="text-xs text-sky-300">neige</span>}
          </li>
        ))}
      </ol>
    </section>
  )
}
