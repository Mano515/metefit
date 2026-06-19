export interface WeatherTheme {
  bg: string
  card: string
}

type Period = 'night' | 'dawn' | 'morning' | 'afternoon' | 'evening' | 'dusk'

function getPeriod(hour: number): Period {
  if (hour < 5)  return 'night'
  if (hour < 7)  return 'dawn'
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  if (hour < 20) return 'evening'
  return 'dusk'
}

function t(bg: string, card: string): WeatherTheme { return { bg, card } }

// ── 01 : Ciel dégagé ──────────────────────────────────────────────────────────
const CLEAR: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #1a1f3c 0%, #252d50 100%)', 'linear-gradient(135deg, #2e3a62 0%, #1a1f3c 100%)'),
  dawn:      t('linear-gradient(160deg, #3d1c10 0%, #a04a1a 50%, #d4803a 100%)', 'linear-gradient(135deg, #c07030 0%, #3d1c10 100%)'),
  morning:   t('linear-gradient(160deg, #8a3a10 0%, #d46020 50%, #e89040 100%)', 'linear-gradient(135deg, #e08030 0%, #8a3a10 100%)'),
  afternoon: t('linear-gradient(160deg, #8a3a0a 0%, #d46010 50%, #e8a030 100%)', 'linear-gradient(135deg, #e09830 0%, #8a3a0a 100%)'),
  evening:   t('linear-gradient(160deg, #6a2010 0%, #bc4820 50%, #d87838 100%)', 'linear-gradient(135deg, #d07838 0%, #6a2010 100%)'),
  dusk:      t('linear-gradient(160deg, #1e1040 0%, #30185a 50%, #3c2070 100%)', 'linear-gradient(135deg, #3c2268 0%, #1e1040 100%)'),
}

// ── 02 : Quelques nuages ──────────────────────────────────────────────────────
const FEW_CLOUDS: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #181e38 0%, #242e50 100%)', 'linear-gradient(135deg, #2a3860 0%, #181e38 100%)'),
  dawn:      t('linear-gradient(160deg, #3a2015 0%, #7a4828 50%, #a86840 100%)', 'linear-gradient(135deg, #9a6038 0%, #3a2015 100%)'),
  morning:   t('linear-gradient(160deg, #1a3a5a 0%, #2a5880 50%, #3a70a0 100%)', 'linear-gradient(135deg, #3878b0 0%, #1a3a5a 100%)'),
  afternoon: t('linear-gradient(160deg, #183858 0%, #2a5078 50%, #3868a0 100%)', 'linear-gradient(135deg, #3070b0 0%, #183858 100%)'),
  evening:   t('linear-gradient(160deg, #3a2010 0%, #805030 50%, #a06848 100%)', 'linear-gradient(135deg, #906040 0%, #3a2010 100%)'),
  dusk:      t('linear-gradient(160deg, #181828 0%, #222238 50%, #2c2c4a 100%)', 'linear-gradient(135deg, #2a2a48 0%, #181828 100%)'),
}

// ── 03 : Nuages épars ─────────────────────────────────────────────────────────
const SCATTERED: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #1c1e28 0%, #262c3a 100%)', 'linear-gradient(135deg, #2c3248 0%, #1c1e28 100%)'),
  dawn:      t('linear-gradient(160deg, #302015 0%, #604030 50%, #806050 100%)', 'linear-gradient(135deg, #706050 0%, #302015 100%)'),
  morning:   t('linear-gradient(160deg, #223050 0%, #344868 50%, #446080 100%)', 'linear-gradient(135deg, #406880 0%, #223050 100%)'),
  afternoon: t('linear-gradient(160deg, #203050 0%, #345068 50%, #446080 100%)', 'linear-gradient(135deg, #3e6880 0%, #203050 100%)'),
  evening:   t('linear-gradient(160deg, #302015 0%, #605040 50%, #806860 100%)', 'linear-gradient(135deg, #706050 0%, #302015 100%)'),
  dusk:      t('linear-gradient(160deg, #1a1c28 0%, #222430 50%, #2c2e3c 100%)', 'linear-gradient(135deg, #2a2c3e 0%, #1a1c28 100%)'),
}

