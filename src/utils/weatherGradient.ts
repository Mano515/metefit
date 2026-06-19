export interface WeatherTheme {
  bg: string
  card: string
}

export const BRAND_BG   = 'linear-gradient(160deg, #bae6fd 0%, #38bdf8 50%, #0ea5e9 100%)'
export const BRAND_CARD = 'linear-gradient(135deg, #0284c7 0%, #075985 100%)'

const THEME: WeatherTheme = { bg: BRAND_BG, card: BRAND_CARD }

export function getWeatherTheme(_icon?: string, _hour?: number): WeatherTheme {
  return THEME
}

export function getWeatherGradient(_icon?: string): string {
  return BRAND_BG
}
