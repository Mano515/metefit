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

function tempColor(temp: number): string {
  if (temp <= 0) return 'text-blue-500'
  if (temp <= 10) return 'text-sky-500'
  if (temp <= 18) return 'text-green-600'
  if (temp <= 25) return 'text-amber-500'
  return 'text-red-500'
}

export function DayTimeline({ slots }: Props) {
  if (slots.length === 0) return null

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Météo de la journée</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {slots.map((slot) => (
          <div
            key={slot.hour}
            className="flex-shrink-0 flex flex-col items-center gap-1 min-w-[56px]"
          >
            <span className="text-xs text-gray-400">{slot.label}</span>
            <span className="text-xl">{conditionEmoji(slot)}</span>
            <span className={`text-sm font-semibold ${tempColor(slot.temp)}`}>
              {slot.temp}°
            </span>
            {slot.rain && <span className="text-xs text-blue-400">pluie</span>}
            {slot.snow && <span className="text-xs text-sky-300">neige</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
