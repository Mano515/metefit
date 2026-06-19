interface Props {
  permission: NotificationPermission
  onRequest: () => void
}

export function NotificationBanner({ permission, onRequest }: Props) {
  if (typeof Notification === 'undefined' || permission !== 'default') return null

  return (
    <div role="region" aria-label="Notifications matinales" className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3">
      <span aria-hidden="true" className="text-xl">🔔</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white">Notifications matinales</p>
        <p className="text-xs text-white/50">Reçois ta tenue du jour à l'ouverture de l'app le matin.</p>
      </div>
      <button
        type="button"
        onClick={onRequest}
        aria-label="Activer les notifications matinales"
        className="flex-shrink-0 bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        Activer
      </button>
    </div>
  )
}
