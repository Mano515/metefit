import { useState, useRef, useEffect } from 'react'

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
  onSelect: (city: string) => void
}

export function CitySearch({ currentCity, error, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleChange(value: string) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.trim().length < 2) { setSuggestions([]); setOpen(false); return }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(value)}&limit=5&appid=${API_KEY}`
        )
        const data: GeoSuggestion[] = await res.json()
        setSuggestions(data)
        setOpen(data.length > 0)
      } catch {
        setSuggestions([])
        setOpen(false)
      }
    }, 300)
  }

  function handleSelect(s: GeoSuggestion) {
    setQuery('')
    setSuggestions([])
    setOpen(false)
    onSelect(`${s.lat},${s.lon}`) // on passe les coords directement
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    if (suggestions.length > 0) {
      handleSelect(suggestions[0])
    } else {
      onSelect(query.trim())
      setQuery('')
    }
  }

  return (
    <div ref={containerRef} className="relative space-y-1">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder={currentCity ? `${currentCity} — changer de ville...` : 'Entre ta ville (ex: Valence, FR)'}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />
        <button
          type="submit"
          className="bg-gray-200 text-gray-700 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
        >
          OK
        </button>
      </form>

      {error && <p className="text-xs text-red-500 px-1">{error}</p>}

      {open && suggestions.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((s, i) => {
            const parts = [s.name, s.state, countryLabel(s.country)].filter(Boolean)
            return (
              <li key={i}>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(s) }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <span className="text-gray-400 text-xs">📍</span>
                  <span className="font-medium text-gray-800">{parts[0]}</span>
                  {parts.length > 1 && (
                    <span className="text-gray-400 text-xs">{parts.slice(1).join(', ')}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
