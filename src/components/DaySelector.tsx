import type { Weather } from '../types'

const SHORT_LABELS = ["Aujourd'hui", 'Demain']

function getDayLabel(dateStr: string | undefined, index: number): string {
  if (SHORT_LABELS[index]) return SHORT_LABELS[index]
  if (!dateStr) return `J+${index}`
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('fr-FR', { weekday: 'long' })
}

interface Props {
  forecast: Weather[]
  selectedDay: number
  onSelect: (day: number) => void
}

export function DaySelector({ forecast, selectedDay, onSelect }: Props) {
  if (forecast.length <= 1) return null

  const canPrev = selectedDay > 0
  const canNext = selectedDay < forecast.length - 1
  const label = getDayLabel(forecast[selectedDay]?.date, selectedDay)

  return (
    <nav aria-label="Sélection du jour" className="mb-2 lg:mb-6">

      {/* Mobile : flèches */}
      <div className="flex lg:hidden items-center justify-between px-2">
        <button
          onClick={() => canPrev && onSelect(selectedDay - 1)}
          disabled={!canPrev}
          aria-label="Jour précédent"
          className="w-10 h-10 flex items-center justify-center rounded-xl text-white/80 hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <span aria-hidden="true" className="text-3xl font-bold leading-none">‹</span>
        </button>
        <p className="text-base font-bold text-white drop-shadow capitalize">{label}</p>
        <button
          onClick={() => canNext && onSelect(selectedDay + 1)}
          disabled={!canNext}
          aria-label="Jour suivant"
          className="w-10 h-10 flex items-center justify-center rounded-xl text-white/80 hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <span aria-hidden="true" className="text-3xl font-bold leading-none">›</span>
        </button>
      </div>

      {/* Desktop : pills */}
      <div className="hidden lg:flex justify-center">
        <div className="flex gap-2 bg-white/20 backdrop-blur-md rounded-2xl p-1.5 border border-white/30">
          {forecast.map((day, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              aria-current={i === selectedDay ? 'date' : undefined}
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 capitalize whitespace-nowrap ${
                i === selectedDay
                  ? 'bg-white/40 text-white shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/20'
              }`}
            >
              {getDayLabel(day.date, i)}
            </button>
          ))}
        </div>
      </div>

    </nav>
  )
}

