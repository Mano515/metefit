export interface WeatherTheme {
  bg: string       // dégradé de fond (CSS)
  card: string     // dégradé de la carte météo (CSS)
}

/**
 * Thème complet basé sur l'icône OpenWeatherMap.
 * Fond et carte partagent la même famille de couleurs.
 */
export function getWeatherTheme(icon?: string): WeatherTheme {
  if (!icon) return {
    bg:   'linear-gradient(160deg, #0c1a3a 0%, #1a2e58 100%)',
    card: 'linear-gradient(135deg, #1e3a6e 0%, #0c1a3a 100%)',
  }

  const code = icon.slice(0, 2)
  const isNight = icon.endsWith('n')

  if (isNight) {
    return {
      bg:   'linear-gradient(160deg, #05091a 0%, #0d1535 100%)',
      card: 'linear-gradient(135deg, #111e48 0%, #05091a 100%)',
    }
  }

  switch (code) {
    case '01': // Grand soleil — ambre / doré
      return {
        bg:   'linear-gradient(160deg, #78350f 0%, #b45309 50%, #92400e 100%)',
        card: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)',
      }

    case '02': // Quelques nuages — bleu-ciel chaleureux
      return {
        bg:   'linear-gradient(160deg, #0c3460 0%, #1a5276 50%, #0a2540 100%)',
        card: 'linear-gradient(135deg, #2980b9 0%, #0c3460 100%)',
      }

    case '03': // Nuages épars — bleu acier
      return {
        bg:   'linear-gradient(160deg, #1a2e50 0%, #2c4a6e 50%, #152240 100%)',
        card: 'linear-gradient(135deg, #3a6186 0%, #1a2e50 100%)',
      }

    case '04': // Couvert — gris-ardoise
      return {
        bg:   'linear-gradient(160deg, #1c2333 0%, #2d3748 50%, #151c27 100%)',
        card: 'linear-gradient(135deg, #4a5568 0%, #1c2333 100%)',
      }

    case '09': // Averses — bleu pluvieux profond
      return {
        bg:   'linear-gradient(160deg, #0d1b2e 0%, #1a3050 50%, #090f1e 100%)',
        card: 'linear-gradient(135deg, #2c4a6e 0%, #0d1b2e 100%)',
      }

    case '10': // Pluie — bleu marine
      return {
        bg:   'linear-gradient(160deg, #0a1628 0%, #162540 50%, #070e1c 100%)',
        card: 'linear-gradient(135deg, #1e3a5f 0%, #0a1628 100%)',
      }

    case '11': // Orage — indigo sombre
      return {
        bg:   'linear-gradient(160deg, #0f0c24 0%, #1e1545 50%, #090614 100%)',
        card: 'linear-gradient(135deg, #2d2060 0%, #0f0c24 100%)',
      }

    case '13': // Neige — bleu glacé
      return {
        bg:   'linear-gradient(160deg, #1a3050 0%, #2a4a70 50%, #122035 100%)',
        card: 'linear-gradient(135deg, #4a7fa5 0%, #1a3050 100%)',
      }

    case '50': // Brume — gris-bleu neutre
      return {
        bg:   'linear-gradient(160deg, #1a2030 0%, #2a3545 50%, #101520 100%)',
        card: 'linear-gradient(135deg, #3d5166 0%, #1a2030 100%)',
      }

    default:
      return {
        bg:   'linear-gradient(160deg, #0c1a3a 0%, #1a2e58 100%)',
        card: 'linear-gradient(135deg, #1e3a6e 0%, #0c1a3a 100%)',
      }
  }
}

/** Compatibilité — retourne juste le fond */
export function getWeatherGradient(icon?: string): string {
  return getWeatherTheme(icon).bg
}
