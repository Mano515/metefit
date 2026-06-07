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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600 transition-opacity duration-500 ${hiding ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Icône météo animée */}
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center">
          {/* Halo pulsant — désactivé si prefers-reduced-motion */}
          <span className="absolute w-24 h-24 rounded-full bg-white/20 animate-ping motion-reduce:animate-none" style={{ animationDuration: '1.5s' }} />
          <span className="relative text-6xl select-none">🌤️</span>
        </div>

        {/* Nom de l'app */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Météfit</h1>
          <p className="text-sm text-white/70 mt-1">La tenue idéale selon la météo</p>
        </div>

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
