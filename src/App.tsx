import { useState, useEffect, useRef } from 'react'
import { useWeather } from './hooks/useWeather'
import { useWardrobe } from './hooks/useWardrobe'
import { useThermal } from './hooks/useThermal'
import { useHistory } from './hooks/useHistory'
import { useSavedOutfits } from './hooks/useSavedOutfits'
import { useNotifications } from './hooks/useNotifications'
import { WeatherCard } from './components/WeatherCard'
import { DayTimeline } from './components/DayTimeline'
import { DayChangeAlert } from './components/DayChangeAlert'
import { AddClothingForm } from './components/AddClothingForm'
import { ClothingList } from './components/ClothingList'
import { OutfitSuggestion } from './components/OutfitSuggestion'
import { SaveOutfitButton } from './components/SaveOutfitButton'
import { SavedOutfitLibrary } from './components/SavedOutfitLibrary'
import { HistoryList } from './components/HistoryList'
import { CitySearch } from './components/CitySearch'
import { SettingsPanel } from './components/SettingsPanel'
import { SplashScreen } from './components/SplashScreen'
import { DaySelector } from './components/DaySelector'
import { useCityMemory } from './hooks/useCityMemory'
import { useSwipe } from './hooks/useSwipe'
import { getDefaultSuggestion } from './utils/defaultSuggestions'
import { getWeatherTheme } from './utils/weatherGradient'
import './index.css'

type View = 'suggestion' | 'wardrobe' | 'historique'

const VIEW_LABELS: Record<View, string> = {
  suggestion: 'Météfit',
  wardrobe:   '👕 Garde-robe',
  historique: '📅 Historique',
}

