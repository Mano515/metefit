/**
 * Dégradés harmonisés avec la carte météo (sky-400 #38bdf8 → blue-600 #2563eb).
 * Chaque fond prolonge les teintes de la carte vers des tons plus profonds/saturés.
 */
export function getWeatherGradient(icon?: string): string {
  if (!icon) {
    // Pas encore de météo — bleu nuit profond
    return 'linear-gradient(160deg, #0c1a3a 0%, #1e3a6e 60%, #0a1628 100%)'
  }

  const code = icon.slice(0, 2)
  const isNight = icon.endsWith('n')

  if (isNight) {
    if (code === '01') return 'linear-gradient(160deg, #05091f 0%, #0e1740 60%, #020610 100%)' // nuit étoilée
    if (code === '02') return 'linear-gradient(160deg, #080f28 0%, #111e48 60%, #060c1e 100%)'
    if (code === '03' || code === '04') return 'linear-gradient(160deg, #0d1020 0%, #1a1e30 60%, #080b18 100%)'
    if (code === '09' || code === '10') return 'linear-gradient(160deg, #060e1c 0%, #0f1e36 60%, #040a14 100%)'
    if (code === '11') return 'linear-gradient(160deg, #070514 0%, #140f2a 60%, #040310 100%)'
    if (code === '13') return 'linear-gradient(160deg, #0c1830 0%, #1a2e50 60%, #091428 100%)'
    return 'linear-gradient(160deg, #080f28 0%, #111e48 60%, #060c1e 100%)'
  }

  switch (code) {
    case '01': // Ciel dégagé — chaud, soleil haut, bleu vif en bas pour rejoindre la carte
      return 'linear-gradient(160deg, #f97316 0%, #fb923c 20%, #38bdf8 65%, #1d4ed8 100%)'

    case '02': // Quelques nuages — légèrement voilé, bleu lumineux
      return 'linear-gradient(160deg, #7dd3fc 0%, #38bdf8 40%, #2563eb 80%, #1e40af 100%)'

    case '03': // Nuages épars — bleu plus doux
      return 'linear-gradient(160deg, #93c5fd 0%, #60a5fa 40%, #2563eb 80%, #1e3a8a 100%)'

    case '04': // Couvert — gris-bleu, cohérent mais désaturé
      return 'linear-gradient(160deg, #64748b 0%, #475569 40%, #334155 80%, #1e293b 100%)'

    case '09': // Averses — bleu sombre profond
      return 'linear-gradient(160deg, #1e40af 0%, #1e3a8a 50%, #172554 100%)'

    case '10': // Pluie — bleu nuit, cohérent avec la carte bleue
      return 'linear-gradient(160deg, #1d4ed8 0%, #1e3a8a 50%, #0f172a 100%)'

    case '11': // Orage — violet-bleu très sombre
      return 'linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #0f0a2e 100%)'

    case '13': // Neige — bleu très pâle, presque blanc
      return 'linear-gradient(160deg, #bfdbfe 0%, #dbeafe 50%, #93c5fd 100%)'

    case '50': // Brume — gris-bleu neutre
      return 'linear-gradient(160deg, #94a3b8 0%, #64748b 50%, #475569 100%)'

    default:
      return 'linear-gradient(160deg, #0c1a3a 0%, #1e3a6e 60%, #0a1628 100%)'
  }
}
