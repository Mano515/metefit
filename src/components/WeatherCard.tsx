import type { Weather } from '../types'

interface Props {
  weather: Weather
  cardGradient?: string
}

export function WeatherCard({ weather, cardGradient }: Props) {
  const locationParts = [weather.region, weather.country].filter(Boolean).join(', ')

  return (
    <div>
      <article
        aria-label={`Météo à ${weather.city}${locationParts ? `, ${locationParts}` : ''} : ${weather.temp}°C, ${weather.description}`}
        className="text-white rounded-2xl shadow-xl ring-1 ring-white/20"
        style={{ background: cardGradient ?? 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)' }}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div>
            <p className="text-sm font-semibold opacity-90">{weather.city}</p>
            {locationParts && (
              <p className="text-xs opacity-70 mb-1">{locationParts}</p>
            )}
            <p className="text-6xl font-bold mt-1">
              {weather.temp}°
            </p>
            <p className="text-sm capitalize opacity-90 mt-1">{weather.description}</p>
          </div>
          <div className="flex-shrink-0">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-20 h-20 drop-shadow-lg"
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

      </article>
    </div>
  )
}
