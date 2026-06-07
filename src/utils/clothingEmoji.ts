import type { ClothingItem } from '../types'

const NAME_EMOJI: Record<string, string> = {
  // Manteaux
  'doudoune': '🧥',
  'manteau': '🧥',
  'veste': '🫱',
  'imperméable': '🌧️',
  'blouson': '🫱',
  'parka': '🧥',
  'trench': '🧥',
  'blazer': '👔',
  'hoodie': '👕',
  // Hauts
  'pull': '🧶',
  'sweat': '👕',
  't-shirt': '👕',
  'tshirt': '👕',
  'chemise': '👔',
  'polo': '👕',
  'top': '👕',
  'débardeur': '👕',
  'body': '👕',
  // Bas
  'jean': '👖',
  'pantalon': '👖',
  'short': '🩳',
  'jupe': '👗',
  'robe': '👗',
  'legging': '🩱',
  'collant': '🧦',
  // Chaussures
  'boots': '🥾',
  'bottes': '🥾',
  'basket': '👟',
  'baskets': '👟',
  'sneakers': '👟',
  'sandales': '👡',
  'sandale': '👡',
  'mocassins': '🥿',
  'chaussures': '👞',
  'talons': '👠',
  // Accessoires
  'bonnet': '🧢',
  'casquette': '🧢',
  'chapeau': '🎩',
  'écharpe': '🧣',
  'gants': '🧤',
  'lunettes': '🕶️',
  'parapluie': '☂️',
  'sac': '👜',
  'ceinture': '🪢',
}

const CATEGORY_EMOJI: Record<string, string> = {
  haut: '👕',
  bas: '👖',
  manteau: '🧥',
  chaussures: '👟',
  accessoire: '✨',
}

export function getClothingEmoji(item: ClothingItem): string {
  const lower = item.name.toLowerCase()
  for (const [key, emoji] of Object.entries(NAME_EMOJI)) {
    if (lower.includes(key)) return emoji
  }
  return CATEGORY_EMOJI[item.category] ?? '👕'
}
