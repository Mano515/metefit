import { useEffect, useState } from 'react'

interface Props {
  onDone: () => void
}

export function SplashScreen({ onDone }: Props) {
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiding(true)
      setTimeout(onDone, 500)
    }, 1400)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div
      aria-label="Chargement de Météfit"
      role="status"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${hiding ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: 'linear-gradient(160deg, #bae6fd 0%, #38bdf8 50%, #0ea5e9 100%)' }}
    >
      {/* Icône météo animée */}
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center">
          {/* Halo pulsant — désactivé si prefers-reduced-motion */}
          <span className="absolute w-32 h-32 rounded-full bg-white/20 animate-ping motion-reduce:animate-none" style={{ animationDuration: '1.5s' }} />
          <img src="/logo_metefit.svg" alt="" aria-hidden="true" className="relative w-24 h-24" />
        </div>

        {/* Logo avec nom */}
        <img src="/logo_metefit_nom.svg" alt="Météfit" className="h-12 w-auto mt-1" />
        <p className="text-sm text-white/70 -mt-2">La tenue idéale selon la météo</p>

        {/* Barre de progression */}
        <div className="w-40 h-1 bg-white/20 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-white rounded-full"
            style={{ animation: 'splash-bar 1.4s ease forwards' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes splash-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  )
}
