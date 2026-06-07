import { useState } from 'react'
import { useWeather } from './hooks/useWeather'
import { useWardrobe } from './hooks/useWardrobe'
import { useThermal } from './hooks/useThermal'
import { useHistory } from './hooks/useHistory'
import { WeatherCard } from './components/WeatherCard'
import { DaySelector } from './components/DaySelector'
import { DayTimeline } from './components/DayTimeline'
import { ThermalSelector } from './components/ThermalSelector'
import { AddClothingForm } from './components/AddClothingForm'
import { ClothingList } from './components/ClothingList'
import { OutfitSuggestion } from './components/OutfitSuggestion'
import { OutfitValidator } from './components/OutfitValidator'
import { HistoryList } from './components/HistoryList'
import { getDefaultSuggestion } from './utils/defaultSuggestions'
import type { OutfitFeedback } from './types'
import './index.css'

type Tab = 'suggestion' | 'wardrobe' | 'historique'

export default function App() {
  const { weather, forecast, slots, selectedDay, setSelectedDay, loading, error, manualCity, setManualCity, searchCity } = useWeather()
  const { items, addItem, removeItem, getSuggestion } = useWardrobe()
  const { profile, setProfile, offset } = useThermal()
  const { entries, addEntry, todayEntry } = useHistory()
  const [tab, setTab] = useState<Tab>('suggestion')

  const personalSuggestion = weather ? getSuggestion(weather, slots, offset) : []
  const suggestion = personalSuggestion.length > 0
    ? personalSuggestion
    : weather ? getDefaultSuggestion(weather, slots, offset) : []
  const isDefault = personalSuggestion.length === 0
  const isToday = selectedDay === 0

  function handleFeedback(feedback: OutfitFeedback) {
    if (!weather) return
    addEntry(weather, suggestion, feedback)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Météfit</h1>

        {/* Météo */}
        {loading && <div className="bg-sky-100 rounded-2xl p-6 animate-pulse h-36" />}
        {error && (
          <div className="space-y-2">
            <p className="text-sm text-red-500">{error}</p>
            <form onSubmit={(e) => { e.preventDefault(); searchCity(manualCity) }} className="flex gap-2">
              <input
                type="text" placeholder="Entrer une ville..."
                value={manualCity} onChange={(e) => setManualCity(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">OK</button>
            </form>
          </div>
        )}
        {weather && <WeatherCard weather={weather} />}

        {/* Sélecteur de jours */}
        {forecast.length > 0 && (
          <DaySelector forecast={forecast} selectedDay={selectedDay} onChange={setSelectedDay} />
        )}

        {/* Timeline + champ ville dans l'onglet suggestion */}
        {tab === 'suggestion' && <DayTimeline slots={slots} />}

        {/* Changer de ville */}
        {!error && (
          <form onSubmit={(e) => { e.preventDefault(); if (manualCity.trim()) searchCity(manualCity) }} className="flex gap-2">
            <input
              type="text"
              placeholder={weather ? `${weather.city} — changer de ville...` : 'Entrer une ville...'}
              value={manualCity} onChange={(e) => setManualCity(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
            <button type="submit" className="bg-gray-200 text-gray-700 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">OK</button>
          </form>
        )}

        {/* Onglets */}
        <div className="flex bg-gray-200 rounded-xl p-1">
          {(['suggestion', 'wardrobe', 'historique'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              {t === 'suggestion' ? '✨ Tenue' : t === 'wardrobe' ? '👕 Garde-robe' : '📅 Historique'}
            </button>
          ))}
        </div>

        {/* Contenu */}
        {tab === 'suggestion' && (
          <div className="space-y-3">
            <ThermalSelector profile={profile} onChange={setProfile} />
            {!weather && !loading && (
              <p className="text-sm text-gray-400 text-center">Entre ta ville pour obtenir une suggestion.</p>
            )}
            {weather && <OutfitSuggestion items={suggestion} isDefault={isDefault} />}
            {weather && isToday && (
              <OutfitValidator onFeedback={handleFeedback} todayEntry={todayEntry} />
            )}
          </div>
        )}

        {tab === 'wardrobe' && (
          <div className="space-y-3">
            <AddClothingForm onAdd={addItem} />
            <ClothingList items={items} onRemove={removeItem} />
          </div>
        )}

        {tab === 'historique' && (
          <HistoryList entries={entries} />
        )}
      </div>
    </div>
  )
}
