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

// ── 01 : Ciel dégagé — tons chauds dorés/orange vif ─────────────────────────
const CLEAR: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #1e2a52 0%, #2c3a6a 100%)', 'linear-gradient(135deg, #344280 0%, #1e2a52 100%)'),
  dawn:      t('linear-gradient(160deg, #c85030 0%, #e07848 50%, #f09c68 100%)', 'linear-gradient(135deg, #e07848 0%, #c85030 100%)'),
  morning:   t('linear-gradient(160deg, #cc6a18 0%, #e89030 50%, #f4aa48 100%)', 'linear-gradient(135deg, #e89838 0%, #cc6a18 100%)'),
  afternoon: t('linear-gradient(160deg, #c86018 0%, #e08828 50%, #f4a838 100%)', 'linear-gradient(135deg, #ea9830 0%, #c86018 100%)'),
  evening:   t('linear-gradient(160deg, #b84828 0%, #d07040 50%, #e89058 100%)', 'linear-gradient(135deg, #d87848 0%, #b84828 100%)'),
  dusk:      t('linear-gradient(160deg, #2c1860 0%, #483080 50%, #6048a8 100%)', 'linear-gradient(135deg, #503888 0%, #2c1860 100%)'),
}

// ── 02 : Quelques nuages — bleu ciel chaleureux ───────────────────────────────
const FEW_CLOUDS: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #1c2848 0%, #283660 100%)', 'linear-gradient(135deg, #304070 0%, #1c2848 100%)'),
  dawn:      t('linear-gradient(160deg, #905848 0%, #b07860 50%, #c89070 100%)', 'linear-gradient(135deg, #b07060 0%, #905848 100%)'),
  morning:   t('linear-gradient(160deg, #2468b0 0%, #3888d0 50%, #50a4e8 100%)', 'linear-gradient(135deg, #3888d0 0%, #2468b0 100%)'),
  afternoon: t('linear-gradient(160deg, #2060a8 0%, #3480c8 50%, #4898e0 100%)', 'linear-gradient(135deg, #3480c8 0%, #2060a8 100%)'),
  evening:   t('linear-gradient(160deg, #885038 0%, #a87050 50%, #c08868 100%)', 'linear-gradient(135deg, #a86848 0%, #885038 100%)'),
  dusk:      t('linear-gradient(160deg, #1c1c48 0%, #262658 50%, #303070 100%)', 'linear-gradient(135deg, #282860 0%, #1c1c48 100%)'),
}

// ── 03 : Nuages épars — bleu acier doux ───────────────────────────────────────
const SCATTERED: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #1e2438 0%, #2a3050 100%)', 'linear-gradient(135deg, #303860 0%, #1e2438 100%)'),
  dawn:      t('linear-gradient(160deg, #886058 0%, #a07870 50%, #b89080 100%)', 'linear-gradient(135deg, #9c7068 0%, #886058 100%)'),
  morning:   t('linear-gradient(160deg, #305070 0%, #406888 50%, #5080a0 100%)', 'linear-gradient(135deg, #407090 0%, #305070 100%)'),
  afternoon: t('linear-gradient(160deg, #2c4868 0%, #3c6080 50%, #4c7898 100%)', 'linear-gradient(135deg, #3c6880 0%, #2c4868 100%)'),
  evening:   t('linear-gradient(160deg, #785040 0%, #986860 50%, #b08070 100%)', 'linear-gradient(135deg, #906050 0%, #785040 100%)'),
  dusk:      t('linear-gradient(160deg, #1c2038 0%, #242844 50%, #2e3054 100%)', 'linear-gradient(135deg, #28304e 0%, #1c2038 100%)'),
}

// ── 04 : Couvert — gris-bleu ardoise ─────────────────────────────────────────
const OVERCAST: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #222430 0%, #2c2e3c 100%)', 'linear-gradient(135deg, #343648 0%, #222430 100%)'),
  dawn:      t('linear-gradient(160deg, #605850 0%, #786e66 50%, #8a8078 100%)', 'linear-gradient(135deg, #746860 0%, #605850 100%)'),
  morning:   t('linear-gradient(160deg, #445060 0%, #566070 50%, #687280 100%)', 'linear-gradient(135deg, #586878 0%, #445060 100%)'),
  afternoon: t('linear-gradient(160deg, #404e5e 0%, #526070 50%, #647280 100%)', 'linear-gradient(135deg, #546878 0%, #404e5e 100%)'),
  evening:   t('linear-gradient(160deg, #484050 0%, #585060 50%, #686070 100%)', 'linear-gradient(135deg, #5a5060 0%, #484050 100%)'),
  dusk:      t('linear-gradient(160deg, #2c2838 0%, #363242 50%, #403c50 100%)', 'linear-gradient(135deg, #38384a 0%, #2c2838 100%)'),
}

