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
  cardGradient?: string
}

export function WeatherCard({ weather, selectedDay, totalDays, onPrev, onNext, cardGradient }: Props) {
  const locationParts = [weather.region, weather.country].filter(Boolean).join(', ')
  const dayLabel = formatDayLabel(weather.date, selectedDay)
  const canPrev = selectedDay > 0
  const canNext = selectedDay < totalDays - 1

  return (
    <div aria-label={`Météo ${dayLabel} à ${weather.city}${locationParts ? `, ${locationParts}` : ''} : ${weather.temp}°C, ${weather.description}`}>
      {/* Navigation */}
      <div className="flex items-center justify-between px-2 pb-2">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Jour précédent"
          className="w-10 h-10 flex items-center justify-center rounded-xl text-white/80
                     hover:text-white disabled:opacity-25 disabled:pointer-events-none
                     transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <span aria-hidden="true" className="text-3xl font-bold leading-none -translate-y-px">‹</span>
        </button>

        <p className="text-base font-bold text-white drop-shadow capitalize">{dayLabel}</p>

        <button
          onClick={onNext}
          disabled={!canNext}
          aria-label="Jour suivant"
          className="w-10 h-10 flex items-center justify-center rounded-xl text-white/80
                     hover:text-white disabled:opacity-25 disabled:pointer-events-none
                     transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <span aria-hidden="true" className="text-3xl font-bold leading-none">›</span>
        </button>
      </div>

      {/* Carte météo */}
      <article
        className="text-white rounded-2xl shadow-2xl transition-all duration-1000 ring-1 ring-black/10"
        style={{ background: cardGradient ?? 'linear-gradient(135deg, #1d4ed8 0%, #1e1b4b 100%)' }}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div>
            <p className="text-sm font-semibold opacity-90">{weather.city}</p>
            {locationParts && (
              <p className="text-xs opacity-70 mb-1">{locationParts}</p>
            )}
            <p className="text-6xl font-bold mt-1" aria-label={`${weather.temp} degrés Celsius`}>
              {weather.temp}°
            </p>
            <p className="text-sm capitalize opacity-90 mt-1">{weather.description}</p>
          </div>
          <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-inner">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-16 h-16 drop-shadow-lg"
            />
          </div>
        </div>

        <dl className="flex gap-4 px-6 pb-4 text-sm opacity-90">
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

        {totalDays > 1 && (
          <div className="flex justify-center gap-1.5 pb-4" aria-hidden="true">
            {Array.from({ length: totalDays }).map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === selectedDay ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </article>
    </div>
  )
}