// ── 04 : Couvert ──────────────────────────────────────────────────────────────
const OVERCAST: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #1c1e24 0%, #262830 100%)', 'linear-gradient(135deg, #2a2c38 0%, #1c1e24 100%)'),
  dawn:      t('linear-gradient(160deg, #2a2420 0%, #3e3830 50%, #524a42 100%)', 'linear-gradient(135deg, #484038 0%, #2a2420 100%)'),
  morning:   t('linear-gradient(160deg, #2c3040 0%, #3c4255 50%, #4c5268 100%)', 'linear-gradient(135deg, #485068 0%, #2c3040 100%)'),
  afternoon: t('linear-gradient(160deg, #2c3040 0%, #3c4452 50%, #4c5464 100%)', 'linear-gradient(135deg, #505868 0%, #2c3040 100%)'),
  evening:   t('linear-gradient(160deg, #28262e 0%, #36303e 50%, #443c4e 100%)', 'linear-gradient(135deg, #403848 0%, #28262e 100%)'),
  dusk:      t('linear-gradient(160deg, #1e1e28 0%, #26242e 50%, #2e2c38 100%)', 'linear-gradient(135deg, #2c2a38 0%, #1e1e28 100%)'),
}

// ── 09/10 : Pluie ─────────────────────────────────────────────────────────────
const RAIN: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #141c28 0%, #1c2838 100%)', 'linear-gradient(135deg, #20304a 0%, #141c28 100%)'),
  dawn:      t('linear-gradient(160deg, #1a2030 0%, #263040 50%, #32404e 100%)', 'linear-gradient(135deg, #2e3e4e 0%, #1a2030 100%)'),
  morning:   t('linear-gradient(160deg, #1c2a3e 0%, #2c3c52 50%, #3a4e68 100%)', 'linear-gradient(135deg, #344e68 0%, #1c2a3e 100%)'),
  afternoon: t('linear-gradient(160deg, #1a2a3c 0%, #2a3a50 50%, #384c64 100%)', 'linear-gradient(135deg, #304a66 0%, #1a2a3c 100%)'),
  evening:   t('linear-gradient(160deg, #1c2030 0%, #28303e 50%, #34404e 100%)', 'linear-gradient(135deg, #30404e 0%, #1c2030 100%)'),
  dusk:      t('linear-gradient(160deg, #141820 0%, #1c2030 50%, #242838 100%)', 'linear-gradient(135deg, #202838 0%, #141820 100%)'),
}

// ── 11 : Orage ────────────────────────────────────────────────────────────────
const THUNDER: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #16102a 0%, #201838 100%)', 'linear-gradient(135deg, #281e42 0%, #16102a 100%)'),
  dawn:      t('linear-gradient(160deg, #201528 0%, #301e3c 50%, #402855 100%)', 'linear-gradient(135deg, #3c265a 0%, #201528 100%)'),
  morning:   t('linear-gradient(160deg, #1e1838 0%, #2c2450 50%, #3a3068 100%)', 'linear-gradient(135deg, #362e68 0%, #1e1838 100%)'),
  afternoon: t('linear-gradient(160deg, #201838 0%, #2e2450 50%, #3c3068 100%)', 'linear-gradient(135deg, #382e6a 0%, #201838 100%)'),
  evening:   t('linear-gradient(160deg, #1c1430 0%, #281c44 50%, #342454 100%)', 'linear-gradient(135deg, #301e52 0%, #1c1430 100%)'),
  dusk:      t('linear-gradient(160deg, #141028 0%, #1e163a 50%, #28204a 100%)', 'linear-gradient(135deg, #241e48 0%, #141028 100%)'),
}

