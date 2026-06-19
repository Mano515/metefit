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
  night:     t('linear-gradient(160deg, #020510 0%, #06102a 100%)', 'linear-gradient(135deg, #0a1835 0%, #020510 100%)'),
  dawn:      t('linear-gradient(160deg, #1c0806 0%, #8a3010 50%, #d46828 100%)', 'linear-gradient(135deg, #c46025 0%, #1c0806 100%)'),
  morning:   t('linear-gradient(160deg, #6a2004 0%, #c84808 50%, #e07818 100%)', 'linear-gradient(135deg, #d87020 0%, #6a2004 100%)'),
  afternoon: t('linear-gradient(160deg, #7a2206 0%, #d05010 50%, #e88c1a 100%)', 'linear-gradient(135deg, #e09030 0%, #7a2206 100%)'),
  evening:   t('linear-gradient(160deg, #5a1008 0%, #a83010 50%, #c86820 100%)', 'linear-gradient(135deg, #d07030 0%, #5a1008 100%)'),
  dusk:      t('linear-gradient(160deg, #08051c 0%, #180a35 50%, #2a1255 100%)', 'linear-gradient(135deg, #301858 0%, #08051c 100%)'),
}

// ── 02 : Quelques nuages ──────────────────────────────────────────────────────
const FEW_CLOUDS: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #040818 0%, #0c1838 100%)', 'linear-gradient(135deg, #101e48 0%, #040818 100%)'),
  dawn:      t('linear-gradient(160deg, #281008 0%, #6a3818 50%, #9a5830 100%)', 'linear-gradient(135deg, #8a5028 0%, #281008 100%)'),
  morning:   t('linear-gradient(160deg, #0c2a50 0%, #1a4878 50%, #2a6090 100%)', 'linear-gradient(135deg, #2868a8 0%, #0c2a50 100%)'),
  afternoon: t('linear-gradient(160deg, #0a2848 0%, #1a4070 50%, #2858a0 100%)', 'linear-gradient(135deg, #2668b0 0%, #0a2848 100%)'),
  evening:   t('linear-gradient(160deg, #301808 0%, #784028 50%, #9a5830 100%)', 'linear-gradient(135deg, #8a5030 0%, #301808 100%)'),
  dusk:      t('linear-gradient(160deg, #060818 0%, #10162a 50%, #1a2040 100%)', 'linear-gradient(135deg, #202848 0%, #060818 100%)'),
}

// ── 03 : Nuages épars ─────────────────────────────────────────────────────────
const SCATTERED: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #060810 0%, #101828 100%)', 'linear-gradient(135deg, #182038 0%, #060810 100%)'),
  dawn:      t('linear-gradient(160deg, #201208 0%, #503828 50%, #785040 100%)', 'linear-gradient(135deg, #685040 0%, #201208 100%)'),
  morning:   t('linear-gradient(160deg, #182840 0%, #2a4060 50%, #3a5878 100%)', 'linear-gradient(135deg, #365878 0%, #182840 100%)'),
  afternoon: t('linear-gradient(160deg, #182840 0%, #284868 50%, #3a5880 100%)', 'linear-gradient(135deg, #346080 0%, #182840 100%)'),
  evening:   t('linear-gradient(160deg, #281808 0%, #583828 50%, #785040 100%)', 'linear-gradient(135deg, #684838 0%, #281808 100%)'),
  dusk:      t('linear-gradient(160deg, #080818 0%, #101530 50%, #181e3a 100%)', 'linear-gradient(135deg, #1c2240 0%, #080818 100%)'),
}

// ── 04 : Couvert ──────────────────────────────────────────────────────────────
const OVERCAST: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #080a10 0%, #121820 100%)', 'linear-gradient(135deg, #182028 0%, #080a10 100%)'),
  dawn:      t('linear-gradient(160deg, #181410 0%, #303028 50%, #484038 100%)', 'linear-gradient(135deg, #403830 0%, #181410 100%)'),
  morning:   t('linear-gradient(160deg, #1c2030 0%, #2c3248 50%, #3a4260 100%)', 'linear-gradient(135deg, #3c4860 0%, #1c2030 100%)'),
  afternoon: t('linear-gradient(160deg, #1c2333 0%, #2d3748 50%, #3a4860 100%)', 'linear-gradient(135deg, #4a5568 0%, #1c2333 100%)'),
  evening:   t('linear-gradient(160deg, #1a1820 0%, #282830 50%, #383040 100%)', 'linear-gradient(135deg, #3a3248 0%, #1a1820 100%)'),
  dusk:      t('linear-gradient(160deg, #0c0c18 0%, #181820 50%, #201e28 100%)', 'linear-gradient(135deg, #242030 0%, #0c0c18 100%)'),
}

// ── 09/10 : Pluie ─────────────────────────────────────────────────────────────
const RAIN: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #040810 0%, #08101c 100%)', 'linear-gradient(135deg, #0c1828 0%, #040810 100%)'),
  dawn:      t('linear-gradient(160deg, #0a1018 0%, #142030 50%, #1e3040 100%)', 'linear-gradient(135deg, #1c3040 0%, #0a1018 100%)'),
  morning:   t('linear-gradient(160deg, #0c1828 0%, #182840 50%, #243858 100%)', 'linear-gradient(135deg, #203858 0%, #0c1828 100%)'),
  afternoon: t('linear-gradient(160deg, #0a1628 0%, #162540 50%, #203050 100%)', 'linear-gradient(135deg, #1e3a5f 0%, #0a1628 100%)'),
  evening:   t('linear-gradient(160deg, #0c1220 0%, #162030 50%, #1e2838 100%)', 'linear-gradient(135deg, #1c2a3a 0%, #0c1220 100%)'),
  dusk:      t('linear-gradient(160deg, #060810 0%, #0e1420 50%, #141c28 100%)', 'linear-gradient(135deg, #121c28 0%, #060810 100%)'),
}

