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
  favsAnimClass?: string
}

export function CitySearch({ currentCity, error, favs, recent, onSelect, onToggleFav, isFav, favsAnimClass = '' }: Props) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([])
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputId = useId()
  const listboxId = useId()
  const errorId = useId()
  const optionIdBase = useId()

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
    setActiveIndex(-1)
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setSuggestions([])
      setActiveIndex(-1)
      setFocused(false)
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelectGeo(suggestions[activeIndex])
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelectGeo(suggestions[activeIndex])
    } else if (suggestions.length > 0) {
      handleSelectGeo(suggestions[0])
    }
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
            aria-activedescendant={activeIndex >= 0 ? `${optionIdBase}-${activeIndex}` : undefined}
            aria-describedby={error ? errorId : undefined}
            placeholder={currentCity ? `${currentCity} — changer de ville...` : 'Entre ta ville (ex: Valence, FR)'}
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            className="flex-1 border border-white/30 rounded-lg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 bg-white/20 backdrop-blur-md text-white placeholder-white/50"
          />
          <button
            type="submit"
            aria-label="Valider la ville"
            className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            OK
          </button>
        </form>

        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-500 px-1 mt-1">{error}</p>
        )}

        {/* Favoris — uniquement si aucune ville active */}
        {!currentCity && favs.length > 0 && (
          <div className={favsAnimClass} style={{ willChange: 'transform, opacity' }}>
            <ul role="list" aria-label="Villes favorites" className="flex flex-col gap-1.5 mt-2">
              {favs.map((city) => (
                <li key={`${city.lat},${city.lon}`} className="flex items-stretch bg-white/20 backdrop-blur-md border border-white/25 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    aria-label={`Chercher la météo à ${city.name}${city.region ? `, ${city.region}` : ''}`}
                    onMouseDown={(e) => { e.preventDefault(); handleSelectSaved(city) }}
                    className="flex-1 flex items-center gap-1.5 pl-3 pr-2 py-2 text-sm text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/50"
                  >
                    <span aria-hidden="true" className="text-sm">⭐</span>
                    <span className="font-medium">{city.name}</span>
                    {city.region && <span className="text-white/60 text-xs">{city.region}</span>}
                  </button>
                  <button
                    type="button"
                    aria-label={`Retirer ${city.name} des favoris`}
                    onMouseDown={(e) => { e.preventDefault(); onToggleFav(city) }}
                    className="flex items-center px-3 text-white/40 hover:text-red-300 hover:bg-white/10 border-l border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-300 text-xs"
                  >
                    <span aria-hidden="true">✕</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
              const isActive = activeIndex === i
              return (
                <li
                  key={i}
                  id={`${optionIdBase}-${i}`}
                  role="option"
                  aria-selected={isActive}
                  className={`flex items-center ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
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