export default function App() {
  // ── Data & state ──────────────────────────────────────────────────────────
  const { weather, forecast, slots, selectedDay, setSelectedDay, loading, error, searchCity } = useWeather()
  const { items, addItem, removeItem, getSuggestion } = useWardrobe()
  const { profile, setProfile, offset, lastAutoAdjust, clearAutoAdjustNotice } = useThermal()
  const { entries } = useHistory()
  const { outfits, saveOutfit, removeOutfit } = useSavedOutfits()
  const { permission, requestPermission, sendMorningNotif } = useNotifications()
  const { favs, recent, addToRecent, toggleFav, isFav } = useCityMemory()
  const [splashDone, setSplashDone] = useState(false)
  const [view, setView] = useState<View>('suggestion')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [contentAnim, setContentAnim] = useState('')
  const [favsAnim, setFavsAnim] = useState('')
  // animating guards against overlapping day-slide transitions
  const animating = useRef(false)
  const prevCityRef = useRef<string | undefined>(undefined)

  // ── Derive outfit: personal wardrobe first, default catalog as fallback ───
  const personalSuggestion = weather ? getSuggestion(weather, slots, offset) : []
  const suggestion = personalSuggestion.length > 0
    ? personalSuggestion
    : weather ? getDefaultSuggestion(weather, slots, offset) : []
  const isDefault = personalSuggestion.length === 0

  // ── Day navigation with slide animation ──────────────────────────────────
  function goToDay(newDay: number, dir: 'next' | 'prev') {
    if (animating.current) return
    animating.current = true
    setContentAnim(dir === 'next' ? 'day-slide-out-left' : 'day-slide-out-right')
    setTimeout(() => {
      setSelectedDay(newDay)
      setContentAnim(dir === 'next' ? 'day-slide-in-right' : 'day-slide-in-left')
      setTimeout(() => {
        setContentAnim('')
        animating.current = false
      }, 220)
    }, 200)
  }

  // Slide content in whenever the city changes (first load or new search)
  useEffect(() => {
    if (!weather?.city) return
    if (prevCityRef.current === undefined) {
      prevCityRef.current = weather.city
      setContentAnim('day-slide-in-right')
      setTimeout(() => setContentAnim(''), 220)
      return
    }
    if (weather.city !== prevCityRef.current) {
      prevCityRef.current = weather.city
      setContentAnim('day-slide-in-right')
      setFavsAnim('day-slide-in-right')
      setTimeout(() => { setContentAnim(''); setFavsAnim('') }, 220)
    }
  }, [weather?.city])

  // Fire morning notification once per day when weather + outfit are ready
  useEffect(() => {
    if (weather && suggestion.length > 0) sendMorningNotif(weather, suggestion)
  }, [weather?.city, suggestion.length])

  // ── Swipe to change day on mobile ────────────────────────────────────────
  const canPrev = selectedDay > 0
  const canNext = selectedDay < forecast.length - 1

  const swipeHandlers = useSwipe({
    onSwipeLeft:  () => { if (canNext) goToDay(selectedDay + 1, 'next') },
    onSwipeRight: () => { if (canPrev) goToDay(selectedDay - 1, 'prev') },
  })

  const isSuggestionView = view === 'suggestion'

  const theme = getWeatherTheme(weather?.icon, new Date().getHours())
  const isLanding = !weather

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-dvh overflow-x-hidden" style={{ background: theme.bg }}>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <a href="#main-content" className="skip-link">Aller au contenu principal</a>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        profile={profile}
        onProfileChange={setProfile}
        autoAdjust={lastAutoAdjust}
        onDismissAutoAdjust={clearAutoAdjustNotice}
        notifPermission={permission}
        onRequestNotif={requestPermission}
        onNavigate={(v) => setView(v)}
      />

      {/* Landing page — shown before any city is selected */}
      {isLanding ? (
        <main id="main-content" className="min-h-dvh flex flex-col items-center justify-center px-4 relative">
          <button
            onClick={() => setSettingsOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={settingsOpen}
            aria-controls="settings-panel"
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <span aria-hidden="true">☰</span>
          </button>

          <div className="w-full max-w-xs lg:max-w-2xl space-y-6 lg:space-y-8 text-center">
            {/* Icon-only on mobile, full wordmark on desktop */}
            <h1 aria-label="Météfit" className="flex flex-col items-center gap-3">
              <img src="/logo_metefit.svg" alt="" aria-hidden="true" className="h-16 w-16 lg:h-20 lg:w-20" />
              <img src="/logo_metefit_nom.svg" alt="Météfit" className="h-10 w-auto max-w-[260px] hidden lg:block" />
            </h1>

            <div className={favsAnim} style={{ willChange: 'transform, opacity' }}>
              <CitySearch
                currentCity={undefined}
                favsAnimClass=""
                error={error}
                favs={favs}
                recent={recent}
                onSelect={(coords, city) => {
                  searchCity(coords)
                  addToRecent(city)
                }}
                onToggleFav={toggleFav}
                isFav={isFav}
              />
            </div>

            {loading && (
              <p className="text-sm text-white/60 animate-pulse">Chargement de la météo…</p>
            )}
          </div>
        </main>
      ) : (
        <>
          {/* ── Header ── */}
          <header className="sticky top-0 z-10">
            <div className="w-full lg:w-4/5 mx-auto px-3 lg:px-8 py-3 flex items-center gap-2 lg:gap-4">

              {isSuggestionView ? (
                <h1 aria-label="Météfit" className="flex-shrink-0">
                  <img src="/logo_metefit.svg" alt="" aria-hidden="true" className="h-10 w-10 lg:hidden" />
                  <img src="/logo_metefit_nom.svg" alt="Météfit" className="h-8 w-auto hidden lg:block" />
                </h1>
              ) : (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setView('suggestion')}
                    aria-label="Retour à la tenue"
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    <span aria-hidden="true">←</span>
                  </button>
                  <h1 className="text-lg font-bold text-white whitespace-nowrap">{VIEW_LABELS[view]}</h1>
                </div>
              )}

              {/* Search bar takes all remaining horizontal space */}
              <div className="flex-1 min-w-0">
                <CitySearch
                  currentCity={weather?.city}
                  favsAnimClass={favsAnim}
                  error={error}
                  favs={favs}
                  recent={recent}
                  onSelect={(coords, city) => {
                    setFavsAnim('day-slide-out-left')
                    if (weather) setContentAnim('day-slide-out-left')
                    searchCity(coords)
                    addToRecent(city)
                  }}
                  onToggleFav={toggleFav}
                  isFav={isFav}
                />
              </div>

              <button
                onClick={() => setSettingsOpen(true)}
                aria-label="Ouvrir le menu"
                aria-expanded={settingsOpen}
                aria-controls="settings-panel"
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <span aria-hidden="true">☰</span>
              </button>
            </div>
          </header>

          {/* ── Content ── */}
          <div className="w-full lg:w-4/5 mx-auto px-4 lg:px-8 pb-4 lg:py-6">
            <main id="main-content">

              {/* Suggestion view */}
              {view === 'suggestion' && (
                <>
                  {loading && !!prevCityRef.current && (
                    <div className="bg-white/10 rounded-2xl p-6 animate-pulse h-44" role="status" aria-label="Chargement de la météo…" />
                  )}

                  {weather && (
                    <>
                      <div className="sticky top-0 z-10 -mx-4 lg:-mx-8 px-4 lg:px-8 lg:py-3 backdrop-blur-md">
                        <DaySelector
                          forecast={forecast}
                          selectedDay={selectedDay}
                          onSelect={(i) => goToDay(i, i > selectedDay ? 'next' : 'prev')}
                        />
                      </div>

                    <div
                      className={contentAnim}
                      style={{ willChange: 'transform, opacity' }}
                      {...swipeHandlers}
                      aria-live="polite"
                      aria-busy={contentAnim ? 'true' : 'false'}
                    >
                      {/* Single column on mobile, two columns on desktop */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:items-start">

                        <div className="space-y-4 lg:space-y-6">
                          <WeatherCard
                            weather={weather}
                            cardGradient={theme.card}
                          />
                          <DayTimeline slots={slots} />
                          <DayChangeAlert slots={slots} />
                        </div>

                        <div className="space-y-4 lg:space-y-6">
                          <OutfitSuggestion items={suggestion} isDefault={isDefault} slots={slots} />
                        </div>
                      </div>
                    </div>
                    </>
                  )}
                </>
              )}

              {/* Wardrobe view */}
              {view === 'wardrobe' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-start">
                  <div className="space-y-4">
                    <AddClothingForm onAdd={addItem} />
                  </div>
                  <div className="space-y-4">
                    <ClothingList items={items} onRemove={removeItem} />
                    {outfits.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-white/50 uppercase tracking-wide mb-2">
                          Tenues sauvegardées
                        </p>
                        <SavedOutfitLibrary outfits={outfits} onRemove={removeOutfit} />
                      </div>
                    )}
                    <SaveOutfitButton items={suggestion} onSave={saveOutfit} />
                  </div>
                </div>
              )}

              {/* History view */}
              {view === 'historique' && (
                <div className="max-w-2xl mx-auto">
                  <HistoryList entries={entries} />
                </div>
              )}

            </main>
          </div>
        </>
      )}
    </div>
  )
}