// ── 11 : Orage ────────────────────────────────────────────────────────────────
const THUNDER: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #060410 0%, #0e0a20 100%)', 'linear-gradient(135deg, #141030 0%, #060410 100%)'),
  dawn:      t('linear-gradient(160deg, #100818 0%, #1e1230 50%, #2a1a45 100%)', 'linear-gradient(135deg, #281848 0%, #100818 100%)'),
  morning:   t('linear-gradient(160deg, #0e0c20 0%, #1a1638 50%, #261e50 100%)', 'linear-gradient(135deg, #241e55 0%, #0e0c20 100%)'),
  afternoon: t('linear-gradient(160deg, #0f0c24 0%, #1e1545 50%, #2a1e58 100%)', 'linear-gradient(135deg, #2d2060 0%, #0f0c24 100%)'),
  evening:   t('linear-gradient(160deg, #0e0a1c 0%, #1a1230 50%, #24183c 100%)', 'linear-gradient(135deg, #221540 0%, #0e0a1c 100%)'),
  dusk:      t('linear-gradient(160deg, #08061a 0%, #100c28 50%, #180f35 100%)', 'linear-gradient(135deg, #160d35 0%, #08061a 100%)'),
}

// ── 13 : Neige ────────────────────────────────────────────────────────────────
const SNOW: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #080e18 0%, #101c2c 100%)', 'linear-gradient(135deg, #162434 0%, #080e18 100%)'),
  dawn:      t('linear-gradient(160deg, #1a2838 0%, #2c3e58 50%, #3c5070 100%)', 'linear-gradient(135deg, #3c5878 0%, #1a2838 100%)'),
  morning:   t('linear-gradient(160deg, #1a3050 0%, #2a4870 50%, #3a6090 100%)', 'linear-gradient(135deg, #4a7fa5 0%, #1a3050 100%)'),
  afternoon: t('linear-gradient(160deg, #1a3050 0%, #2a4870 50%, #3a6088 100%)', 'linear-gradient(135deg, #4880a8 0%, #1a3050 100%)'),
  evening:   t('linear-gradient(160deg, #182838 0%, #284060 50%, #385070 100%)', 'linear-gradient(135deg, #3a6080 0%, #182838 100%)'),
  dusk:      t('linear-gradient(160deg, #0c1422 0%, #141e30 50%, #1e2a40 100%)', 'linear-gradient(135deg, #203045 0%, #0c1422 100%)'),
}

// ── 50 : Brume ────────────────────────────────────────────────────────────────
const MIST: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #08091a 0%, #10121e 100%)', 'linear-gradient(135deg, #141828 0%, #08091a 100%)'),
  dawn:      t('linear-gradient(160deg, #201c18 0%, #383028 50%, #504540 100%)', 'linear-gradient(135deg, #504540 0%, #201c18 100%)'),
  morning:   t('linear-gradient(160deg, #202830 0%, #303a42 50%, #404e58 100%)', 'linear-gradient(135deg, #3d5166 0%, #202830 100%)'),
  afternoon: t('linear-gradient(160deg, #1a2030 0%, #2a3545 50%, #3a4858 100%)', 'linear-gradient(135deg, #3d5166 0%, #1a2030 100%)'),
  evening:   t('linear-gradient(160deg, #1e1c28 0%, #2c2835 50%, #3c3448 100%)', 'linear-gradient(135deg, #383244 0%, #1e1c28 100%)'),
  dusk:      t('linear-gradient(160deg, #0e0e1c 0%, #181620 50%, #201e28 100%)', 'linear-gradient(135deg, #1e1c28 0%, #0e0e1c 100%)'),
}

// ── Défaut (pas d'icône ou code inconnu) ──────────────────────────────────────
const DEFAULT_SKY: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #050a1c 0%, #0c1535 100%)', 'linear-gradient(135deg, #101e45 0%, #050a1c 100%)'),
  dawn:      t('linear-gradient(160deg, #1a0a06 0%, #6a2a10 50%, #b05020 100%)', 'linear-gradient(135deg, #a04a1e 0%, #1a0a06 100%)'),
  morning:   t('linear-gradient(160deg, #0c2040 0%, #1a3860 50%, #2a5080 100%)', 'linear-gradient(135deg, #285890 0%, #0c2040 100%)'),
  afternoon: t('linear-gradient(160deg, #0c1a3a 0%, #1a2e58 50%, #283e70 100%)', 'linear-gradient(135deg, #1e3a6e 0%, #0c1a3a 100%)'),
  evening:   t('linear-gradient(160deg, #3a1008 0%, #8a2c10 50%, #b05020 100%)', 'linear-gradient(135deg, #a04a20 0%, #3a1008 100%)'),
  dusk:      t('linear-gradient(160deg, #06081a 0%, #10142a 50%, #1a1e3a 100%)', 'linear-gradient(135deg, #1a2040 0%, #06081a 100%)'),
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
