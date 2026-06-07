import { useState } from 'react'
import type { ThermalProfile } from '../types'

const KEY = 'metefit_thermal'
const OFFSET: Record<ThermalProfile, number> = { frileux: -5, normal: 0, chaud: 5 }

export function useThermal() {
  const [profile, setProfileState] = useState<ThermalProfile>(
    () => (localStorage.getItem(KEY) as ThermalProfile) ?? 'normal'
  )

  function setProfile(p: ThermalProfile) {
    setProfileState(p)
    localStorage.setItem(KEY, p)
  }

  return { profile, setProfile, offset: OFFSET[profile] }
}
