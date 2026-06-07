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
      className="relative bg-gradient-to-br from-sky-400 to-blue-600 text-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Flèche gauche — pleine hauteur */}
      <button
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Jour précédent"
        className="absolute left-0 top-0 h-full w-12 flex items-center justify-center
                   bg-gradient-to-r from-black/20 to-transparent
                   disabled:opacity-0 disabled:pointer-events-none
                   hover:from-black/30 active:from-black/40
                   transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-inset
                   z-10"
      >
        <span aria-hidden="true" className="text-4xl font-bold drop-shadow">‹</span>
      </button>

      {/* Flèche droite — pleine hauteur */}
      <button
        onClick={onNext}
        disabled={!canNext}
        aria-label="Jour suivant"
        className="absolute right-0 top-0 h-full w-12 flex items-center justify-center
                   bg-gradient-to-l from-black/20 to-transparent
                   disabled:opacity-0 disabled:pointer-events-none
                   hover:from-black/30 active:from-black/40
                   transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-inset
                   z-10"
      >
        <span aria-hidden="true" className="text-4xl font-bold drop-shadow">›</span>
      </button>

      {/* Contenu — padding latéral pour ne pas chevaucher les flèches */}
      <div className="px-14 pt-5 pb-2">
        {/* Nom du jour */}
        <p className="text-center text-base font-bold tracking-wide capitalize opacity-95 mb-3">
          {dayLabel}
        </p>

        {/* Météo */}
        <div className="flex items-center justify-between">
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
      </div>

      {/* Détails */}
      <dl className="flex gap-4 px-14 pb-4 text-sm opacity-80">
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
        <div className="flex justify-center gap-1.5 pb-4" aria-hidden="true">
          {Array.from({ length: totalDays }).map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === selectedDay ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </article>
  )
}
