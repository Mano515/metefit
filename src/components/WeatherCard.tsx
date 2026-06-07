import type { Weather } from '../types'

const DAY_LABELS = ['Aujourd\'hui', 'Demain']

function formatDayLabel(dateStr: string | undefined, index: number): string {
  if (DAY_LABELS[index]) return DAY_LABELS[index]
  if (!dateStr) return `Jour +${index}`
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })
}

interface Props {
  weather: Weather
  selectedDay: number
  totalDays: number
  onPrev: () => void
  onNext: () => void
}

export function WeatherCard({ weather, selectedDay, totalDays, onPrev, onNext }: Props) {
  const locationParts = [weather.region, weather.country].filter(Boolean).join(', ')
  const dayLabel = formatDayLabel(weather.date, selectedDay)
  const canPrev = selectedDay > 0
  const canNext = selectedDay < totalDays - 1

  return (
    <article
      aria-label={`Météo ${dayLabel} à ${weather.city}${locationParts ? `, ${locationParts}` : ''} : ${weather.temp}°C, ${weather.description}`}
      className="bg-gradient-to-br from-sky-400 to-blue-600 text-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Barre de navigation des jours */}
      <div className="flex items-center justify-between px-4 pt-4 pb-1">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Jour précédent"
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors disabled:opacity-20 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <span aria-hidden="true" className="text-lg leading-none">‹</span>
        </button>

        <p className="text-sm font-semibold tracking-wide capitalize opacity-95">
          {dayLabel}
        </p>

        <button
          onClick={onNext}
          disabled={!canNext}
          aria-label="Jour suivant"
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors disabled:opacity-20 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <span aria-hidden="true" className="text-lg leading-none">›</span>
        </button>
      </div>

      {/* Contenu météo */}
      <div className="flex items-center justify-between px-6 pb-5 pt-2">
        <div>
          <p className="text-sm font-medium opacity-90">{weather.city}</p>
          {locationParts && (
            <p className="text-xs opacity-60 mb-1">{locationParts}</p>
          )}
          <p className="text-6xl font-bold mt-1" aria-label={`${weather.temp} degrés Celsius`}>
            {weather.temp}°
          </p>
          <p className="text-sm capitalize opacity-90 mt-1">{weather.description}</p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-20 h-20"
        />
      </div>

      {/* Détails */}
      <dl className="flex gap-4 px-6 pb-4 text-sm opacity-80">
        <div>
          <dt className="sr-only">Ressenti</dt>
          <dd>Ressenti {weather.feelsLike}°</dd>
        </div>
        <span aria-hidden="true">·</span>
        <div>
          <dt className="sr-only">Vent</dt>
          <dd>Vent {weather.wind} km/h</dd>
        </div>
        {weather.rain && (
          <>
            <span aria-hidden="true">·</span>
            <div>
              <dt className="sr-only">Précipitations</dt>
              <dd><span aria-hidden="true">🌧</span> Pluie</dd>
            </div>
          </>
        )}
      </dl>

      {/* Indicateurs de pagination */}
      {totalDays > 1 && (
        <div className="flex justify-center gap-1.5 pb-3" aria-hidden="true">
          {Array.from({ length: totalDays }).map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all ${
                i === selectedDay ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </article>
  )
}
