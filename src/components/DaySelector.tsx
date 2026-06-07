import type { Weather } from '../types'

interface Props {
  forecast: Weather[]
  selectedDay: number
  onChange: (index: number) => void
}

const DAY_LABELS = ['Aujourd\'hui', 'Demain']

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
}

export function DaySelector({ forecast, selectedDay, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {forecast.map((day, i) => {
        const label = DAY_LABELS[i] ?? (day.date ? formatDate(day.date) : `J+${i}`)
        const isSelected = i === selectedDay
        return (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              isSelected
                ? 'bg-blue-500 text-white shadow'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-300'
            }`}
          >
            <span>{label}</span>
            <span className="text-sm font-bold mt-0.5">{day.temp}°</span>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt=""
              className="w-6 h-6"
            />
          </button>
        )
      })}
    </div>
  )
}
