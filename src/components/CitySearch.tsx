import { useState, useRef, useEffect, useId } from 'react'
import type { SavedCity } from '../hooks/useCityMemory'

const API_KEY = 'b1bbad1503a2ff186dd957972daf4b53'

interface GeoSuggestion {
  name: string
  state?: string
  country: string
  lat: number
  lon: number
}

const countryNames = new Intl.DisplayNames(['fr'], { type: 'region' })
function countryLabel(code: string): string {
  try { return countryNames.of(code) ?? code } catch { return code }
}

interface Props {
  currentCity?: string
  error?: string | null
  favs: SavedCity[]
  recent: SavedCity[]
  onSelect: (coords: string, city: SavedCity) => void
  onToggleFav: (city: SavedCity) => void
  isFav: (city: SavedCity) => boolean
}

export function CitySearch({ currentCity, error, favs, recent, onSelect, onToggleFav, isFav }: Props) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([])
  const [focused, setFocused] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputId = useId()
  const listboxId = useId()
  const errorId = useId()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleChange(value: string) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.trim().length < 2) { setSuggestions([]); return }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(value)}&limit=5&appid=${API_KEY}`
        )
        const data: GeoSuggestion[] = await res.json()
        setSuggestions(data)
      } catch {
        setSuggestions([])
      }
    }, 300)
  }

  function handleSelectGeo(s: GeoSuggestion) {
    const city: SavedCity = { name: s.name, region: s.state, country: countryLabel(s.country), lat: s.lat, lon: s.lon }
    setQuery('')
    setSuggestions([])
    setFocused(false)
    onSelect(`${s.lat},${s.lon}`, city)
  }

  function handleSelectSaved(city: SavedCity) {
    setFocused(false)
    onSelect(`${city.lat},${city.lon}`, city)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    if (suggestions.length > 0) handleSelectGeo(suggestions[0])
  }

  const showSuggestions = focused && query.trim().length >= 2 && suggestions.length > 0
  const showQuickAccess = focused && query.trim().length < 2 && (recent.length > 0 || favs.length === 0)
  const isExpanded = showSuggestions || showQuickAccess

  return (
    <div ref={containerRef} className="space-y-2">
      {/* Barre de recherche */}
      <div className="relative">
        <form onSubmit={handleSubmit} className="flex gap-2" role="search" aria-label="Recherche de ville">
          <label htmlFor={inputId} className="sr-only">
            {currentCity ? `Ville actuelle : ${currentCity}. Changer de ville` : 'Rechercher une ville'}
          </label>
          <input
            id={inputId}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isExpanded}
            aria-controls={isExpanded ? listboxId : undefined}
            aria-describedby={error ? errorId : undefined}
            placeholder={currentCity ? `${currentCity} — changer de ville...` : 'Entre ta ville (ex: Valence, FR)'}
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            autoComplete="off"
            className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            type="submit"
            aria-label="Valider la ville"
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            OK
          </button>
        </form>

        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-500 px-1 mt-1">{error}</p>
        )}

        {/* Favoris — uniquement si aucune ville active */}
        {!currentCity && favs.length > 0 && (
          <ul role="list" aria-label="Villes favorites" className="grid grid-cols-2 gap-2 mt-2">
            {favs.map((city) => (
              <li key={`${city.lat},${city.lon}`} className="flex items-stretch bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                <button
                  type="button"
                  aria-label={`Chercher la météo à ${city.name}${city.region ? `, ${city.region}` : ''}`}
                  onMouseDown={(e) => { e.preventDefault(); handleSelectSaved(city) }}
                  className="flex items-center gap-1.5 pl-3 pr-2 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400"
                >
                  <span aria-hidden="true" className="text-sm">⭐</span>
                  <span className="font-medium">{city.name}</span>
                  {city.region && <span className="text-gray-400 dark:text-gray-500 text-xs">{city.region}</span>}
                </button>
                <button
                  type="button"
                  aria-label={`Retirer ${city.name} des favoris`}
                  onMouseDown={(e) => { e.preventDefault(); onToggleFav(city) }}
                  className="flex items-center px-2 text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-l border-gray-100 dark:border-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-400 text-xs"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Dropdown : suggestions de l'API */}
        {showSuggestions && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Suggestions de villes"
            className="absolute z-10 left-0 right-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden mt-1"
          >
            {suggestions.map((s, i) => {
              const geo: SavedCity = { name: s.name, region: s.state, country: countryLabel(s.country), lat: s.lat, lon: s.lon }
              const alreadyFav = isFav(geo)
              const label = [s.name, s.state, countryLabel(s.country)].filter(Boolean).join(', ')
              return (
                <li key={i} role="option" aria-selected={false} className="flex items-center">
                  <button
                    type="button"
                    aria-label={`Sélectionner ${label}`}
                    onMouseDown={(e) => { e.preventDefault(); handleSelectGeo(s) }}
                    className="flex-1 text-left px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400"
                  >
                    <span aria-hidden="true" className="text-gray-400 text-xs">📍</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">{s.name}</span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs">{[s.state, countryLabel(s.country)].filter(Boolean).join(', ')}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={alreadyFav ? `Retirer ${s.name} des favoris` : `Ajouter ${s.name} aux favoris`}
                    aria-pressed={alreadyFav}
                    onMouseDown={(e) => { e.preventDefault(); onToggleFav(geo) }}
                    className="px-3 py-2.5 text-base hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-400"
                  >
                    <span aria-hidden="true">{alreadyFav ? '⭐' : '☆'}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {/* Dropdown : historique récent */}
        {showQuickAccess && recent.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Recherches récentes"
            className="absolute z-10 left-0 right-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden mt-1"
          >
            <li role="presentation" className="px-4 pt-2 pb-1">
              <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">Recherches récentes</span>
            </li>
            {recent.map((city) => {
              const label = [city.name, city.region, city.country].filter(Boolean).join(', ')
              return (
                <li key={`${city.lat},${city.lon}`} role="option" aria-selected={false} className="flex items-center">
                  <button
                    type="button"
                    aria-label={`Sélectionner ${label}`}
                    onMouseDown={(e) => { e.preventDefault(); handleSelectSaved(city) }}
                    className="flex-1 text-left px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400"
                  >
                    <span aria-hidden="true" className="text-gray-400 text-xs">🕐</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">{city.name}</span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs">{[city.region, city.country].filter(Boolean).join(', ')}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Ajouter ${city.name} aux favoris`}
                    aria-pressed={false}
                    onMouseDown={(e) => { e.preventDefault(); onToggleFav(city) }}
                    className="px-3 py-2.5 text-base hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-400"
                  >
                    <span aria-hidden="true">☆</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
