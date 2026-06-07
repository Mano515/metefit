import { useState, useEffect, useRef } from 'react'
import { useWeather } from './hooks/useWeather'
import { useWardrobe } from './hooks/useWardrobe'
import { useThermal } from './hooks/useThermal'
import { useHistory } from './hooks/useHistory'
import { useSavedOutfits } from './hooks/useSavedOutfits'
import { useNotifications } from './hooks/useNotifications'
import { useDarkMode } from './hooks/useDarkMode'
import { WeatherCard } from './components/WeatherCard'
import { DayTimeline } from './components/DayTimeline'
import { DayChangeAlert } from './components/DayChangeAlert'
import { AddClothingForm } from './components/AddClothingForm'
import { ClothingList } from './components/ClothingList'
import { OutfitSuggestion } from './components/OutfitSuggestion'
import { OutfitValidator } from './components/OutfitValidator'
import { SaveOutfitButton } from './components/SaveOutfitButton'
import { SavedOutfitLibrary } from './components/SavedOutfitLibrary'
import { HistoryList } from './components/HistoryList'
import { CitySearch } from './components/CitySearch'
import { SettingsPanel } from './components/SettingsPanel'
import { useCityMemory } from './hooks/useCityMemory'
import { getDefaultSuggestion } from './utils/defaultSuggestions'
import type { OutfitFeedback } from './types'
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
  const { profile, setProfile, offset, lastAutoAdjust, clearAutoAdjustNotice, recalibrate } = useThermal()
  const { entries, addEntry, todayEntry } = useHistory()
  const { outfits, saveOutfit, removeOutfit } = useSavedOutfits()
  const { permission, requestPermission, sendMorningNotif } = useNotifications()
  const { favs, recent, addToRecent, toggleFav, isFav } = useCityMemory()
  const { dark, toggle: toggleDark } = useDarkMode()
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
  const isToday = selectedDay === 0

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

  function handleFeedback(feedback: OutfitFeedback) {
    if (!weather) return
    const updated = addEntry(weather, suggestion, feedback)
    recalibrate(updated)
  }

  const isSuggestionView = view === 'suggestion'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
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
        dark={dark}
        onToggleDark={toggleDark}
        onNavigate={(v) => setView(v)}
      />

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">

        {/* Header */}
        <header className="flex items-center justify-between">
          {isSuggestionView ? (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Météfit
            </h1>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('suggestion')}
                aria-label="Retour à la tenue"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-500 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <span aria-hidden="true">←</span>
              </button>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {VIEW_LABELS[view]}
              </h1>
            </div>
          )}

          <button
            onClick={() => setSettingsOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={settingsOpen}
            aria-controls="settings-panel"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-500 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <span aria-hidden="true">☰</span>
          </button>
        </header>

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

        <main id="main-content" className="space-y-4">

          {/* Vue Tenue */}
          {view === 'suggestion' && (
            <>
              {loading && !!prevCityRef.current && (
                <div className="bg-sky-100 dark:bg-sky-900/30 rounded-2xl p-6 animate-pulse h-44" role="status" aria-label="Chargement de la météo…" />
              )}

              {/* Bloc animé au changement de jour */}
              {weather && (
                <div
                  className={contentAnim}
                  style={{ willChange: 'transform, opacity' }}
                  aria-live="polite"
                  aria-busy={!!contentAnim}
                >
                  <div className="space-y-4">
                    <WeatherCard
                      weather={weather}
                      selectedDay={selectedDay}
                      totalDays={forecast.length}
                      onPrev={() => goToDay(selectedDay - 1, 'prev')}
                      onNext={() => goToDay(selectedDay + 1, 'next')}
                    />
                    <DayTimeline slots={slots} />
                    <DayChangeAlert slots={slots} />
                    <OutfitSuggestion items={suggestion} isDefault={isDefault} slots={slots} />

                    {/* Bouton "Plus d'options" */}
                    <button
                      onClick={() => setShowOptions((v) => !v)}
                      aria-expanded={showOptions}
                      className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
                    >
                      <span>{showOptions ? 'Moins d\'options' : 'Plus d\'options'}</span>
                      <span aria-hidden="true" className={`text-xs transition-transform duration-200 ${showOptions ? 'rotate-180' : ''}`}>▾</span>
                    </button>

                    {/* Options dépliables */}
                    {showOptions && (
                      <div className="space-y-3">
                        <SaveOutfitButton items={suggestion} onSave={saveOutfit} />
                        {isToday && (
                          <OutfitValidator onFeedback={handleFeedback} todayEntry={todayEntry} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!weather && !loading && (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center">Entre ta ville pour obtenir une suggestion.</p>
              )}
            </>
          )}

          {/* Vue Garde-robe */}
          {view === 'wardrobe' && (
            <div className="space-y-4">
              <AddClothingForm onAdd={addItem} />
              <ClothingList items={items} onRemove={removeItem} />
              {outfits.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                    Tenues sauvegardées
                  </p>
                  <SavedOutfitLibrary outfits={outfits} onRemove={removeOutfit} />
                </div>
              )}
            </div>
          )}

          {/* Vue Historique */}
          {view === 'historique' && (
            <HistoryList entries={entries} />
          )}

        </main>
      </div>
    </div>
  )
}
