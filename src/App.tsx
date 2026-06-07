import { useState, useEffect } from 'react'
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

  const personalSuggestion = weather ? getSuggestion(weather, slots, offset) : []
  const suggestion = personalSuggestion.length > 0
    ? personalSuggestion
    : weather ? getDefaultSuggestion(weather, slots, offset) : []
  const isDefault = personalSuggestion.length === 0
  const isToday = selectedDay === 0

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

        <main id="main-content" className="space-y-4">

          {/* Vue Tenue */}
          {view === 'suggestion' && (
            <>
              <section aria-label="Météo" aria-live="polite" aria-busy={loading}>
                {loading && (
                  <div className="bg-sky-100 dark:bg-sky-900/30 rounded-2xl p-6 animate-pulse h-44" role="status" aria-label="Chargement de la météo…" />
                )}
                {weather && (
                  <WeatherCard
                    weather={weather}
                    selectedDay={selectedDay}
                    totalDays={forecast.length}
                    onPrev={() => setSelectedDay(Math.max(0, selectedDay - 1))}
                    onNext={() => setSelectedDay(Math.min(forecast.length - 1, selectedDay + 1))}
                  />
                )}
              </section>

              <DayTimeline slots={slots} />
              <DayChangeAlert slots={slots} />

              <CitySearch
                currentCity={weather?.city}
                error={error}
                favs={favs}
                recent={recent}
                onSelect={(coords, city) => { searchCity(coords); addToRecent(city) }}
                onToggleFav={toggleFav}
                isFav={isFav}
              />

              <div className="space-y-3">
                {!weather && !loading && (
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center">Entre ta ville pour obtenir une suggestion.</p>
                )}
                {weather && <OutfitSuggestion items={suggestion} isDefault={isDefault} />}
                {weather && <SaveOutfitButton items={suggestion} onSave={saveOutfit} />}
                {weather && isToday && (
                  <OutfitValidator onFeedback={handleFeedback} todayEntry={todayEntry} />
                )}
              </div>
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
