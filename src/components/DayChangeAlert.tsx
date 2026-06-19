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
    alerts.push({
      emoji: '🌡️',
      text: `${min}° → ${max}° — prévois une couche à enlever !`,
    })
  } else if (amplitude >= 6) {
    alerts.push({
      emoji: '🌡️',
      text: `${min}° → ${max}° dans la journée — garde une couche !`,
    })
  }

  if (rainOnlyPart && rainStart !== -1) {
    const rainSlot = activeSlots[rainStart]
    alerts.push({
      emoji: '🌂',
      text: `Pluie dès ${rainSlot.label.toLowerCase()} — pense au parapluie !`,
    })
  }

  const snowSlot = activeSlots.find((s) => s.snow)
  if (snowSlot) {
    alerts.push({ emoji: '❄️', text: `Neige ${snowSlot.label.toLowerCase()} — couvre-toi !` })
  }

  if (alerts.length === 0) return null

  return (
    <section aria-label="Alertes météo de la journée" aria-live="polite" aria-atomic="false" className="space-y-2">
      {alerts.map((alert, i) => (
        <div
          key={i}
          className="flex gap-2 items-center bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl px-3 py-2.5 shadow-lg shadow-black/10"
        >
          <span aria-hidden="true" className="text-base leading-none flex-shrink-0">{alert.emoji}</span>
          <p className="text-sm font-medium text-white leading-snug">{alert.text}</p>
        </div>
      ))}
    </section>
  )
}