// ── 13 : Neige ────────────────────────────────────────────────────────────────
const SNOW: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #1a2030 0%, #242c40 100%)', 'linear-gradient(135deg, #2a3450 0%, #1a2030 100%)'),
  dawn:      t('linear-gradient(160deg, #283448 0%, #3a4c64 50%, #4c6078 100%)', 'linear-gradient(135deg, #4a6078 0%, #283448 100%)'),
  morning:   t('linear-gradient(160deg, #243a58 0%, #345470 50%, #44708a 100%)', 'linear-gradient(135deg, #568898 0%, #243a58 100%)'),
  afternoon: t('linear-gradient(160deg, #243a58 0%, #345470 50%, #44708a 100%)', 'linear-gradient(135deg, #549096 0%, #243a58 100%)'),
  evening:   t('linear-gradient(160deg, #223248 0%, #324858 50%, #42606e 100%)', 'linear-gradient(135deg, #40687a 0%, #223248 100%)'),
  dusk:      t('linear-gradient(160deg, #1a2030 0%, #222838 50%, #2c3248 100%)', 'linear-gradient(135deg, #28344a 0%, #1a2030 100%)'),
}

// ── 50 : Brume ────────────────────────────────────────────────────────────────
const MIST: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #1c1e28 0%, #24262e 100%)', 'linear-gradient(135deg, #282a36 0%, #1c1e28 100%)'),
  dawn:      t('linear-gradient(160deg, #302c28 0%, #484040 50%, #5e5450 100%)', 'linear-gradient(135deg, #5a5050 0%, #302c28 100%)'),
  morning:   t('linear-gradient(160deg, #2e3440 0%, #3e4858 50%, #4e5c6c 100%)', 'linear-gradient(135deg, #4e607a 0%, #2e3440 100%)'),
  afternoon: t('linear-gradient(160deg, #2a3040 0%, #3a4455 50%, #4a5868 100%)', 'linear-gradient(135deg, #4c5e78 0%, #2a3040 100%)'),
  evening:   t('linear-gradient(160deg, #2c2830 0%, #3a333e 50%, #48404e 100%)', 'linear-gradient(135deg, #443c4e 0%, #2c2830 100%)'),
  dusk:      t('linear-gradient(160deg, #1e1e28 0%, #262430 50%, #2e2c38 100%)', 'linear-gradient(135deg, #2c2a36 0%, #1e1e28 100%)'),
}

// ── Défaut (pas d'icône) ──────────────────────────────────────────────────────
const DEFAULT_SKY: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #18203a 0%, #222e50 100%)', 'linear-gradient(135deg, #283860 0%, #18203a 100%)'),
  dawn:      t('linear-gradient(160deg, #2e1208 0%, #804020 50%, #c07030 100%)', 'linear-gradient(135deg, #a86028 0%, #2e1208 100%)'),
  morning:   t('linear-gradient(160deg, #1a3050 0%, #2a5070 50%, #3a6888 100%)', 'linear-gradient(135deg, #387090 0%, #1a3050 100%)'),
  afternoon: t('linear-gradient(160deg, #183050 0%, #283e68 50%, #364e80 100%)', 'linear-gradient(135deg, #2e5080 0%, #183050 100%)'),
  evening:   t('linear-gradient(160deg, #4a1a0a 0%, #903210 50%, #be5828 100%)', 'linear-gradient(135deg, #a85028 0%, #4a1a0a 100%)'),
  dusk:      t('linear-gradient(160deg, #161828 0%, #201e34 50%, #2a2444 100%)', 'linear-gradient(135deg, #26223e 0%, #161828 100%)'),
}

const CODE_MAP: Record<string, Record<Period, WeatherTheme>> = {
  '01': CLEAR,
  '02': FEW_CLOUDS,
  '03': SCATTERED,
  '04': OVERCAST,
  '09': RAIN,
  '10': RAIN,
  '11': THUNDER,
  '13': SNOW,
  '50': MIST,
}

export function getWeatherTheme(icon?: string, hour?: number): WeatherTheme {
  const h = hour ?? new Date().getHours()

  if (!icon) return DEFAULT_SKY[getPeriod(h)]

  const code = icon.slice(0, 2)
  const isNight = icon.endsWith('n')
  const period = isNight ? 'night' : getPeriod(h)

  return (CODE_MAP[code] ?? DEFAULT_SKY)[period]
}

/** Compatibilité — retourne juste le fond */
export function getWeatherGradient(icon?: string): string {
  return getWeatherTheme(icon).bg
}
