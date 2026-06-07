import { useState } from 'react'
import type { ThermalProfile, HistoryEntry } from '../types'

const KEY = 'metefit_thermal'
const OFFSET_KEY = 'metefit_thermal_offset'

export const PROFILE_BASE: Record<ThermalProfile, number> = { frileux: -5, normal: 0, chaud: 5 }

function loadOffset(): number {
  return Number(localStorage.getItem(OFFSET_KEY) ?? '0')
}

// Analyse les N derniers retours et retourne un ajustement suggéré (-1, 0, ou +1)
export function computeAutoAdjust(entries: HistoryEntry[]): number {
  const recent = entries.slice(0, 10)
  if (recent.length < 3) return 0
  const hot = recent.filter((e) => e.feedback === 'trop_chaud').length
  const cold = recent.filter((e) => e.feedback === 'trop_froid').length
  const ratio = recent.length
  if (hot / ratio >= 0.5) return 1   // Majorité trop chaud → décaler +1°C
  if (cold / ratio >= 0.5) return -1 // Majorité trop froid → décaler -1°C
  return 0
}

export function useThermal() {
  const [profile, setProfileState] = useState<ThermalProfile>(
    () => (localStorage.getItem(KEY) as ThermalProfile) ?? 'normal'
  )
  const [autoOffset, setAutoOffset] = useState<number>(loadOffset)
  const [lastAutoAdjust, setLastAutoAdjust] = useState<number>(0)

  function setProfile(p: ThermalProfile) {
    setProfileState(p)
    setAutoOffset(0)
    localStorage.setItem(KEY, p)
    localStorage.setItem(OFFSET_KEY, '0')
  }

  // Appelé après chaque feedback pour recalculer l'offset automatique
  function recalibrate(entries: HistoryEntry[]) {
    const adjust = computeAutoAdjust(entries)
    if (adjust === 0) return
    const next = Math.max(-8, Math.min(8, autoOffset + adjust))
    if (next === autoOffset) return
    setAutoOffset(next)
    setLastAutoAdjust(adjust)
    localStorage.setItem(OFFSET_KEY, String(next))
  }

  function clearAutoAdjustNotice() {
    setLastAutoAdjust(0)
  }

  const baseOffset = PROFILE_BASE[profile]
  const offset = baseOffset + autoOffset

  return { profile, setProfile, offset, autoOffset, lastAutoAdjust, clearAutoAdjustNotice, recalibrate }
}
