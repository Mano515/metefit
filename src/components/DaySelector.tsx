import type { Weather } from '../types'

interface Props {
  forecast: Weather[]
  selectedDay: number
  onChange: (index: number) => void
}

const DAY_LABELS = ['Aujourd\'hui', 'Demain']

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
}

export function DaySelector({ forecast, selectedDay, onChange }: Props) {
  return (
    <nav aria-label="Sélection du jour">
      <div role="tablist" aria-label="Jours de prévision" className="flex gap-2 overflow-x-auto pb-1">
        {forecast.map((day, i) => {
          const shortLabel = DAY_LABELS[i] ?? (day.date ? formatDateShort(day.date) : `Jour +${i}`)
          const fullLabel = DAY_LABELS[i] ?? (day.date ? formatDate(day.date) : `Dans ${i} jours`)
          const isSelected = i === selectedDay
          return (
            <button
              key={i}
              role="tab"
              aria-selected={isSelected}
              aria-label={`${fullLabel}, ${day.temp}°C, ${day.description ?? ''}`}
              onClick={() => onChange(i)}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                isSelected
                  ? 'bg-blue-500 text-white shadow'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              <span>{shortLabel}</span>
              <span className="text-sm font-bold mt-0.5" aria-hidden="true">{day.temp}°</span>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt=""
                aria-hidden="true"
                className="w-6 h-6"
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
