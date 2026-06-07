import type { Weather } from '../types'

interface Props {
  weather: Weather
}

export function WeatherCard({ weather }: Props) {
  const locationParts = [weather.region, weather.country].filter(Boolean).join(', ')

  return (
    <article
      aria-label={`Météo à ${weather.city}${locationParts ? `, ${locationParts}` : ''} : ${weather.temp}°C, ${weather.description}`}
      className="bg-gradient-to-br from-sky-400 to-blue-600 text-white rounded-2xl p-6 shadow-lg"
    >
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
      <dl className="flex gap-4 mt-4 text-sm opacity-80">
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
  )
}
