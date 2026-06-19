import type { TimeSlot } from '../types'

interface Props {
  slots: TimeSlot[]
}

export function DayChangeAlert({ slots }: Props) {
  const activeSlots = slots.filter((s) => !s.isPast)
  if (activeSlots.length < 2) return null

  const temps = activeSlots.map((s) => s.temp)
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const amplitude = max - min

  const rainStart = activeSlots.findIndex((s) => s.rain)
  const rainOnlyPart = rainStart > 0

  const alerts: { emoji: string; text: string }[] = []

  if (amplitude >= 10) {
    const coldSlot = activeSlots.find((s) => s.temp === min)
    const hotSlot = activeSlots.find((s) => s.temp === max)
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
    const rainSlot = activeSlots[rainStart]
    alerts.push({
      emoji: '🌂',
      text: `Pluie prévue à partir de ${rainSlot.label.toLowerCase()} — pense au parapluie.`,
    })
  }

  const snowSlot = activeSlots.find((s) => s.snow)
  if (snowSlot) {
    alerts.push({ emoji: '❄️', text: `Neige prévue ${snowSlot.label.toLowerCase()}.` })
  }

  if (alerts.length === 0) return null

  return (
    <section aria-label="Alertes météo de la journée" aria-live="polite" aria-atomic="false" className="space-y-2">
      {alerts.map((alert, i) => (
        <div
          key={i}
          className="flex gap-2 items-start bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl px-3 py-2.5"
        >
          <span aria-hidden="true" className="text-base flex-shrink-0">{alert.emoji}</span>
          <p className="text-xs text-white/90 leading-snug">{alert.text}</p>
        </div>
      ))}
    </section>
  )
}
