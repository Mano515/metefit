import { Weather } from '../types'

interface Props {
  weather: Weather
}

export function WeatherCard({ weather }: Props) {
  return (
    <div className="bg-gradient-to-br from-sky-400 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{weather.city}</p>
          <p className="text-6xl font-bold mt-1">{weather.temp}°</p>
          <p className="text-sm capitalize opacity-90 mt-1">{weather.description}</p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-20 h-20"
        />
      </div>
      <div className="flex gap-4 mt-4 text-sm opacity-80">
        <span>Ressenti {weather.feelsLike}°</span>
        <span>·</span>
        <span>Vent {weather.wind} km/h</span>
        {weather.rain && (
          <>
            <span>·</span>
            <span>🌧 Pluie</span>
          </>
        )}
      </div>
    </div>
  )
}
