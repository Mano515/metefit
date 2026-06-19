export interface WeatherTheme {
  bg: string
  card: string
}

type Period = 'day' | 'golden' | 'night'

function getPeriod(icon: string, hour: number): Period {
  if (icon.endsWith('n')) return 'night'
  if ((hour >= 5 && hour < 8) || (hour >= 19 && hour < 22)) return 'golden'
  return 'day'
}

function t(bg: string, card: string): WeatherTheme { return { bg, card } }

// Tailwind color reference used below:
// amber:   500=#f59e0b  600=#d97706  700=#b45309
// orange:  400=#fb923c  500=#f97316  600=#ea580c  700=#c2410c
// sky:     300=#7dd3fc  400=#38bdf8  500=#0ea5e9  600=#0284c7  700=#0369a1
// blue:    500=#3b82f6  600=#2563eb  700=#1d4ed8  800=#1e40af
// indigo:  700=#4338ca  800=#3730a3  900=#312e81
// violet:  800=#5b21b6  900=#4c1d95
// slate:   400=#94a3b8  500=#64748b  600=#475569  700=#334155
// rose:    500=#f43f5e  600=#e11d48

// ── 01 : Ciel dégagé ──────────────────────────────────────────────────────────
const CLEAR: Record<Period, WeatherTheme> = {
  day:    t('linear-gradient(160deg, #fde68a 0%, #fbbf24 50%, #fb923c 100%)',
            'linear-gradient(135deg, #92400e 0%, #b45309 100%)'),
  golden: t('linear-gradient(160deg, #f97316 0%, #fbbf24 50%, #fde68a 100%)',
            'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)'),
  night:  t('linear-gradient(160deg, #1e1b4b 0%, #312e81 100%)',
            'linear-gradient(135deg, #3730a3 0%, #1e1b4b 100%)'),
}

// ── 02/03 : Nuages partiels ────────────────────────────────────────────────────
const CLOUDS: Record<Period, WeatherTheme> = {
  day:    t('linear-gradient(160deg, #0284c7 0%, #38bdf8 60%, #7dd3fc 100%)',
            'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)'),
  golden: t('linear-gradient(160deg, #c2410c 0%, #f97316 50%, #fbbf24 100%)',
            'linear-gradient(135deg, #9a3412 0%, #c2410c 100%)'),
  night:  t('linear-gradient(160deg, #1e3a5f 0%, #1e40af 100%)',
            'linear-gradient(135deg, #1d4ed8 0%, #1e3a5f 100%)'),
}

// ── 04 : Couvert ──────────────────────────────────────────────────────────────
const OVERCAST: Record<Period, WeatherTheme> = {
  day:    t('linear-gradient(160deg, #475569 0%, #64748b 100%)',
            'linear-gradient(135deg, #334155 0%, #475569 100%)'),
  golden: t('linear-gradient(160deg, #44403c 0%, #57534e 100%)',
            'linear-gradient(135deg, #292524 0%, #44403c 100%)'),
  night:  t('linear-gradient(160deg, #1e293b 0%, #334155 100%)',
            'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'),
}

// ── 09/10 : Pluie ─────────────────────────────────────────────────────────────
const RAIN: Record<Period, WeatherTheme> = {
  day:    t('linear-gradient(160deg, #1d4ed8 0%, #2563eb 100%)',
            'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)'),
  golden: t('linear-gradient(160deg, #1e3a5f 0%, #1d4ed8 100%)',
            'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)'),
  night:  t('linear-gradient(160deg, #0f172a 0%, #1e3a5f 100%)',
            'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)'),
}

// ── 11 : Orage ────────────────────────────────────────────────────────────────
const THUNDER: Record<Period, WeatherTheme> = {
  day:    t('linear-gradient(160deg, #4c1d95 0%, #5b21b6 100%)',
            'linear-gradient(135deg, #3b0764 0%, #4c1d95 100%)'),
  golden: t('linear-gradient(160deg, #3b0764 0%, #4c1d95 100%)',
            'linear-gradient(135deg, #1e0033 0%, #3b0764 100%)'),
  night:  t('linear-gradient(160deg, #0f0720 0%, #3b0764 100%)',
            'linear-gradient(135deg, #0f0720 0%, #3b0764 100%)'),
}

// ── 13 : Neige ────────────────────────────────────────────────────────────────
const SNOW: Record<Period, WeatherTheme> = {
  day:    t('linear-gradient(160deg, #0369a1 0%, #38bdf8 100%)',
            'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'),
  golden: t('linear-gradient(160deg, #075985 0%, #0ea5e9 100%)',
            'linear-gradient(135deg, #0c4a6e 0%, #075985 100%)'),
  night:  t('linear-gradient(160deg, #0c4a6e 0%, #075985 100%)',
            'linear-gradient(135deg, #082f49 0%, #0c4a6e 100%)'),
}

// ── 50 : Brume ────────────────────────────────────────────────────────────────
const MIST: Record<Period, WeatherTheme> = {
  day:    t('linear-gradient(160deg, #475569 0%, #94a3b8 100%)',
            'linear-gradient(135deg, #334155 0%, #475569 100%)'),
  golden: t('linear-gradient(160deg, #44403c 0%, #78716c 100%)',
            'linear-gradient(135deg, #292524 0%, #44403c 100%)'),
  night:  t('linear-gradient(160deg, #1c1917 0%, #292524 100%)',
            'linear-gradient(135deg, #0c0a09 0%, #1c1917 100%)'),
}

const CODE_MAP: Record<string, Record<Period, WeatherTheme>> = {
  '01': CLEAR,
  '02': CLOUDS,
  '03': CLOUDS,
  '04': OVERCAST,
  '09': RAIN,
  '10': RAIN,
  '11': THUNDER,
  '13': SNOW,
  '50': MIST,
}

// Dégradé par défaut (page d'accueil, pas d'icône)
const DEFAULT: WeatherTheme = t(
  'linear-gradient(160deg, #3a6ea8 0%, #5b8fc4 50%, #7aaed8 100%)',
  'linear-gradient(135deg, #2c5f9a 0%, #3a6ea8 100%)',
)

export function getWeatherTheme(icon?: string, hour?: number): WeatherTheme {
  if (!icon) return DEFAULT

  const h = hour ?? new Date().getHours()
  const code = icon.slice(0, 2)
  const period = getPeriod(icon, h)

  return (CODE_MAP[code] ?? CODE_MAP['04'])[period]
}

/** Compatibilité — retourne juste le fond */
export function getWeatherGradient(icon?: string): string {
  return getWeatherTheme(icon).bg
}
