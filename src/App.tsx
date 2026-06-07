import { useState, useEffect } from 'react'
import { useWeather } from './hooks/useWeather'
import { useWardrobe } from './hooks/useWardrobe'
import { useThermal } from './hooks/useThermal'
import { useHistory } from './hooks/useHistory'
import { useSavedOutfits } from './hooks/useSavedOutfits'
import { useNotifications } from './hooks/useNotifications'
import { WeatherCard } from './components/WeatherCard'
import { DaySelector } from './components/DaySelector'
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

type Tab = 'suggestion' | 'wardrobe' | 'historique'

export default function App() {
  const { weather, forecast, slots, selectedDay, setSelectedDay, loading, error, searchCity } = useWeather()
  const { items, addItem, removeItem, getSuggestion } = useWardrobe()
  const { profile, setProfile, offset, lastAutoAdjust, clearAutoAdjustNotice, recalibrate } = useThermal()
  const { entries, addEntry, todayEntry } = useHistory()
  const { outfits, saveOutfit, removeOutfit } = useSavedOutfits()
  const { permission, requestPermission, sendMorningNotif } = useNotifications()
  const { favs, recent, addToRecent, toggleFav, isFav } = useCityMemory()
  const [tab, setTab] = useState<Tab>('suggestion')
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

  return (
    <div className="min-h-screen bg-gray-50">
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        profile={profile}
        onProfileChange={setProfile}
        autoAdjust={lastAutoAdjust}
        onDismissAutoAdjust={clearAutoAdjustNotice}
        notifPermission={permission}
        onRequestNotif={requestPermission}
      />

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Météfit</h1>
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-500 transition-colors shadow-sm"
            aria-label="Paramètres"
          >
            ⚙️
          </button>
        </div>

        {/* Météo */}
        {loading && <div className="bg-sky-100 rounded-2xl p-6 animate-pulse h-36" />}
        {weather && <WeatherCard weather={weather} />}

        {forecast.length > 0 && (
          <DaySelector forecast={forecast} selectedDay={selectedDay} onChange={setSelectedDay} />
        )}

        {tab === 'suggestion' && (
          <>
            <DayTimeline slots={slots} />
            <DayChangeAlert slots={slots} />
          </>
        )}

        <CitySearch
          currentCity={weather?.city}
          error={error}
          favs={favs}
          recent={recent}
          onSelect={(coords, city) => { searchCity(coords); addToRecent(city) }}
          onToggleFav={toggleFav}
          isFav={isFav}
        />

        {/* Onglets */}
        <div className="flex bg-gray-200 rounded-xl p-1">
          {(['suggestion', 'wardrobe', 'historique'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              {t === 'suggestion' ? '✨ Tenue' : t === 'wardrobe' ? '👕 Garde-robe' : '📅 Historique'}
            </button>
          ))}
        </div>

        {tab === 'suggestion' && (
          <div className="space-y-3">
            {!weather && !loading && (
              <p className="text-sm text-gray-400 text-center">Entre ta ville pour obtenir une suggestion.</p>
            )}
            {weather && <OutfitSuggestion items={suggestion} isDefault={isDefault} />}
            {weather && <SaveOutfitButton items={suggestion} onSave={saveOutfit} />}
            {weather && isToday && (
              <OutfitValidator onFeedback={handleFeedback} todayEntry={todayEntry} />
            )}
          </div>
        )}

        {tab === 'wardrobe' && (
          <div className="space-y-4">
            <AddClothingForm onAdd={addItem} />
            <ClothingList items={items} onRemove={removeItem} />
            {outfits.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Tenues sauvegardées</p>
                <SavedOutfitLibrary outfits={outfits} onRemove={removeOutfit} />
              </div>
            )}
          </div>
        )}

        {tab === 'historique' && (
          <HistoryList entries={entries} />
        )}
      </div>
    </div>
  )
}
