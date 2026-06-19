/**
 * Retourne un dégradé CSS basé sur l'icône météo OpenWeatherMap.
 * Les icônes se terminent par 'd' (jour) ou 'n' (nuit).
 */
export function getWeatherGradient(icon?: string): string {
  if (!icon) return 'linear-gradient(160deg, #1e3a5f 0%, #2d6a9f 50%, #1a2e4a 100%)'

  const code = icon.slice(0, 2)
  const isNight = icon.endsWith('n')

  if (isNight) {
    // Nuit : toujours sombre, variation selon les nuages
    if (code === '01') return 'linear-gradient(160deg, #0a0e2e 0%, #1a1f4e 50%, #0d1235 100%)' // ciel étoilé
    if (code === '02') return 'linear-gradient(160deg, #111535 0%, #1e2a55 50%, #0f1a3a 100%)'
    if (code === '03' || code === '04') return 'linear-gradient(160deg, #1a1a2e 0%, #2a2a42 50%, #111120 100%)'
    if (code === '09' || code === '10') return 'linear-gradient(160deg, #0d1b2a 0%, #1a2f44 50%, #0a1520 100%)'
    if (code === '11') return 'linear-gradient(160deg, #0a0a1a 0%, #1a1030 50%, #050510 100%)'
    if (code === '13') return 'linear-gradient(160deg, #1a2535 0%, #2a3a50 50%, #151e2e 100%)'
    return 'linear-gradient(160deg, #111828 0%, #1e2d40 50%, #0d1520 100%)'
  }

  // Jour
  switch (code) {
    case '01': // Ciel dégagé — chaud et ensoleillé
      return 'linear-gradient(160deg, #f97316 0%, #fbbf24 40%, #60a5fa 100%)'
    case '02': // Quelques nuages
      return 'linear-gradient(160deg, #f59e0b 0%, #7dd3fc 50%, #3b82f6 100%)'
    case '03': // Nuages épars
      return 'linear-gradient(160deg, #93c5fd 0%, #60a5fa 50%, #3b82f6 100%)'
    case '04': // Nuageux / couvert
      return 'linear-gradient(160deg, #64748b 0%, #94a3b8 50%, #475569 100%)'
    case '09': // Averses
      return 'linear-gradient(160deg, #1e3a5f 0%, #2d6a9f 50%, #1a2e4a 100%)'
    case '10': // Pluie
      return 'linear-gradient(160deg, #1e40af 0%, #3b82f6 50%, #1e3a8a 100%)'
    case '11': // Orage
      return 'linear-gradient(160deg, #1e1b4b 0%, #3730a3 40%, #0f172a 100%)'
    case '13': // Neige
      return 'linear-gradient(160deg, #bfdbfe 0%, #e0f2fe 50%, #7dd3fc 100%)'
    case '50': // Brume / brouillard
      return 'linear-gradient(160deg, #94a3b8 0%, #cbd5e1 50%, #78909c 100%)'
    default:
      return 'linear-gradient(160deg, #1e3a5f 0%, #2d6a9f 50%, #1a2e4a 100%)'
  }
}