// ── 09/10 : Pluie — bleu marine doux ─────────────────────────────────────────
const RAIN: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #1c2438 0%, #243040 100%)', 'linear-gradient(135deg, #2c3850 0%, #1c2438 100%)'),
  dawn:      t('linear-gradient(160deg, #303c4e 0%, #404c60 50%, #506070 100%)', 'linear-gradient(135deg, #3e5060 0%, #303c4e 100%)'),
  morning:   t('linear-gradient(160deg, #2c4460 0%, #3c5878 50%, #4c6e90 100%)', 'linear-gradient(135deg, #3c6080 0%, #2c4460 100%)'),
  afternoon: t('linear-gradient(160deg, #284058 0%, #385470 50%, #486888 100%)', 'linear-gradient(135deg, #385870 0%, #284058 100%)'),
  evening:   t('linear-gradient(160deg, #2c3448 0%, #3c4458 50%, #4c5468 100%)', 'linear-gradient(135deg, #3a4a5e 0%, #2c3448 100%)'),
  dusk:      t('linear-gradient(160deg, #202830 0%, #283038 50%, #303840 100%)', 'linear-gradient(135deg, #2c3840 0%, #202830 100%)'),
}

// ── 11 : Orage — indigo profond ───────────────────────────────────────────────
const THUNDER: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #201840 0%, #2c2250 100%)', 'linear-gradient(135deg, #342c60 0%, #201840 100%)'),
  dawn:      t('linear-gradient(160deg, #302040 0%, #402e52 50%, #503c64 100%)', 'linear-gradient(135deg, #3e3060 0%, #302040 100%)'),
  morning:   t('linear-gradient(160deg, #282048 0%, #382858 50%, #483068 100%)', 'linear-gradient(135deg, #343060 0%, #282048 100%)'),
  afternoon: t('linear-gradient(160deg, #262048 0%, #342858 50%, #423268 100%)', 'linear-gradient(135deg, #323060 0%, #262048 100%)'),
  evening:   t('linear-gradient(160deg, #241838 0%, #322048 50%, #402858 100%)', 'linear-gradient(135deg, #302050 0%, #241838 100%)'),
  dusk:      t('linear-gradient(160deg, #1c1430 0%, #281c40 50%, #342450 100%)', 'linear-gradient(135deg, #261c42 0%, #1c1430 100%)'),
}

// ── 13 : Neige — bleu glacé pastel ────────────────────────────────────────────
const SNOW: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #243040 0%, #303e50 100%)', 'linear-gradient(135deg, #384858 0%, #243040 100%)'),
  dawn:      t('linear-gradient(160deg, #485e70 0%, #607888 50%, #78909a 100%)', 'linear-gradient(135deg, #5e7888 0%, #485e70 100%)'),
  morning:   t('linear-gradient(160deg, #385a78 0%, #4c7090 50%, #6088a8 100%)', 'linear-gradient(135deg, #5480a0 0%, #385a78 100%)'),
  afternoon: t('linear-gradient(160deg, #365878 0%, #4a6e90 50%, #5e86a8 100%)', 'linear-gradient(135deg, #5280a0 0%, #365878 100%)'),
  evening:   t('linear-gradient(160deg, #385068 0%, #4a6480 50%, #5c7898 100%)', 'linear-gradient(135deg, #4e7490 0%, #385068 100%)'),
  dusk:      t('linear-gradient(160deg, #243040 0%, #2e3c4c 50%, #384858 100%)', 'linear-gradient(135deg, #32445a 0%, #243040 100%)'),
}

// ── 50 : Brume — gris-bleu neutre ─────────────────────────────────────────────
const MIST: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #242630 0%, #2e303a 100%)', 'linear-gradient(135deg, #343642 0%, #242630 100%)'),
  dawn:      t('linear-gradient(160deg, #605850 0%, #787068 50%, #8a8278 100%)', 'linear-gradient(135deg, #726860 0%, #605850 100%)'),
  morning:   t('linear-gradient(160deg, #485868 0%, #586878 50%, #687888 100%)', 'linear-gradient(135deg, #5a7080 0%, #485868 100%)'),
  afternoon: t('linear-gradient(160deg, #445668 0%, #546678 50%, #647888 100%)', 'linear-gradient(135deg, #567080 0%, #445668 100%)'),
  evening:   t('linear-gradient(160deg, #484060 0%, #584e70 50%, #685e80 100%)', 'linear-gradient(135deg, #524868 0%, #484060 100%)'),
  dusk:      t('linear-gradient(160deg, #282830 0%, #30303a 50%, #383844 100%)', 'linear-gradient(135deg, #323240 0%, #282830 100%)'),
}

// ── Défaut (page d'accueil, pas d'icône) ──────────────────────────────────────
const DEFAULT_SKY: Record<Period, WeatherTheme> = {
  night:     t('linear-gradient(160deg, #1e2a52 0%, #2a3868 100%)', 'linear-gradient(135deg, #304078 0%, #1e2a52 100%)'),
  dawn:      t('linear-gradient(160deg, #b84828 0%, #d07040 50%, #e89460 100%)', 'linear-gradient(135deg, #cc7040 0%, #b84828 100%)'),
  morning:   t('linear-gradient(160deg, #2468a8 0%, #3888c8 50%, #50a0e0 100%)', 'linear-gradient(135deg, #3888c8 0%, #2468a8 100%)'),
  afternoon: t('linear-gradient(160deg, #2060a0 0%, #3480c0 50%, #4898d8 100%)', 'linear-gradient(135deg, #3480c0 0%, #2060a0 100%)'),
  evening:   t('linear-gradient(160deg, #a84020 0%, #c86038 50%, #e08050 100%)', 'linear-gradient(135deg, #c06038 0%, #a84020 100%)'),
  dusk:      t('linear-gradient(160deg, #201848 0%, #302268 50%, #402c88 100%)', 'linear-gradient(135deg, #2e2870 0%, #201848 100%)'),
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
