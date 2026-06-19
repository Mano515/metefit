export interface WeatherTheme {
  bg: string
  card: string
}

export const BRAND_BG   = 'linear-gradient(160deg, #7dd3fc 0%, #0ea5e9 50%, #0369a1 100%)'
export const BRAND_CARD = 'linear-gradient(45deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)'

const THEME: WeatherTheme = { bg: BRAND_BG, card: BRAND_CARD }

// Parameters kept for future per-condition theming without breaking callers
export function getWeatherTheme(_icon?: string, _hour?: number): WeatherTheme {
  return THEME
}

// Legacy export — prefer getWeatherTheme for new callers
export function getWeatherGradient(_icon?: string): string {
  return BRAND_BG
}
