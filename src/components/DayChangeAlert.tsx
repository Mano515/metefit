import type { TimeSlot } from '../types'

interface Props {
  slots: TimeSlot[]
}

export function DayChangeAlert({ slots }: Props) {
  if (slots.length < 2) return null

  const temps = slots.map((s) => s.temp)
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const amplitude = max - min

  const rainStart = slots.findIndex((s) => s.rain)
  const rainOnlyPart = rainStart > 0 // Pluie qui arrive en cours de journée

  const alerts: { emoji: string; text: string }[] = []

  if (amplitude >= 10) {
    const coldSlot = slots.find((s) => s.temp === min)
    const hotSlot = slots.find((s) => s.temp === max)
    alerts.push({
      emoji: '🌡️',
      text: `Grosse amplitude : ${min}° le ${coldSlot?.label.toLowerCase()} → ${max}° ${hotSlot?.label.toLowerCase()}. Prévois une couche à enlever.`,
    })
  } else if (amplitude >= 6) {
    alerts.push({
      emoji: '🌡️',
      text: `Amplitude de ${amplitude}° dans la journée (${min}° → ${max}°). Adapte-toi.`,
    })
  }

  if (rainOnlyPart && rainStart !== -1) {
    const rainSlot = slots[rainStart]
    alerts.push({
      emoji: '🌂',
      text: `Pluie prévue à partir de ${rainSlot.label.toLowerCase()} — pense au parapluie.`,
    })
  }

  const snowSlot = slots.find((s) => s.snow)
  if (snowSlot) {
    alerts.push({ emoji: '❄️', text: `Neige prévue ${snowSlot.label.toLowerCase()}.` })
  }

  if (alerts.length === 0) return null

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => (
        <div key={i} className="flex gap-2 items-start bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <span className="text-base flex-shrink-0">{alert.emoji}</span>
          <p className="text-xs text-amber-800 leading-snug">{alert.text}</p>
        </div>
      ))}
    </div>
  )
}
