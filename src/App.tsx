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
  const [showOptions, setShowOptions] = useState(false)
  const [contentAnim, setContentAnim] = useState('')
  const [favsAnim, setFavsAnim] = useState('')
  const animating = useRef(false)
  const prevCityRef = useRef<string | undefined>(undefined)

  const personalSuggestion = weather ? getSuggestion(weather, slots, offset) : []
  const suggestion = personalSuggestion.length > 0
    ? personalSuggestion
    : weather ? getDefaultSuggestion(weather, slots, offset) : []
  const isDefault = personalSuggestion.length === 0

  function goToDay(newDay: number, dir: 'next' | 'prev') {
    if (animating.current) return
    animating.current = true
    setContentAnim(dir === 'next' ? 'day-slide-out-left' : 'day-slide-out-right')
    setTimeout(() => {
      setSelectedDay(newDay)
      setShowOptions(false)
      setContentAnim(dir === 'next' ? 'day-slide-in-right' : 'day-slide-in-left')
      setTimeout(() => {
        setContentAnim('')
        animating.current = false
      }, 220)
    }, 200)
  }

  // Animation d'entrée quand une nouvelle ville est chargée
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

  useEffect(() => {
    if (weather && suggestion.length > 0) sendMorningNotif(weather, suggestion)
  }, [weather?.city, suggestion.length])


  const canPrev = selectedDay > 0
  const canNext = selectedDay < forecast.length - 1

  const swipeHandlers = useSwipe({
    onSwipeLeft:  () => { if (canNext) goToDay(selectedDay + 1, 'next') },
    onSwipeRight: () => { if (canPrev) goToDay(selectedDay - 1, 'prev') },
  })

  const isSuggestionView = view === 'suggestion'

  const theme = getWeatherTheme(weather?.icon, new Date().getHours())
  const isLanding = !weather && !loading
  const landingBg = 'linear-gradient(160deg, #3a6ea8 0%, #5b8fc4 50%, #7aaed8 100%)'

  return (
    <div className="min-h-screen transition-all duration-1000" style={{ background: isLanding ? landingBg : theme.bg }}>
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

      {/* ── Page d'accueil (aucune ville) ── */}
      {isLanding ? (
        <main id="main-content" className="min-h-screen flex flex-col items-center justify-center px-4 relative">
          {/* Bouton menu en haut à droite */}
          <button
            onClick={() => setSettingsOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={settingsOpen}
            aria-controls="settings-panel"
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <span aria-hidden="true">☰</span>
          </button>

          <div className="w-full max-w-md space-y-8 text-center">
            <h1 aria-label="Météfit">
              <img src="/logo_metefit_nom.svg" alt="Météfit" className="h-16 mx-auto" />
            </h1>
            <CitySearch
              currentCity={undefined}
              favsAnimClass={favsAnim}
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
        </main>
      ) : (
        <>
          {/* ── Header ── */}
          <header className="sticky top-0 z-10 backdrop-blur-md bg-black/10 border-b border-white/10">
            <div className="w-full lg:w-4/5 mx-auto px-4 lg:px-8 py-3 flex items-center gap-4">

              {/* Logo / titre */}
              {isSuggestionView ? (
                <h1 aria-label="Météfit" className="flex-shrink-0">
                  <img src="/logo_metefit_nom.svg" alt="Météfit" className="h-8 w-auto" />
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

              {/* Barre de recherche — prend tout l'espace central sur desktop */}
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

              {/* Bouton menu */}
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

          {/* ── Contenu ── */}
          <div className="w-full lg:w-4/5 mx-auto px-4 lg:px-8 py-6">
            <main id="main-content">

              {/* Vue Tenue */}
              {view === 'suggestion' && (
                <>
                  {loading && !!prevCityRef.current && (
                    <div className="bg-white/10 rounded-2xl p-6 animate-pulse h-44" role="status" aria-label="Chargement de la météo…" />
                  )}

                  {weather && (
                    <div
                      className={contentAnim}
                      style={{ willChange: 'transform, opacity' }}
                      {...swipeHandlers}
                      aria-live="polite"
                      aria-busy={!!contentAnim}
                    >
                      {/* Desktop : 2 colonnes — Mobile : colonne unique */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-start">

                        {/* Colonne gauche : météo */}
                        <div className="space-y-4">
                          <WeatherCard
                            weather={weather}
                            selectedDay={selectedDay}
                            totalDays={forecast.length}
                            onPrev={() => goToDay(selectedDay - 1, 'prev')}
                            onNext={() => goToDay(selectedDay + 1, 'next')}
                            cardGradient={theme.card}
                          />
                          <DayTimeline slots={slots} />
                          <DayChangeAlert slots={slots} />
                        </div>

                        {/* Colonne droite : tenue + options */}
                        <div className="space-y-4">
                          <OutfitSuggestion items={suggestion} isDefault={isDefault} slots={slots} />

                          {/* Options : toujours visibles sur desktop, dépliables sur mobile */}
                          <div className="lg:hidden">
                            <button
                              onClick={() => setShowOptions((v) => !v)}
                              aria-expanded={showOptions}
                              aria-controls="outfit-options-panel"
                              className="w-full flex items-center justify-center gap-2 text-sm text-white/50 hover:text-white py-2 min-h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-xl"
                            >
                              <span>{showOptions ? 'Moins d\'options' : 'Plus d\'options'}</span>
                              <span aria-hidden="true" className={`text-xs transition-transform duration-200 ${showOptions ? 'rotate-180' : ''}`}>▾</span>
                            </button>
                          </div>

                          <div id="outfit-options-panel" className={`space-y-3 ${!showOptions ? 'hidden lg:block' : ''}`}>
                            <SaveOutfitButton items={suggestion} onSave={saveOutfit} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

          {/* Vue Garde-robe */}
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
              </div>
            </div>
          )}

          {/* Vue Historique */}
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
